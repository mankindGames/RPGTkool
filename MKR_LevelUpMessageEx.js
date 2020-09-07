//=============================================================================
// MKR_LevelUpMessageEx.js
//=============================================================================
// Copyright (c) 2016 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.1 2020/09/07 ・戦闘後にレベルアップしたときの考慮が抜けていたので対応。
//
// 2.0.0 2020/09/05 ・プラグインパラメータに@type他を追加。
//                  ・レベルアップメッセージに対象アクターの顔グラを表示可能に。
//                  ・レベルアップメッセージを一瞬で表示する設定を追加。
//
// 1.0.2 2016/10/15 ・ステータスを非表示にした場合にステータスアップテキストが
//                    途切れてしまう不具合を修正。
//
// 1.0.1 2016/10/15 ・レベルアップ時にどのステータスを表示するか選択可能に。
//
// 1.0.0 2016/10/15 ・初版公開
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v2.0.1) レベルアップメッセージ拡張
 *
 * @author マンカインド
 *
 * @help = レベルアップメッセージ拡張 =
 * MKR_LevelUpMessageEx.js
 *
 * アクターがレベルアップし、レベルアップのメッセージが表示された後に
 * アクターのステータスがどのように変化したのかを表示するメッセージウィンドウを
 * 表示します。
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
 * @param Default_Status_Message
 * @text ステータス一覧表示
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @desc レベルアップ時にアップしたステータス一覧を表示するかどうか設定します。
 * @default true
 *
 * @param Visible_Status
 * @text 表示するステータス
 * @desc レベルアップ時に表示するステータスの設定
 *
 * @param Default_Visible_Hp
 * @text 最大HP
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @desc レベルアップ時に[最大HP]のステータスを表示するかどうか設定します。
 * @default true
 * @parent Visible_Status
 *
 * @param Default_Visible_Mp
 * @text 最大MP
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @desc レベルアップ時に[最大MP]のステータスを表示するかどうか設定します。
 * @default true
 * @parent Visible_Status
 *
 * @param Default_Visible_Atk
 * @text 攻撃力
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @desc レベルアップ時に[攻撃力]のステータスを表示するかどうか設定します。
 * @default true
 * @parent Visible_Status
 *
 * @param Default_Visible_Grd
 * @text 防御力
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @desc レベルアップ時に[防御力]のステータスを表示するかどうか設定します。
 * @default true
 * @parent Visible_Status
 *
 * @param Default_Visible_mAtk
 * @text 魔法力
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @desc レベルアップ時に[魔法力]のステータスを表示するかどうか設定します。
 * @default true
 * @parent Visible_Status
 *
 * @param Default_Visible_mGrd
 * @text 魔法防御力
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @desc レベルアップ時に[魔法防御力]のステータスを表示するかどうか設定します。
 * @default true
 * @parent Visible_Status
 *
 * @param Default_Visible_Spd
 * @text 敏捷性
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @desc レベルアップ時に[敏捷性]のステータスを表示するかどうか設定します。
 * @default true
 * @parent Visible_Status
 *
 * @param Default_Visible_Luk
 * @text 運
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @desc レベルアップ時に[運]のステータスを表示するかどうか設定します。
 * @default true
 * @parent Visible_Status
 *
 * @param Default_Visible_Face
 * @text 顔グラフィック表示
 * @type switch
 * @desc レベルアップメッセージを表示する際、対象アクターの顔グラフィックを表示するか決めるスイッチ番号を設定します。
 * @default 1
 *
 * @param Default_Message_Speed
 * @text メッセージ瞬間表示
 * @type switch
 * @desc レベルアップメッセージを瞬間表示(制御文字:\>と同じ効果)するか決めるスイッチ番号を設定します。
 * @default 2
 *
*/
(function() {
    'use strict';

    const PN = "MKR_LevelUpMessageEx";

    const CheckParam = function(type, name, value, def, min, max, options) {
        if(min == undefined || min == null) {
            min = -Infinity;
        }
        if(max == undefined || max == null) {
            max = Infinity;
        }

        if(value == null) {
            value = "";
        } else {
            value = String(value);
        }

        switch(type) {
            case "bool":
                if(value == "") {
                    value = (def) ? "true" : "false";
                }
                value = value.toUpperCase() === "ON" || value.toUpperCase() === "TRUE" || value.toUpperCase() === "1";
                break;
            case "switch":
                if(value == "") {
                    value = (def != "") ? def : value;
                }
                if(!value.match(/^([A-D]|\d+)$/i)) {
                    throw new Error("[CheckParam] " + param + "の値がスイッチではありません: " + param + " : " + value);
                }
                break;
            default:
                throw new Error("[CheckParam] " + name + "のタイプが不正です: " + type);
        }

        return value;
    };

    const paramParse = function(obj) {
        return JSON.parse(JSON.stringify(obj, paramReplace));
    };

    const paramReplace = function(key, value) {
        try {
            return JSON.parse(value || null);
        } catch(e) {
            return value;
        }
    };

    const Parameters = paramParse(PluginManager.parameters(PN));
    let DefVisibleFace = CheckParam("switch", "Default_Visible_Face", Parameters["Default_Visible_Face"], 1);
    let DefMessageSpeed = CheckParam("switch", "Default_Message_Speed", Parameters["Default_Message_Speed"], 2);
    let DefStatusMess = CheckParam("bool", "Default_Status_Message", Parameters["Default_Status_Message"], true);
    let VisibleParams = [];
    VisibleParams.push(CheckParam("bool", "Default_Visible_Hp", Parameters["Default_Visible_Hp"], true));
    VisibleParams.push(CheckParam("bool", "Default_Visible_Mp", Parameters["Default_Visible_Mp"], true));
    VisibleParams.push(CheckParam("bool", "Default_Visible_Atk", Parameters["Default_Visible_Atk"], true));
    VisibleParams.push(CheckParam("bool", "Default_Visible_Grd", Parameters["Default_Visible_Grd"], true));
    VisibleParams.push(CheckParam("bool", "Default_Visible_mAtk", Parameters["Default_Visible_mAtk"], true));
    VisibleParams.push(CheckParam("bool", "Default_Visible_mGrd", Parameters["Default_Visible_mGrd"], true));
    VisibleParams.push(CheckParam("bool", "Default_Visible_Spd", Parameters["Default_Visible_Spd"], true));
    VisibleParams.push(CheckParam("bool", "Default_Visible_Luk", Parameters["Default_Visible_Luk"], true));


    //=========================================================================
    // SceneManager
    //  ・現在シーンがScene_Battleであることを判定する処理を定義します。
    //
    //=========================================================================
    SceneManager.isSceneBattle = function() {
        return this._scene.constructor === Scene_Battle;
    };


    //=========================================================================
    // Game_Actor
    //  ・レベルアップ時に表示するメッセージを再定義します。
    //
    //=========================================================================
    const _Game_Actor_displayLevelUp = Game_Actor.prototype.displayLevelUp;
    Game_Actor.prototype.displayLevelUp = function(newSkills) {
        let visibleFace = DefVisibleFace;
        let messageSpeed = DefMessageSpeed;
        let statusMess = DefStatusMess;
        let viewParams = VisibleParams;
        let faceName = this.faceName();
        let faceIndex = this.faceIndex();

        // 機能無効時は元の処理を呼び出す
        if(!statusMess) {
            _Game_Actor_displayLevelUp.apply(this, arguments);
            return;
        }

        // メッセージ顔グラフィック設定(バトル)
        // バトル終了後のレベルアップはテキスト末尾に制御文字を追加する。
        if($gameSwitches.value(visibleFace) && SceneManager.isSceneBattle()) {
            $gameMessage.add("\\af[%1,%2]".format(faceName, faceIndex));
        }

        _Game_Actor_displayLevelUp.apply(this, arguments);

        // ステータスアップメッセージの構築
        let text = "";
        let cnt = this.currentClass().params.length;

        let j = 0;
        for(let i = 0; i < cnt; i++) {
            if(viewParams[i]) {
                let paramName = TextManager.param(i);
                let prevParam = this.currentClass().params[i][this._level - 1];
                let currentParam = this.currentClass().params[i][this._level];

                text += "%1 %2 ⇒ %3".format(paramName, prevParam, currentParam);

                if(j < cnt - 1) {
                    if(j % 2) {
                        text += "\n";
                    } else {
                        text += "　";
                    }
                }
                j++;
            }
        }

        $gameMessage.newPage();
        $gameMessage.add(text);

        // メッセージ速度設定(デフォルト or 一瞬)
        if($gameSwitches.value(messageSpeed)) {
            let mesArr = $gameMessage.allText().split("\n");
            $gameMessage.clear();
            $gameMessage.newPage();
            let cnt = mesArr.length;
            for(let i = 0; i < cnt; i++) {
                let text = mesArr[i];
                if(mesArr[i].indexOf("\\>") === -1) {
                    text = "\\>" + mesArr[i];
                }
                $gameMessage.add(text);
            }
        }

        // メッセージ顔グラフィック設定(バトル以外)
        // マップ上でのレベルアップを想定、顔グラフィックをスクリプトでセットする。
        if($gameSwitches.value(visibleFace) && !SceneManager.isSceneBattle()) {
            $gameMessage.setFaceImage(faceName, faceIndex);
        }
    };


    //=========================================================================
    // Game_Message
    //  ・テキストを末尾に追加する処理を定義します。
    //
    //=========================================================================
    Game_Message.prototype.pushText = function(addText) {
        let index = this._texts.length - 1;
        // テキスト配列が空の場合は通常のテキスト追加処理
        if(index < 0) {
            this.add(addText);
            return;
        }
        let text = this._texts[index];
        this._texts[index] = text + addText;
    };


    //=========================================================================
    // Window_Message
    //  ・メッセージ制御文字を追加します。
    //    [追加制御文字]
    //      \AF[アクター顔グラフィックファイル,アクター顔グラフィックインデックス]
    //
    //=========================================================================
    const _Window_Message_obtainEscapeCode = Window_Message.prototype.obtainEscapeCode;
    Window_Message.prototype.obtainEscapeCode = function(textState) {
        // 機能無効時は元の処理を呼び出す
        let statusMess = DefStatusMess;
        let visibleFace = DefVisibleFace;
        if(!$gameSwitches.value(visibleFace) || !statusMess) {
            return _Window_Message_obtainEscapeCode.apply(this, arguments);
        }

        textState.index++;
        let regExp = /^(AF)\[.*?\]/i;
        let text = textState.text.slice(textState.index);
        let arr = regExp.exec(text);

        if(arr) {
            textState.index += arr[0].length;
            return arr[0];
        } else {
            textState.index--;
            return _Window_Message_obtainEscapeCode.apply(this, arguments);
        }
    };

    const _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        // 機能無効時は元の処理を呼び出す
        let statusMess = DefStatusMess;
        let visibleFace = DefVisibleFace;
        if(!$gameSwitches.value(visibleFace) || !statusMess) {
            return _Window_Message_processEscapeCharacter.apply(this, arguments);
        }

        let regExp = /^(AF)(\[.*?\])?$/i;
        let arr = regExp.exec(code);

        if(arr) {
            if(arr[2]) {
                arr[2] = arr[2].replace(/[\[\]]/g, "");
            }
            switch(arr[1].toUpperCase()) {
                case "AF":
                    let faceName = arr[2].split(",")[0];
                    let faceIndex = arr[2].split(",")[1];
                    $gameMessage.setFaceImage(faceName, faceIndex);
                    break;
                default:
                    _Window_Message_processEscapeCharacter.apply(this, arguments);
            }
        } else {
            _Window_Message_processEscapeCharacter.apply(this, arguments);
        }
    };

})();