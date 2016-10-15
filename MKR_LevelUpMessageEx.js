//=============================================================================
// MKR_LevelUpMessageEx.js
//=============================================================================
// Copyright (c) 2016 mankind
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/10/15 初版公開
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.0) レベルアップ時にステータスの変化を
 * ウィンドウに表示します。
 *
 * @author mankind
 *
 * @help
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
 * 補足：
 *   ・このプラグインに関するメモ欄の設定、プラグインコマンド/パラメーター、
 *     制御文字は大文字/小文字を区別していません。
 *
 *   ・プラグインパラメーターの説明に、[変数可]と書かれているものは
 *     設定値に変数を表す制御文字である\v[n]を使用可能です。
 *     変数を設定した場合、そのパラメーターの利用時に変数の値を
 *     参照するため、パラメーターの設定をゲーム中に変更できます。
 *
 *   ・プラグインパラメーターの説明に、[スイッチ可]と書かれているものは
 *     設定値にスイッチを表す制御文字である\s[n]を使用可能です。
 *     スイッチを設定した場合、そのパラメーターの利用時にスイッチの値を
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
 * @param Default_Status_Message
 * @desc レベルアップ時にアップステータス一覧のウィンドウを表示する場合はON、表示しない場合はOFFを指定してください。
 * @default ON
 *
 *
 * *
*/
(function () {
    'use strict';

    var CheckParam = function(type, param, def, min, max) {
        var Parameters, regExp, value;
        Parameters = PluginManager.parameters("MKR_LevelUpMessageEx");

        if(arguments.length < 4) {
            min = -Infinity;
            max = Infinity;
        }
        if(arguments.length < 5) {
            max = Infinity;
        }
        if(param in Parameters) {
            value = String(Parameters[param]);
        } else {
            throw new Error('Plugin parameter not found: '+param);
        }

        regExp = /^\x1bV\[\d+\]$/i;
        value = value.replace(/\\/g, '\x1b');
        value = value.replace(/\x1b\x1b/g, '\\');

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
                        value = (isFinite(def))? parseInt(def, 10) : 0;
                    } else {
                        value = (isFinite(value))? parseInt(value, 10) : (isFinite(def))? parseInt(def, 10) : 0;
                        value = value.clamp(min, max);
                    }
                    break;
                case "string":
                    value = value;
                    break;
                default:
                    throw new Error('Plugin parameter type is illegal: '+type);
                    break;
            }
        }

        return [value, type, def, min, max];
    }

    var DefStatusMess;
    DefStatusMess = CheckParam("bool", "Default_Status_Message", true);


    //=========================================================================
    // Game_Actor
    //  ・レベルアップ時に表示するメッセージを再定義します。
    //
    //=========================================================================
    var _Game_Actor_displayLevelUp = Game_Actor.prototype.displayLevelUp;
    Game_Actor.prototype.displayLevelUp = function(newSkills) {
        var statusMess, text, cnt, i, paramName, prevParam, currentParam;
        statusMess = DefStatusMess[0];

        _Game_Actor_displayLevelUp.call(this, newSkills);

        if(statusMess) {
            text = "";
            cnt = this.currentClass().params.length;

            for(i = 0; i < cnt; i++){
                paramName = TextManager.param(i);
                prevParam = this.currentClass().params[i][this._level - 1];
                currentParam = this.currentClass().params[i][this._level];

                text += "%1 %2 ⇒ %3".format(paramName, prevParam, currentParam);

                if(i < cnt - 1) {
                    if(i % 2) {
                        text += "\n";
                    } else {
                        text += "　";
                    }
                }
            }

            $gameMessage.newPage();
            $gameMessage.add(text);
        }
    };

})();