//=============================================================================
// MKR_MapScrollFix.js
//=============================================================================
// Copyright (c) 2016 mankind
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/10/24 初版公開
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.0) 指定したスイッチがONの間、マップスクロールを固定します。
 * @author mankind
 *
 * @help
 * プラグインパラメーターでスクロールを禁止するためのスイッチ番号を指定します。
 * ゲーム中にそのスイッチがオンになると画面が固定されます。
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
 *   ・プラグインパラメーターの説明に、[初期値]と書かれているものは
 *     アクター/イベントのメモ欄で個別に設定が可能です。
 *     設定した場合、[初期値]よりメモ欄の設定が
 *     優先されますのでご注意ください。
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
 * @param Default_Scroll_Fix_Sw
 * @desc マップスクロールを固定するスイッチの番号を指定します。
 * @default 10
 *
 *
 * *
*/
(function () {
    'use strict';

    var CheckParam = function(type, param, def, min, max) {
        var Parameters, regExp, value;
        Parameters = PluginManager.parameters("MKR_MapScrollFix");

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
                case "switch":
                    if(value == "") {
                        value = (def != "")? def : value;
                    }
                    if(!value.match(/^([A-D]|\d+)$/i)) {
                        throw new Error('Plugin parameter value is not switch : '+param+' : '+value);
                    }
                    break;
                default:
                    throw new Error('Plugin parameter type is illegal: '+type);
                    break;
            }
        }

        return [value, type, def, min, max];
    }

    var DefScrollFixSw;
    DefScrollFixSw = CheckParam("num", "Default_Scroll_Fix_Sw", 10, 1);

    console.log(DefScrollFixSw)

    //=========================================================================
    // Game_Player
    //  ・プレイヤー移動による画面のスクロールを再定義します。
    //
    //=========================================================================
    var _Game_Player_updateScroll = Game_Player.prototype.updateScroll;
    Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
        var scrollFix = $gameSwitches.value(DefScrollFixSw[0]);

        if(!scrollFix) {
            _Game_Player_updateScroll.call(this, lastScrolledX, lastScrolledY);
        }
    };

})();