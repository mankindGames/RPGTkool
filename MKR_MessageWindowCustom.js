//=============================================================================
// MKR_MessageWindowCustom.js
//=============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/06/25 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.0) メッセージウィンドウカスタマイズプラグイン
 * @author マンカインド
 *
 * @help = メッセージウィンドウカスタマイズプラグイン ver1.0.0 =
 *
 * このプラグインを導入することでメッセージウィンドウに以下の変更を行います。
 *
 *   ・行数を変えることなく、ウィンドウ高さの調整
 *
 *
 * プラグインパラメーター[Window_Height_Offset]の数値を設定することにより
 * メッセージウィンドウ([文章の表示]コマンドで表示に使われるウィンドウ)の
 * 高さをピクセル単位で調整します。
 *
 * 数値を0以外にした場合ウィンドウの高さが変動します。
 * 顔グラフィックを表示している場合は
 * 顔グラフィックのサイズもあわせて拡大、または縮小されます。
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
 * @param Window_Height_Offset
 * @desc メッセージウィンドウの高さを調整します。(-144～144の範囲、デフォルト:0)
 * @type number
 * @min -144
 * @max 144
 * @default 0
 *
*/

var Imported = Imported || {};
Imported.MKR_MessageWindowCustom = true;

(function () {
    'use strict';

    var PN = "MKR_MessageWindowCustom";

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

        regExp = /(\x1bV|\x1bN)\[\d+\]/i;
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
    };

    var Params = {
        "MesOffsetH" : CheckParam("num", "Window_Height_Offset", 0, -144, 144),
    };


    //=========================================================================
    //
    //  ・
    //
    //=========================================================================
    var _Window_Message_windowHeight = Window_Message.prototype.windowHeight;
    Window_Message.prototype.windowHeight = function() {
        var ret = _Window_Message_windowHeight.call(this);
        ret += Params.MesOffsetH[0];
        return ret;
    };

    Window_Message.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
        width = width || Window_Base._faceWidth;
        height = height || Window_Base._faceHeight;
        var bitmap = ImageManager.loadFace(faceName);
        var pw = Window_Base._faceWidth;
        var ph = Window_Base._faceHeight;
        var sw = Math.min(width, pw);
        var sh = Math.min(height, ph);
        var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
        var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
        var sx = faceIndex % 4 * pw + (pw - sw) / 2;
        var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
        var dw = pw + Params.MesOffsetH[0];
        var dh = ph + Params.MesOffsetH[0];
        this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, dw, dh);
    };

    Window_Message.prototype.newLineX = function() {
        return $gameMessage.faceName() === '' ? 0 : 168 + Params.MesOffsetH[0];
    };


    //=========================================================================
    //
    //  ・
    //
    //=========================================================================



    //=========================================================================
    // Window_Base
    //  ・改行コードで正しく改行が行われるよう再定義します。
    //
    //=========================================================================
    var _Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
    Window_Base.prototype.processEscapeCharacter = function(code, textState) {
        _Window_Base_processEscapeCharacter.call(this, code, textState);
        switch (code.toLowerCase()) {
            case 'n':
                this.processNewLine(textState);
                textState.index--;
                break;
        }
    };


    //=========================================================================
    // DataManager
    //  ・プラグイン導入前のセーブデータを
    //    ロードしたとき用の処理を定義します。
    //
    //=========================================================================
    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        // 処理を追記
    };


})();