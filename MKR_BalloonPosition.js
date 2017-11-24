//===============================================================================
// MKR_BalloonPosition.js
//===============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.1 2017/11/24 メモ欄を使用しない場合に
//                  フキダシが表示されなくなっていた問題を修正。
//
// 1.0.0 2017/11/23 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.1) フキダシ位置変更プラグイン
 * @author マンカインド
 *
 * @help = フキダシ位置変更プラグイン ver 1.0.1 =
 * MKR_BalloonPosition.js - マンカインド
 *
 * イベントの頭上に表示されるフキダシの位置を調整します。
 * プラグインパラメータによる調整の他、イベントのメモ欄を使うことでも
 * フキダシ位置の調整が可能です。
 * (メモ欄による調整はプラグインパラメータより優先されます)
 *
 *
 * メモ欄による位置調整:
 *   <balloon: X, Y>
 *     ・XとYに指定した数値分、フキダシのX座標とY座標を調整します。
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
 * ==============================================================================
 *
 * @param offset_x
 * @text X座標オフセット
 * @desc フキダシを表示するX座標をずらします。プラスの値で右へ、マイナスの値で左にずれます。(デフォルト:0, -200～200までの数値)
 * @type number
 * @min -500
 * @max 500
 * @default 0
 *
 * @param offset_y
 * @text Y座標オフセット
 * @desc フキダシを表示するY座標をずらします。プラスの値で下へ、マイナスの値で上にずれます。(デフォルト:0, -200～200までの数値)
 * @type number
 * @min -500
 * @max 500
 * @default 0
 *
*/

var Imported = Imported || {};
Imported.MKR_BalloonPosition = true;

(function () {
    'use strict';

    const PN = "MKR_BalloonPosition";

    const CheckParam = function(type, param, def, min, max) {
        let Parameters, regExp, value;
        Parameters = PluginManager.parameters(PN);

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
            throw new Error("[CheckParam] プラグインパラメーターがありません: " + param);
        }

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
            case "switch":
                if(value == "") {
                    value = (def != "")? def : value;
                }
                if(!value.match(/^([A-D]|\d+)$/i)) {
                    throw new Error("[CheckParam] " + param + "の値がスイッチではありません: " + param + " : " + value);
                }
                break;
            case "select":
                value = ConvertOption(param, value);
                break;
            default:
                throw new Error("[CheckParam] " + param + "のタイプが不正です: " + type);
                break;
        }

        return value;
    };

    const GetMeta = function(meta, name, sep) {
        let value, values, i, count;
        value = "";
        values = [];
        name = name.toLowerCase().trim();

        Object.keys(meta).forEach(function(key) {
            if(key.toLowerCase().trim() == name) {
                value = meta[key].trim();
                return false;
            }
        });

        if(sep !== undefined && sep != "" && value != "") {
            values = value.split(sep);
            count = values.length;
            values = values.map(function(elem) {
                return elem.trim();
            });

            return values;
        }

        return value;
    };

    const Params = {
        "OffsetX" : CheckParam("num", "offset_x", 0, -500, 500),
        "OffsetY" : CheckParam("num", "offset_y", 0, -500, 500),
    };


    //=========================================================================
    // Game_Interpreter
    //  ・
    //
    //=========================================================================
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === "") {
            switch (args[0].toLowerCase()) {
                case "":
                    break;
            }
        }
    };


    //=========================================================================
    // Sprite_Character
    //  ・フキダシの表示位置を再定義します。
    //
    //=========================================================================
    const _Sprite_Character_updateBalloon = Sprite_Character.prototype.updateBalloon;
    Sprite_Character.prototype.updateBalloon = function() {
        _Sprite_Character_updateBalloon.call(this);

        let chara, offsetX, offsetY, metas;
        offsetX = Params.OffsetX;
        offsetY = Params.OffsetY;

        if(this._character.constructor == Game_Event) {
            chara = this._character;
            metas = GetMeta(chara.event().meta, "balloon", ",");
            if(metas) {
                offsetX =  isFinite(metas[0]) ? parseInt(metas[0]) : offsetX;
                offsetY =  isFinite(metas[1]) ? parseInt(metas[1]) : offsetY;
            }
            if(this._balloonSprite) {
                this._balloonSprite.x = this.x + offsetX;
                this._balloonSprite.y = this.y - this.height + offsetY;
            }
        }

    };


    //=========================================================================
    //
    //  ・
    //
    //=========================================================================


})();