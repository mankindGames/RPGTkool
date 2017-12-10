//=============================================================================
// MKR_InstantDeath.js
//=============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.2 2017/12/10 プラグインパラメータの指定方法を変更
//
// 1.1.1 2016/08/15 行動状況により即死ステート付与後の動作がおかしい問題を解決
//
// 1.1.0 2016/08/06 YEP_BattleEngineCoreとの競合改善
//
// 1.0.0 2016/08/04 初版公開
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//=============================================================================

/*:
 *
 * @plugindesc (v1.1.2) 即死ステートを実装します。
 * @author マンカインド
 *
 * @help
 * 即死ステートを定義し、
 * バトル中にそのステートが付与されたバトラーを即死させます。
 *
 *
 * 簡単な使い方説明:
 *   初期準備として、まずは即死扱いとするステートを
 *   RPGツクールMV側で作成してください。
 *   設定:
 *     ・[SV]モーション を 戦闘不能 に設定してください。
 *     ・メッセージ [アクターがこの状態になったとき]
 *                  [敵キャラがこの状態になったとき] を
 *       それぞれ設定してください。
 *
 *   作成したステートのIDを、
 *   プラグインパラメーター[即死ステートID]に設定します。
 *
 *   即死攻撃を作るには、スキルの使用効果:ステート付与に
 *   即死ステート:100%を指定し、スキル発動の成功率を調整します。
 *
 *   ※重要※
 *     プラグイン:YEP_BattleEngineCoreを本プラグインとともに
 *     導入している場合は、
 *     プラグインパラメーター[YEPengine導入状況]で
 *     [導入している] に設定してください。
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
 * 補足：
 *   ・このプラグインに関するメモ欄の設定、プラグインコマンド、
 *     制御文字は大文字/小文字を区別していません。
 *
 *   ・プラグインパラメーターの説明に、[初期値]と書かれているものは
 *     メモ欄で個別に設定が可能です。
 *     設定した場合、[初期値]よりメモ欄の設定が
 *     優先されますのでご注意ください。
 *
 *   ・プラグインパラメーターの説明に、[変数可]と書かれているものは
 *     設定値に変数の制御文字である\v[n]を使用可能です。
 *     変数を設定した場合、そのパラメーターの利用時に変数の値を
 *     参照するため、パラメーターの設定をゲーム中に変更できます。
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
 *
 * @param Default_InstantDeath_State_Id
 * @text 即死ステートID
 * @desc 即死ステートのIDを指定します。
 * @type state
 * @default 15
 *
 * @param Default_YEP_BattleEngine
 * @text YEPengine導入状況
 * @desc [競合対策] YEP_BattleEngineCore がONの場合は[導入している]、OFFの場合は[導入していない]を選択してください。
 * @type boolean
 * @on 導入している
 * @off 導入していない
 * @default false
 *
 *
 * *
*/
(function () {
    'use strict';

    var CheckParam = function(type, param, def) {
        var Parameters, regExp, value;
        Parameters = PluginManager.parameters("MKR_InstantDeath");

        if(param in Parameters) {
            value = String(Parameters[param]);
        } else {
            throw new Error('Plugin parameter not found: '+param);
        }

        regExp = /^\x1bV\[\d+\]$/i;
        value = value.replace(/\\/g, '\x1b');

        if(!regExp.test(value)) {
            switch(type) {
                case "bool":
                    if(value == "") {
                        value = (def)? true : false;
                    }
                    value = value.toUpperCase() === "ON" || value.toUpperCase() === "TRUE" || value.toUpperCase() === "1";
                    break;
                case "num":
                    if(value == "") {
                        value = (def)? def : 0;
                    } else {
                        value = (isFinite(value))? parseInt(value, 10) : (def)? def : 0;
                    }
                    break;
                default:
                    throw new Error('Plugin parameter type is illegal: '+type);
                    break;
            }
        }

        return [value, type];
    }

    var CEC = function(params) {
        var text, value, type;
        type = params[1];
        text = String(params[0]);
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');

        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));

        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));

        switch(type) {
            case "bool":
                value = text.toUpperCase() === "ON" || text.toUpperCase() === "TRUE" || text.toUpperCase() === "1";
                break;
            case "num":
                value = (isFinite(text))? parseInt(text, 10) : 0;
                break;
            default:
                throw new Error('[CEC] Plugin parameter type is illegal: '+type);
                break;
        }

        return value;
    };

    var DefInstantDeathStateId, DefYepBattleEngineUse;
    DefInstantDeathStateId = CheckParam("num", "Default_InstantDeath_State_Id", 99);
    DefYepBattleEngineUse = CheckParam("bool", "Default_YEP_BattleEngine", false);


    //=========================================================================
    // Game_BattlerBase
    //  即死ステートを定義します。
    //
    //=========================================================================
    var _Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
    Game_BattlerBase.prototype.addNewState = function(stateId) {
        var instantDeathStateId;
        instantDeathStateId = DefInstantDeathStateId[0];

        if (stateId === instantDeathStateId) {
            this.die();
        }

        _Game_BattlerBase_addNewState.call(this, stateId);
    };


    //=========================================================================
    // Sprite_Actor
    //  即死ステート付与時のアクターモーションを再定義します。
    //
    //=========================================================================
    var _Sprite_Actor_refreshMotion = Sprite_Actor.prototype.refreshMotion;
    Sprite_Actor.prototype.refreshMotion = function() {
        var actor;
        actor = this._actor;

        if (actor && actor.isDead()) {
            this._motion = null;
        }

        _Sprite_Actor_refreshMotion.call(this);
    };


    //=========================================================================
    // Window_BattleLog
    //  即死ステートを定義します。
    //
    //=========================================================================
    var _Window_BattleLog_displayAddedStates = Window_BattleLog.prototype.displayAddedStates;
    Window_BattleLog.prototype.displayAddedStates = function(target) {
        var instantDeathStateId, yepBattleEngineUse, stateMsg, state, cnt, i;
        instantDeathStateId = DefInstantDeathStateId[0];
        yepBattleEngineUse = DefYepBattleEngineUse[0];

        if(!yepBattleEngineUse && target.result().isStateAdded(instantDeathStateId)) {
            state = $dataStates[instantDeathStateId];
            stateMsg = target.isActor() ? state.message1 : state.message2;

            cnt = target.result().addedStateObjects().length;
            for(i = 0; i < cnt; i++) {
                state = target.result().addedStateObjects()[i];
                if(state.id === target.deathStateId()) {
                    target.result().addedStates.splice(i, 1);
                    break;
                }
            }

            _Window_BattleLog_displayAddedStates.call(this, target);
            this.push('performCollapse', target);
        } else {
            _Window_BattleLog_displayAddedStates.call(this, target);
        }
    };


})();