//=============================================================================
// MKR_SceneGoldWindow.js
//=============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/03/28 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.0) シーン別ゴールドウィンドウプラグイン
 * @author マンカインド
 *
 * @help = シーン別ゴールドウィンドウプラグイン =
 * シーン別にゴールドウィンドウのサイズを変更します。
 * メニューシーン、マップシーン、ショップシーン毎にプラグインパラメーターから
 * ウィンドウサイズの指定が可能です。
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
 *
 * @param Default_Width
 * @desc ゴールドウィンドウの幅を指定します。(デフォルト)
 * @default 240
 *
 * @param Default_Height
 * @desc ゴールドウィンドウの高さを指定します。(デフォルト)
 * @default 72
 *
 * @param Map_Width
 * @desc ゴールドウィンドウの幅を指定します。(マップシーン)
 * @default 240
 *
 * @param Map_Height
 * @desc ゴールドウィンドウの高さを指定します。(マップシーン)
 * @default 72
 *
 * @param Shop_Width
 * @desc ゴールドウィンドウの幅を指定します。(ショップシーン)
 * @default 240
 *
 * @param Shop_Height
 * @desc ゴールドウィンドウの高さを指定します。(ショップシーン)
 * @default 72
 *
*/

var Imported = Imported || {};
Imported.MKR_SceneGoldWindow = true;

(function () {
    'use strict';

    var PN = "MKR_SceneGoldWindow";

    var CheckParam = function(type, param, def, min, max) {
        var Parameters, regExp, value;
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

        value = value.replace(/\\/g, '\x1b');
        value = value.replace(/\x1b\x1b/g, '\\');

        regExp = /^\x1bV\[\d+\]$/i;
        if(!regExp.test(value)) {
            switch(type) {
                case "num":
                    if(value == "") {
                        value = (isFinite(def))? parseInt(def, 10) : 0;
                    } else {
                        value = (isFinite(value))? parseInt(value, 10) : (isFinite(def))? parseInt(def, 10) : 0;
                        value = value.clamp(min, max);
                    }
                    break;
                default:
                    throw new Error("[CheckParam] " + param + "のタイプが不正です: " + type);
                    break;
            }
        }

        return [value, type, def, min, max, param];
    }

    var Params = {
        "DefW" : CheckParam("num", "Default_Width", 240, 0),
        "DefH" : CheckParam("num", "Default_Height", 72, 0),
        "MapW" : CheckParam("num", "Map_Width", 240, 0),
        "MapH" : CheckParam("num", "Map_Height", 72, 0),
        "ShopW" : CheckParam("num", "Shop_Width", 240, 0),
        "ShopH" : CheckParam("num", "Shop_Height", 72, 0),
    };


    //=========================================================================
    // Window_Gold
    //  ・シーンごとにウィンドウサイズを再定義します。
    //
    //=========================================================================
    var _Window_Gold_windowWidth = Window_Gold.prototype.windowWidth;
    Window_Gold.prototype.windowWidth = function() {
        var ret = _Window_Gold_windowWidth.call(this);

        ret = Params.DefW[0] ? Params.DefW[0] : ret;

        if(SceneManager._scene.constructor === Scene_Map) {
            ret = Params.MapW[0] ? Params.MapW[0] : ret;
        }
        if(SceneManager._scene.constructor === Scene_Shop) {
            ret = Params.ShopW[0] ? Params.ShopW[0] : ret;
        }

        return ret;
    };

    var _Window_Gold_windowHeight = Window_Gold.prototype.windowHeight;
    Window_Gold.prototype.windowHeight = function() {
        var ret = _Window_Gold_windowHeight.call(this);

        ret = Params.DefH[0] ? Params.DefH[0] : ret;

        if(SceneManager._scene.constructor === Scene_Map) {
            ret = Params.MapH[0] ? Params.MapH[0] : ret;
        }
        if(SceneManager._scene.constructor === Scene_Shop) {
            ret = Params.ShopH[0] ? Params.ShopH[0] : ret;
        }

        return ret;
    };

})();