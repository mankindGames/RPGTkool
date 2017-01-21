//=============================================================================
// MKR_StateMessageVariation.js
//=============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/01/21 初版公開
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.0) ステートメッセージバリエーションプラグイン
 * @author マンカインド
 *
 * @help ステートにかかったとき、ステート状態が継続中のとき、
 * ステートが解除されたときに、デフォルトで設定されているメッセージではなく、
 * 予め指定してある別のメッセージをバトルログに表示します。
 *
 *
 * まず、メッセージを変更したいステートのメモ欄に
 * 以下の文字列を変更するメッセージの数だけ入力します。
 * (複数入力する場合は改行で区切ること)
 *
 *   <stateMes[メッセージID]:[表示メッセージ]>
 *
 *   [メッセージID] の部分には同ステートのメモ欄の中で
 *   他のメッセージIDと被らない数字を入れてください。
 *
 *   [表示メッセージ] の部分にはバトルログに表示させたいメッセージを
 *   入れてください。
 *   通常のメッセージと同じく、対象のアクター/敵名がメッセージの前に
 *   挿入されます。
 *
 *   ステートのメモ欄入力例はこんな感じになります。
 *
 *     入力文字列  : <stateMes5:は気を失った！>
 *     文字列の意味: メッセージIDを5に設定し、表示されるメッセージを
 *                   「(アクター/敵名) は気を失った！」に
 *                   書き換えます。
 *
 *
 * 次に、メッセージを変更したいアクター/敵のメモ欄に
 * 以下の文字列をメッセージを変更するステートの数だけ入力します。
 * (複数入力する場合は改行で区切ること)
 *
 *   <state[ステートID]:[メッセージID1],[メッセージID2],[メッセージID3]>
 *
 *   [ステートID] の部分には変更したいメッセージを入力した
 *   ステートIDを入れます。
 *
 *   [メッセージID1] には対象のステートにかかったとき、に表示する
 *   メッセージのIDを入れます。メッセージを変更しない場合は空文字か0を
 *   入れておきます。
 *
 *   [メッセージID2] には対象のステート状態が継続しているとき、に表示する
 *   メッセージのIDを入れます。メッセージを変更しない場合は空文字か0を
 *   入れておきます。
 *
 *   [メッセージID3] には対象のステート状態が解除されたとき、に表示する
 *   メッセージのIDを入れます。メッセージを変更しない場合は空文字か0を
 *   入れておきます。
 *
 *   アクター/敵のメモ欄入力例はこんな感じになります。
 *
 *      入力文字列    :             文字列の意味
 *     <state1:11>    : ステートID:1 のステートにかかったとき、
 *                      ステートID:1 のメモ欄に設定された
 *                      メッセージID:11 のメッセージを表示します。
 *
 *     <state4:,4>    : ステートID:2 のステート状態が継続中のとき、
 *                      ステートID:2 のメモ欄に設定された
 *                      メッセージID:4 のメッセージを表示します。
 *
 *     <state10:,,5>  : ステートID:10 のステート状態が解除されたとき、
 *                      ステートID:10 のメモ欄に設定された
 *                      メッセージID:5 のメッセージを表示します。
 *
 *     <state6:1,2,3> : ステートID:6 のステートにかかったとき、
 *                      ステートID:6 のメモ欄に設定された
 *                      メッセージID:1 のメッセージを表示します。
 *
 *                      ステートID:6 のステート状態が継続中のとき、
 *                      ステートID:6 のメモ欄に設定された
 *                      メッセージID:2 のメッセージを表示します。
 *
 *                      ステートID:6 のステート状態が解除されたとき、
 *                      ステートID:6 のメモ欄に設定された
 *                      メッセージID:3 のメッセージを表示します。
 *
 *
 * これで準備完了です。戦闘中に対象のアクター/敵が
 * 対象のステートによる影響を受けたときに表示される
 * バトルログのメッセージが変更されます。
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
 * 補足：
 *   ・このプラグインに関するメモ欄の設定は大文字/小文字を区別していません。
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
*/
(function () {
    'use strict';
    // var PN = "MKR_StateMessageVariation";


    //=========================================================================
    // Window_BattleLog
    //  ・ステートのメッセージ表示関連メソッドを再定義します。
    //
    //  this._battlerNotes = [
    //    [stateID]:[messageID1, messageID2, messageID3],
    //  ]
    //     stateID:対象ステートのID
    //  messageID1:対象ステートが追加されたときに表示するメッセージID
    //  messageID2:対象ステート状態が継続されているときに表示するメッセージID
    //  messageID3:対象ステートが解除されたときに表示するメッセージID
    //
    //=========================================================================
    var _Window_BattleLog_initialize = Window_BattleLog.prototype.initialize;
    Window_BattleLog.prototype.initialize = function() {
        _Window_BattleLog_initialize.call(this);

        this._battlerNotes = [];
    };

    Window_BattleLog.prototype.setBattlerNotes = function(target) {
        var battlerPattern, battler, notes, i, item, m, stateId, mesIds;
        battlerPattern = /<(?:state)(\d+)\:(\d[,\d]+|,[,\d]+)>/i;
        this._battlerNotes = [];
        if(target.isActor()) {
            battler = target.actor();
        } else {
            battler = target.enemy();
        }

        if(battler.note) {
            notes = battler.note.toLowerCase().split(/ (?=<)|\n/);
            for(i = 0; i < notes.length; i++) {
                item = notes[i].trim();
                if(battlerPattern.test(item)) {
                    m = item.match(battlerPattern);
                    stateId = parseInt(m[1], 10);
                    mesIds = m[2].split(",").map(function(mesId) {
                        mesId = mesId.trim();
                        if(mesId == "") {
                            mesId = 0;
                        }
                        return isFinite(mesId) ? parseInt(mesId, 10): 0;
                    });
                    while(mesIds.length < 3) {
                        mesIds.push(0);
                    }
                    this._battlerNotes[stateId] = mesIds;
                }
            }
        }
    };

    var _Window_BattleLog_displayChangedStates = Window_BattleLog.prototype.displayChangedStates;
    Window_BattleLog.prototype.displayChangedStates = function(target) {
        this.setBattlerNotes(target);
        _Window_BattleLog_displayChangedStates.call(this, target);
    };

    var _Window_BattleLog_displayAddedStates = Window_BattleLog.prototype.displayAddedStates;
    Window_BattleLog.prototype.displayAddedStates = function(target) {
        var statePattern, notes, i, item, m, mesId, mesFlg, stateMsg, mes, key;
        statePattern = /<(?:statemes)(\d+)\:(.+)>/i;
        mesFlg = false;
        stateMsg = "";

        if(target.result().countAddedState()) {
            for(key in this._battlerNotes) {
                if(isFinite(key) && target.result().isStateAdded(parseInt(key, 10))) {
                    mesFlg = true;
                    break;
                }
            }
        }

        if(mesFlg) {
            target.result().addedStateObjects().forEach(function(state) {
                stateMsg = target.isActor() ? state.message1 : state.message2;

                if(state.id in this._battlerNotes) {
                    notes = state.note.toLowerCase().split(/ (?=<)|\n/);
                    for(i = 0; i < notes.length; i++) {
                        item = notes[i].trim();
                        if(statePattern.test(item)) {
                            m = item.match(statePattern);
                            mesId = parseInt(m[1], 10);
                            mes = m[2].trim();
                            if(this._battlerNotes[state.id] !== undefined
                               && this._battlerNotes[state.id].length >= 1
                               && mesId == this._battlerNotes[state.id][0]) {
                                stateMsg = mes;
                            }
                        }
                    }
                }

                if (state.id === target.deathStateId()) {
                    this.push('performCollapse', target);
                }
                if (stateMsg) {
                    this.push('popBaseLine');
                    this.push('pushBaseLine');
                    this.push('addText', target.name() + stateMsg);
                    this.push('waitForEffect');
                }
            }, this);
        } else {
            _Window_BattleLog_displayAddedStates.call(this, target);
        }
    };

    var _Window_BattleLog_displayRemovedStates = Window_BattleLog.prototype.displayRemovedStates;
    Window_BattleLog.prototype.displayRemovedStates = function(target) {
        var statePattern, notes, i, item, m, mesId, mesFlg, stateMsg, mes, key;
        statePattern = /<(?:statemes)(\d+)\:(.+)>/i;
        mesFlg = false;
        stateMsg = "";

        if(target.result().countRemovedState()) {
            for(key in this._battlerNotes) {
                if(isFinite(key) && target.result().isStateRemoved(parseInt(key, 10))) {
                    mesFlg = true;
                    break;
                }
            }
        }

        if(mesFlg) {
            target.result().removedStateObjects().forEach(function(state) {
                stateMsg = state.message4;

                if(state.id in this._battlerNotes) {
                    notes = state.note.toLowerCase().split(/ (?=<)|\n/);
                    for(i = 0; i < notes.length; i++) {
                        item = notes[i].trim();
                        if(statePattern.test(item)) {
                            m = item.match(statePattern);
                            mesId = parseInt(m[1], 10);
                            mes = m[2].trim();
                            if(this._battlerNotes[state.id] !== undefined
                               && this._battlerNotes[state.id].length >= 3
                               && mesId == this._battlerNotes[state.id][2]) {
                                stateMsg = mes;
                            }
                        }
                    }
                }

                if (stateMsg) {
                    this.push('popBaseLine');
                    this.push('pushBaseLine');
                    this.push('addText', target.name() + stateMsg);
                }
            }, this);
        } else {
            _Window_BattleLog_displayRemovedStates.call(this, target);
        }
    };

    var _Window_BattleLog_displayCurrentState = Window_BattleLog.prototype.displayCurrentState
    Window_BattleLog.prototype.displayCurrentState = function(subject) {
        var statePattern, notes, i, item, m, mesId, mesFlg, stateMsg, mes, key, states,
            state;
        statePattern = /<(?:statemes)(\d+)\:(.+)>/i;
        mesFlg = false;
        stateMsg = "";
        states = [];

        if(subject.countStates()) {
            this.setBattlerNotes(subject);
            for(key in this._battlerNotes) {
                if(isFinite(key) && subject.stateIds().contains(parseInt(key, 10))) {
                    mesFlg = true;
                    break;
                }
            }
        }

        if(mesFlg) {
            states = subject.states();
            for (i = 0; i < states.length; i++) {
                state = states[i];
                if(state.id in this._battlerNotes) {
                    notes = state.note.toLowerCase().split(/ (?=<)|\n/);
                    for(i = 0; i < notes.length; i++) {
                        item = notes[i].trim();
                        if(statePattern.test(item)) {
                            m = item.match(statePattern);
                            mesId = parseInt(m[1], 10);
                            mes = m[2].trim();
                            if(this._battlerNotes[state.id] !== undefined
                               && this._battlerNotes[state.id].length >= 2
                               && mesId == this._battlerNotes[state.id][1]) {
                                stateMsg = mes;
                                break;
                            }
                        }
                    }
                } else if(states[i].message3) {
                    stateMsg = states[i].message3;
                    break;
                }
            }
            if (stateMsg) {
                this.push('addText', subject.name() + stateMsg);
                this.push('wait');
                this.push('clear');
            }
        } else {
            _Window_BattleLog_displayCurrentState.call(this, subject);
        }
    };


    //=========================================================================
    // Game_ActionResult
    //  ・影響を受けるステート数を返すメソッドを定義します。
    //
    //=========================================================================
    Game_ActionResult.prototype.countAddedState = function() {
        return this.addedStates.length;
    };

    Game_ActionResult.prototype.countRemovedState = function() {
        return this.removedStates.length;
    };


    //=========================================================================
    // Game_BattlerBase
    //  ・ステートIDを返すメソッドを定義します。
    //
    //=========================================================================
    Game_BattlerBase.prototype.stateIds = function() {
        return this._states;
    };

    Game_BattlerBase.prototype.countStates = function() {
        return this._states.length;
    };


})();