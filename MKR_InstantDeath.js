//=============================================================================
// MKR_InstantDeath.js
//=============================================================================
// Copyright (c) 2016 mankind
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2016/08/06 YEP_BattleEngineCoreとの競合改善
// 1.0.0 2016/08/04 初版公開
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//=============================================================================

/*:
 *
 * @plugindesc 即死ステートを実装します。
 * @author mankind
 *
 * @help
 * 即死ステートを定義し、
 * バトル中にそのステートが付与されたキャラを即死させます。
 *
 *
 * 簡単な使い方説明:
 *   初期準備として、まずは即死扱いとするステートを
 *   RPGツクールMV側で作成してください。
 *
 *   作成したステートのIDを、
 *   プラグインパラメーター[Default_InstantDeath_State_Id]に設定します。
 *
 *   即死攻撃を作るには、スキルの使用効果:ステート付与に
 *   即死ステート:100%を指定し、スキル発動の成功率を調整します。
 *
 *   ※重要※
 *     プラグイン:YEP_BattleEngineCoreを本プラグインとともに
 *     導入している場合は、
 *     プラグインパラメーター[Default_YEP_BattleEngine]を
 *     true に設定してください。
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
 * @desc 即死ステートのIDを指定します。
 * @default 15
 *
 * @param Default_YEP_BattleEngine
 * @desc [競合対策] YEP_BattleEngineCore がONの場合はtrue、OFFの場合はfalseを入力してください。
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
    // BattleManager
    //  即死ステートを定義します。
    //
    //=========================================================================
    var _BattleManager_updateAction =BattleManager.updateAction;
    BattleManager.updateAction = function() {
        _BattleManager_updateAction.call(this);

        var instantDeathStateId, yepBattleEngineUse;
        instantDeathStateId = DefInstantDeathStateId[0];
        yepBattleEngineUse = DefYepBattleEngineUse[0];

        if(!yepBattleEngineUse) {
            if(this._phase == "turn") {
                $gameTroop.members().forEach(function(enemy) {
                    if(enemy.isStateAffected(instantDeathStateId)) {
                        enemy.die();
                        enemy.performCollapse();
                        enemy.hide();
                    }
                }, this)
            }
        }
    }


    //=========================================================================
    // Game_BattlerBase
    //  即死ステートを定義します。
    //
    //=========================================================================
    var _Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
    Game_BattlerBase.prototype.addNewState = function(stateId) {
        var instantDeathStateId, yepBattleEngineUse;
        instantDeathStateId = DefInstantDeathStateId[0];
        yepBattleEngineUse = DefYepBattleEngineUse[0];

        if (yepBattleEngineUse && stateId === instantDeathStateId) {
            this.die();
        }

        _Game_BattlerBase_addNewState.call(this, stateId);
    };


    //=========================================================================
    // Window_BattleLog
    //  即死ステートを定義します。
    //
    //=========================================================================
    var _Window_BattleLog_displayChangedStates = Window_BattleLog.prototype.displayChangedStates;
    Window_BattleLog.prototype.displayChangedStates = function(target) {
        this.displayAddedInstantDeathState(target);
        _Window_BattleLog_displayChangedStates.call(this,target);
    };

    Window_BattleLog.prototype.displayAddedInstantDeathState = function(target) {
        var instantDeathStateId, instantDeathFlag, deathStateNum,
            state, cnt, i;
        instantDeathStateId = DefInstantDeathStateId[0];
        instantDeathFlag = false;
        deathStateNum = -1;
        i = 0;

        cnt = target.result().addedStateObjects().length;
        for(; i < cnt; i++) {
            state = target.result().addedStateObjects()[i];
            if(state.id === target.deathStateId()) {
                deathStateNum = i;
            }
            if (state.id === instantDeathStateId) {
                var stateMsg = target.isActor() ? state.message1 : state.message2;
                if (stateMsg) {
                    this.push('popBaseLine');
                    this.push('pushBaseLine');
                    this.push('addText', target.name() + stateMsg);
                    this.push('waitForEffect');
                }
                instantDeathFlag = true;
                if(deathStateNum > -1) {
                    break;
                }
            }
        }

        if(deathStateNum > -1 && instantDeathFlag) {
            target._result.addedStates.splice( deathStateNum, 1 ) ;
        }

    };


})();