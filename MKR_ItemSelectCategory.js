//===============================================================================
// MKR_ItemSelectCategory.js
//===============================================================================
// Copyright (c) 2021 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 2.1.0 2024/02/06 ・表示するアイテムの対象として
//                    武器/防具のタイプを指定できるように改修。
//                  ・RPGツクールMZ版プラグインはファイルを分離してあったため
//                    本ファイルのMZ対応コードを削除。
//
// 2.0.0 2021/04/26 ・RPGツクールMZに対応。
//                  ・コードをリファクタリング
//
// 1.0.1 2017/12/10 ・アイテムメニューのカテゴリ設定を追加。
//
// 1.0.0 2017/10/25 ・初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v2.1.0) アイテム選択カテゴリ設定プラグイン
 * @author マンカインド
 *
 * @help = アイテム選択カテゴリ設定プラグイン =
 * MKR_ItemSelectCategory.js
 *
 * ※本プラグインはv2.1.0よりツクールMV専用です。
 *   ツクールMZ用プラグインは下記よりダウンロードをお願いいたします。
 *     https://github.com/mankindGames/RPGTkoolMZ
 *
 * [アイテム選択の処理]イベントコマンドで"武器"や"防具"を選択可能にします。
 * 選択後、選択したカテゴリに属するアイテムのIDが指定した変数へと格納されます。
 *
 * 以下のプラグインコマンドを[アイテム選択の処理]前に使うことで、
 * アイテム選択ウィンドウに表示されるアイテムを切り替えられます。
 *
 * [コピー用]
 *   ItemCategory weapon
 *   ItemCategory weapon 3
 *   ItemCategory armor
 *   ItemCategory armor 2
 *   ItemCategory armor 0 4
 *   ItemCategory armor 2 3
 *   ItemCategory item
 *
 * なお、カテゴリが武器(weapon)の場合は"武器タイプ"が、
 * カテゴリが防具(armor)の場合は"防具タイプ"、"装備タイプ"を
 * プラグインコマンド使用時に追加で指定することができます。
 *
 * ○○タイプは、ツクールエディターの[データベース]画面左の[タイプ]を
 * 選択することで確認・設定できます。
 *
 * プラグインコマンドでタイプを指定する場合、
 * タイプ名ではなくタイプ番号で指定してください。
 *
 * タイプ番号として 0 を指定した場合や、未指定の場合は
 * すべてのタイプを対象として表示するアイテムを切り替えます。
 *
 * [プラグインコマンド例]
 *   ※コマンド例の前提として
 *     タイプが下記のように設定されているものとします。
 *       [武器タイプ]
 *         01:短剣
 *         02:剣
 *         03:フレイル
 *       [防具タイプ]
 *         01:一般防具
 *         02:魔法防具
 *         03:軽装防具
 *       [装備タイプ]
 *         01:武器
 *         02:盾
 *         03:頭
 *
 *   ・ItemCategory weapon
 *       武器のみアイテム選択ウィンドウに表示します。
 *
 *   ・ItemCategory weapon 3
 *       武器タイプが3(フレイル)となっている武器のみ
 *       アイテム選択ウィンドウに表示します。
 *
 *   ・ItemCategory armor
 *       防具のみアイテム選択ウィンドウに表示します。
 *
 *   ・ItemCategory armor 2
 *       防具タイプが2(魔法防具)となっている防具のみ
 *       アイテム選択ウィンドウに表示します。
 *
 *   ・ItemCategory armor 0 3
 *       防具タイプが0(全て対象)であり、装備タイプが3(頭)となっている
 *       防具のみアイテム選択ウィンドウに表示します。
 *
 *   ・ItemCategory armor 2 3
 *       防具タイプが2(魔法防具)であり、装備タイプが3(頭)となっている
 *       防具のみアイテム選択ウィンドウに表示します。
 *
 *   ・ItemCategory item
 *       アイテムのみアイテム選択ウィンドウに表示します。
 *
 * アイテム選択ウィンドウが閉じられると、アイテムカテゴリは
 * プラグインパラメータ[初期アイテムカテゴリ]で選択したものに
 * 変更されます。
 *
 *
 * プラグインコマンド:
 *   ItemCategory [weapon/armor/item] [タイプ番号1] [タイプ番号2]
 *     ・[weapon/armor/item]
 *         アイテム選択の処理で表示されるアイテムのカテゴリを変更します。
 *           weapon : カテゴリを"武器"に変更します。
 *            armor : カテゴリを"防具"に変更します。
 *             item : カテゴリを"アイテム"に変更します。(元々のカテゴリ)
 *
 *     ・[タイプ番号1]
 *         アイテムカテゴリが"weapon"か"armor"のときのみ設定可能です。
 *         "weapon"の場合は武器タイプを
 *         "armor"の場合は防具タイプを変更します。
 *
 *     ・[タイプ番号2]
 *         アイテムカテゴリが"armor"のときのみ設定可能です。
 *         装備タイプを変更します。
 *
 *
 * スクリプトコマンド:
 *   ありません。
 *
 *
 * 補足：
 *   ・このプラグインに関するプラグインコマンドは
 *     大文字/小文字を区別していません。
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
 *   ・要望などがある場合、本プラグインのバージョンアップを行う
 *     可能性がありますが、
 *     バージョンアップにより本プラグインの仕様が変更される可能性があります。
 *     ご了承ください。
 *
 * ==============================================================================
 *
 * @param init_item_category
 * @text 初期アイテムカテゴリ
 * @desc 初期状態でアイテム選択ウィンドウに表示されるアイテムのカテゴリを設定します。(デフォルト:アイテム)
 * @type select
 * @option アイテム
 * @value item
 * @option 武器
 * @value weapon
 * @option 防具
 * @value armor
 * @default item
 *
 * @param item_menu_category
 * @text アイテムメニューカテゴリ
 * @desc アイテムメニューを開いたときに選択されているアイテムのカテゴリを設定します。(デフォルト:アイテム)
 * @type select
 * @option アイテム
 * @value item
 * @option 武器
 * @value weapon
 * @option 防具
 * @value armor
 * @option 大事なもの
 * @value keyItem
 * @default item
 *
*/

(() => {
    'use strict';

    //=========================================================================
    // Parameter
    //  ・プラグインパラメータの取得と加工
    //
    //=========================================================================
    const pluginName = document.currentScript.src.split("/").pop().replace(/\.js$/, "");
    const pluginParameter = PluginManager.parameters(pluginName);

    const settings = {
        initItemCategory: String(pluginParameter["init_item_category"]).trim(),
        itemMenuCategory: String(pluginParameter["item_menu_category"]).trim(),
    };


    //=========================================================================
    // Game_Interpreter
    //  ・アイテムカテゴリ設定用コマンドを定義します。
    //
    //=========================================================================
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        if(command.toLowerCase() === "itemcategory") {
            const category = args[0].toLowerCase();
            const type1 = (args.length > 1) ? parseInt(args[1]) : 0;
            const type2 = (args.length > 2) ? parseInt(args[2]) : 0;
            switch(category) {
                case "weapon":
                    $gameMessage.setItemChoiceCategory(category);
                    $gameMessage.setItemChoiceType1(type1);
                    break;
                case "armor":
                    $gameMessage.setItemChoiceCategory(category);
                    $gameMessage.setItemChoiceType1(type1);
                    $gameMessage.setItemChoiceType2(type2);
                    break;
                case "item":
                    $gameMessage.setItemChoiceCategory(category);
                    break;
            }
        }
    };


    //=========================================================================
    // Game_Message
    //  ・アイテム選択ウィンドウに関する変数を定義します。
    //
    //=========================================================================
    const _Game_Message_clear = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        _Game_Message_clear.call(this);
        this._itemChoiceCategory = settings.initItemCategory;
        this._itemChoiceType1 = 0;
        this._itemChoiceType2 = 0;
    };

    Game_Message.prototype.itemChoiceCategory = function() {
        return this._itemChoiceCategory;
    };

    Game_Message.prototype.setItemChoiceCategory = function(category) {
        this._itemChoiceCategory = category;
    };

    Game_Message.prototype.itemChoiceType1 = function() {
        return this._itemChoiceType1;
    };

    Game_Message.prototype.setItemChoiceType1 = function(type) {
        this._itemChoiceType1 = type;
    };

    Game_Message.prototype.itemChoiceType2 = function() {
        return this._itemChoiceType2;
    };

    Game_Message.prototype.setItemChoiceType2 = function(type) {
        this._itemChoiceType2 = type;
    };


    //=========================================================================
    // Window_EventItem
    //  ・アイテム選択ウィンドウの項目を再定義します。
    //
    //=========================================================================
    const _Window_EventItem_includes = Window_EventItem.prototype.includes;
    Window_EventItem.prototype.includes = function(item) {
        let result = true;
        switch($gameMessage.itemChoiceCategory()) {
            case 'armor': {
                if(!DataManager.isArmor(item)) {
                    return false;
                }

                const type1 = $gameMessage.itemChoiceType1();
                const type2 = $gameMessage.itemChoiceType2();

                if(result && type1) {
                    result = item.atypeId === type1;
                }
                if(result && type2) {
                    result = item.etypeId === type2;
                }

                return result;
            }
            case 'weapon': {
                if(!DataManager.isWeapon(item)) {
                    return false;
                }

                const type1 = $gameMessage.itemChoiceType1();

                if(result && type1) {
                    result = item.wtypeId === type1;
                }

                return result;
            }
            default: {
                return _Window_EventItem_includes.call(this, item);
            }
        }
    };


    //=========================================================================
    // Window_ItemCategory
    //  ・アイテムメニューのカテゴリウィンドウの項目を再定義します。
    //
    //=========================================================================
    const _Window_ItemCategory_initialize = Window_ItemCategory.prototype.initialize;
    Window_ItemCategory.prototype.initialize = function(rect) {
        _Window_ItemCategory_initialize.call(this, rect);
        this.selectSymbol(settings.itemMenuCategory);
    };

})();