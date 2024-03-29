//===============================================================================
// MKR_EquipItemUse.js
//===============================================================================
// (c) 2022 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 2.0.0 2022/02/19 ・アイテム用スキルの設定方法を変更。
//
// 1.0.0 2022/02/13 ・初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v2.0.0) 装備アイテム使用プラグイン
 * @author マンカインド
 *
 * @help = 装備アイテム使用プラグイン =
 * MKR_EquipItemUse.js
 *
 * アイテムスキルを持つ装備(武器、防具)をアイテム欄に表示させ
 * その装備を使用することでアイテムスキルの効果が発動するようにします。
 *
 * アイテムとして使用した装備は通常アイテムと同じように数が1減ります。
 * また装備済みのアイテムはアイテム個数として数えません。
 *
 * 装備に複数のアイテムスキルが設定されている場合
 * アイテムとして使用されるのは先頭スキルのみです。
 *
 *
 * ＜アイテムスキルの設定方法＞
 * 装備のメモ欄に下記のように記述します。
 * (スキルID:12のスキルをアイテムスキルとして使用したい場合)
 *
 *   <アイテムスキル:12>
 *
 *
 * 利用規約:
 *   ・作者に無断で本プラグインの改変、再配布が可能です。
 *     (ただしヘッダーの著作権表示部分は残してください。)
 *
 *   ・利用形態(フリーゲーム、商用ゲーム、R-18作品等)に制限はありません。
 *     ご自由にお使いください。
 *
 *   ・本プラグインを使用したことにより発生した問題について作者は一切の責任を
 *     負いません。
 *
 *   ・本プラグインのバージョンアップを行う可能性がありますが、
 *     バージョンアップにより本プラグインの仕様が変更される可能性があります。
 *     予めご了承ください。
 *
 * ==============================================================================
 *
*/


(() => {
    "use strict";


    //=========================================================================
    // Variable
    //  ・ローカル変数
    //
    //=========================================================================
    const tag = "アイテムスキル";


    //=========================================================================
    // Function
    //  ・ローカル関数
    //
    //=========================================================================
    /**
     * 装備アイテムにアイテムスキルが設定されているかを判定する
     * @param {RPG.EquipItem} item アイテムオブジェクト
     * @returns {Boolean} アイテムスキルが設定されているかどうか？
     */
    function existsItemSkill(item) {
        return DataManager.isEquipItem(item) && !!item.meta[tag];
    }

    /**
     * 装備アイテムデータからアイテムスキルのデータリストを返す。
     * 返却するスキルオブジェクトには以下のプロパティを追加する。
     *   isCostIgnored : スキル発動の際に支払うコスト(MP/TP)、
     *                   スキル使用に必要な装備条件を無視するフラグ
     *   baseItem : アイテムオブジェクト
     * @param {RPG.EquipItem} item アイテムオブジェクト
     * @returns {RPG.Skill[]} スキルデータリスト
     */
    function getItemSkillDataList(item) {
        const note = item.note.toLowerCase();
        const noteList = note.split(/[ \n](?=<)/);
        return noteList.filter(line => new RegExp(tag).test(line)).map(line => {
            const [, value] = line.replace(/[<> ]/g, "").split(":");
            const skillId = Number(value.trim());
            const skillData = $dataSkills[skillId];
            skillData.isCostIgnored = true;
            skillData.baseItem = item;
            return skillData;
        })

    }

    /**
     * 装備アイテムデータからアイテムスキルのデータを返す。
     * @param {RPG.EquipItem} item アイテムオブジェクト
     * @returns {RPG.Skill} スキルデータ
     */
    function getItemSkillData(item) {
        return getItemSkillDataList(item).shift();
    }


    //=========================================================================
    // DataManager
    //  ・装備アイテム判定用関数を追加
    //
    //=========================================================================
    DataManager.isEquipItem = function(item) {
        return this.isWeapon(item) || this.isArmor(item);
    };


    //=========================================================================
    // Game_BattlerBase
    //  ・装備をアイテムとして使用する場合にスキル使用可否判定を行う
    //
    //=========================================================================
    const _Game_BattlerBase_meetsSkillConditions = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
        const ret = _Game_BattlerBase_meetsSkillConditions.call(this, skill);
        if(skill.isCostIgnored) {
            // スキル使用可否判定:
            //   ・使用者が行動可能であること
            //   ・スキル使用シーンが適切であること
            //   ・ベースアイテム(装備アイテム)の個数が1以上であること
            return this.meetsUsableItemConditions(skill) && $gameParty.numItems(skill.baseItem) >= 1;
        }

        return ret;
    };


    //=========================================================================
    // Game_Battler
    //  ・装備をアイテムとして使用するとき、対象の個数を減らす処理を追加
    //
    //=========================================================================
    const _Game_Battler_useItem = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function(item) {
        if(item.baseItem) {
            this.consumeEquipItem(item.baseItem);
        } else {
            _Game_Battler_useItem.call(this, item);
        }
    };

    Game_Battler.prototype.consumeEquipItem = function(item) {
        $gameParty.consumeEquipItem(item);
    };


    //=========================================================================
    // Game_Party
    //  ・装備アイテムの個数を減らす処理
    //
    //=========================================================================
    Game_Party.prototype.consumeEquipItem = function(item) {
        if (DataManager.isEquipItem(item) && $gameParty.numItems(item) >= 1) {
            this.loseItem(item, 1);
        }
    };


    //=========================================================================
    // Window_ItemList
    //  ・アイテム欄に追加スキルを持つ装備アイテムを表示し、使用可能にする
    //
    //=========================================================================
    Window_ItemList.prototype.isSelectItemcategory = function() {
        return this._category === "item";
    }

    Window_ItemList.prototype.isItemSkillEnabled = function(item) {
        // バトルシーンではカテゴリを選択しない
        return existsItemSkill(item) && ($gameParty.inBattle()) ? true : this.isSelectItemcategory();
    }

    const _Window_ItemList_includes = Window_ItemList.prototype.includes;
    Window_ItemList.prototype.includes = function(item) {
        const ret = _Window_ItemList_includes.call(this, item);
        // アイテムカテゴリを選択していて対象アイテムが追加スキルを持っている
        if(!ret && this.isItemSkillEnabled(item)) {
            return true;
        }

        return ret;
    };

    const _Window_ItemList_isEnabled = Window_ItemList.prototype.isEnabled;
    Window_ItemList.prototype.isEnabled = function(item) {
        const ret = _Window_ItemList_isEnabled.call(this, item);
        if(!ret && this.isItemSkillEnabled(item)) {
            // アイテムスキルデータ
            return $gameParty.canUse(getItemSkillData(item));
        }

        return ret;
    };


    //=========================================================================
    // Window_BattleItem
    //  ・アイテム欄に追加スキルを持つ装備アイテムを表示し、使用可能にする
    //
    //=========================================================================
    const _Window_BattleItem_includes = Window_BattleItem.prototype.includes;
    Window_BattleItem.prototype.includes = function(item) {
        const ret = _Window_BattleItem_includes.call(this, item);
        // 対象のアイテムが装備であり、アイテムスキルを持っている
        if(!ret && this.isItemSkillEnabled(item)) {
            return true;
        }

        return ret;
    };


    //=========================================================================
    // Window_BattleLog
    //  ・装備アイテムの追加スキルを使用したとき、
    //    アイテム使用時のメッセージを表示する
    //
    //=========================================================================
    const _Window_BattleLog_displayAction = Window_BattleLog.prototype.displayAction;
    Window_BattleLog.prototype.displayAction = function(subject, item) {
        if(item.baseItem) {
            const numMethods = this._methods.length;

            /**
             * @type {RPG.UsableItem}
             */
            const baseItem = item.baseItem;
            this.push('addText', TextManager.useItem.format(subject.name(), baseItem.name));

            if(this._methods.length === numMethods) {
                this.push('wait');
            }

            return;
        }
        _Window_BattleLog_displayAction.call(this, subject, item);
    };


    //=========================================================================
    // Scene_ItemBase
    //  ・アイテム欄で装備アイテムを使用したとき、
    //    装備アイテムデータの代わりに追加スキルデータを返す
    //
    //=========================================================================
    const _Scene_ItemBase_item = Scene_ItemBase.prototype.item;
    Scene_ItemBase.prototype.item = function() {
        /**
         * @type {Window}
         */
        const window = this._itemWindow;
        /**
         * @type {RPG.Item}
         */
        const item = window.item();
        if(window.isItemSkillEnabled(item)) {
            // アイテムスキルデータ
            return getItemSkillData(item);
        }

        return _Scene_ItemBase_item.call(this);
    };


    //=========================================================================
    // Scene_ItemBase
    //  ・アイテム欄で装備アイテムを使用したとき、
    //    装備アイテムが持つ追加スキルを使用したことにする
    //
    //=========================================================================
    const _Scene_Battle_onItemOk = Scene_Battle.prototype.onItemOk;
    Scene_Battle.prototype.onItemOk = function() {
        /**
         * @type {Window}
         */
        const window = this._itemWindow;
         /**
          * @type {RPG.Item}
          */
        const item = this._itemWindow.item();
        if(window.isItemSkillEnabled(item)) {
            // アイテムスキルデータ
            const itemSkill = getItemSkillData(item);
            const action = BattleManager.inputtingAction();
            action.setSkill(itemSkill.id);
            $gameParty.setLastItem(item);
            this.onSelectAction();
            return;
        }

        _Scene_Battle_onItemOk.call(this);
    };


})();