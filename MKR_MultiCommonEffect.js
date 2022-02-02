//===============================================================================
// MKR_MultiCommonEffect.js
//===============================================================================
// (c) 2022 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 0.1.0 2022/02/02 ・YEP_BattleEngineCoreとの併用に対応。
//
// 0.0.1 2022/02/02 ・試作版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v0.1.0) 複数コモンイベント効果
 * @author マンカインド
 *
 * @help = 複数コモンイベント効果 =
 * MKR_MultiCommonEffect.js
 *
 * 使用効果として複数のコモンイベントを設定した場合に
 * 一番最後に設定したコモンイベントしか呼び出されない問題を改善し
 * 設定順にコモンイベントを呼び出すようにします。
 *
 *
 * ＜YEP_BattleEngineCore.jsと併用する場合＞
 *   ・プラグイン管理画面で本プラグインを
 *     YEP_BattleEngineCoreより下に配置してください。
 *   ・プラグインファイル名は変更しないでください。
 *
 *
 * プラグインパラメーター:
 *   ありません。
 *
 *
 * プラグインコマンド:
 *   ありません。
 *
 *
 * スクリプトコマンド:
 *   ありません。
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
*/

(() => {
    "use strict";

    //=========================================================================
    // Function
    //  ・ローカル関数
    //
    //=========================================================================
    /**
     * 引数のコモンイベントID配列の逆順にイベントを予約する(実行順は予約と逆になる)
     * @param {Game_Interpreter} target インタープリターオブジェクト
     * @param {Number[]} commonEventIdList コモンイベント番号配列
     */
    function runMultiCommonEvent(target, commonEventIdList) {
        let reTarget = target;
        commonEventIdList.reverse().forEach(commonEventId => {
            const commonEvent = $dataCommonEvents[commonEventId];
            if(!commonEvent || !reTarget) {
                return;
            }
            reTarget.setupChild(commonEvent.list, reTarget.eventId());
            reTarget = reTarget._childInterpreter;
        });
    }

    /**
     * アイテムシーンを表示しているか判定
     * @returns メニューシーンか？
     */
    function isItemScene() {
        return SceneManager._scene.constructor === Scene_Item;
    }

    /**
     * バトルシーンを表示しているか判定
     * @returns バトルシーンか？
     */
    function isBattleScene() {
        return SceneManager._scene.constructor === Scene_Battle;
    }

    /**
     * 指定したプラグインが読み込まれているか判定
     * @param {String} name プラグインファイル名(拡張子抜き)
     * @returns プラグインが読み込まれているか？
     */
    function isLoadedPlugin(name) {
        return $plugins.some(plugin => plugin.name === name && plugin.status);
    }


    //=========================================================================
    // Variable
    //  ・ローカル変数
    //
    //=========================================================================
    /**
     * コモンイベントの複数実行が必要か？
     */
    let needMultiCommonEvent = false;


    //=========================================================================
    // Game_Interpreter
    //  ・複数コモンイベント予約用の処理を追加
    //
    //=========================================================================
    const _Game_Interpreter_setupReservedCommonEvent = Game_Interpreter.prototype.setupReservedCommonEvent;
    Game_Interpreter.prototype.setupReservedCommonEvent = function() {
        const ret = _Game_Interpreter_setupReservedCommonEvent.call(this);

        if(!needMultiCommonEvent) {
            return ret;
        }

        if($gameTemp.isMultiCommonEventReserved()) {
            runMultiCommonEvent(this, $gameTemp.commonEventQueue());
            $gameTemp.clearCommonEventQueue();
            return true;
        } else {
            needMultiCommonEvent = false;
            return false;
        }
    };


    //=========================================================================
    // Game_Temp
    //  ・複数コモンイベント予約用の処理を追加
    //
    //=========================================================================
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._commonEventQueue = [];
    }

    /**
     * コモンイベントを予約(キューに格納)する
     * @param {Number} commonEventId コモンイベント番号
     */
    Game_Temp.prototype.reserveMultiCommonEvent = function(commonEventId) {
        this._commonEventQueue.push(commonEventId);
    };

    /**
     * 指定したアイテムが持つコモンイベントを予約(キューに格納)する
     * @param {RPG.Item | RPG.Skill} item アイテムかスキルオブジェクト
     * @returns {Boolean} 予約結果
     */
    Game_Temp.prototype.reserveMultiCommonEventByItem = function(item) {
        if(!item || !item.effects) {
            return false;
        }

        let effectList = [];

        if(isItemScene() || isBattleScene()) {
            effectList = item.effects.filter(effect => effect.code === Game_Action.EFFECT_COMMON_EVENT && effect.dataId !== $gameTemp.commonEventId());
        }

        if(!effectList || effectList.length <= 0) {
            return false;
        }

        needMultiCommonEvent = true;
        effectList.forEach(effect => $gameTemp.reserveMultiCommonEvent(effect.dataId));

        return true;
    };


    /**
     * コモンイベントキューを返す
     * @returns {Number[]} コモンイベント番号配列
     */
    Game_Temp.prototype.commonEventQueue = function() {
        return this._commonEventQueue;
    };

    /**
     * コモンイベントキューに予約待ちコモンイベントが存在するか判定
     */
    Game_Temp.prototype.isMultiCommonEventReserved = function() {
        return this._commonEventQueue.length > 0;
    };

    /**
     * コモンイベントキューをクリアする
     */
    Game_Temp.prototype.clearCommonEventQueue = function() {
        this._commonEventQueue = [];
    };

    /**
     * 本来予約されているコモンイベント番号を返す
     * @returns {Number} コモンイベント番号
     */
    Game_Temp.prototype.commonEventId = function() {
        return this._commonEventId;
    }


    //=========================================================================
    // Game_Action
    //  ・複数コモンイベント予約用の処理を追加
    //
    //=========================================================================
    const _Game_Action_applyGlobal = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function() {
        _Game_Action_applyGlobal.call(this);

        $gameTemp.reserveMultiCommonEventByItem(this.item());
    };



    //=========================================================================
    // BattleManager
    //  ・複数コモンイベント予約用の処理を追加(YEP_BattleEngineCore用)
    //
    //=========================================================================
    // YEP_BattleEngineCore対応
    if(isLoadedPlugin("YEP_BattleEngineCore")) {
        const _BattleManager_actionActionCommonEvent = BattleManager.actionActionCommonEvent;
        BattleManager.actionActionCommonEvent = function() {
            const ret = _BattleManager_actionActionCommonEvent.call(this);

            $gameTemp.reserveMultiCommonEventByItem(this._action.item());

            return ret;
        };
    }


})();