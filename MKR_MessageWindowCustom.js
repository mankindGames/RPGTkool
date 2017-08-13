//=============================================================================
// MKR_MessageWindowCustom.js
//=============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.2 2017/08/13 ウィンドウ位置を調整できる機能を追加。
//
// 1.0.1 2017/06/25 余計なコードが残っていたため修正。
//
// 1.0.0 2017/06/25 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.2) メッセージウィンドウカスタマイズプラグイン
 * @author マンカインド
 *
 * @help = メッセージウィンドウカスタマイズプラグイン ver1.0.2 =
 * MKR_MessageWindowCustom.js - マンカインド
 *
 * このプラグインを導入することでメッセージウィンドウに
 * 以下の変更を加えることができます。
 *
 *   ・行数を変えることなく、ウィンドウ高さの調整
 *   ・ウィンドウ表示位置の調整
 *
 *
 * プラグインパラメータ[Window_Height_Offset]の数値を設定することにより
 * メッセージウィンドウ([文章の表示]コマンドで表示に使われるウィンドウ)の
 * 高さをピクセル単位で調整します。
 *
 * 数値を0以外にした場合ウィンドウの高さが変動します。
 * 顔グラフィックを表示している場合は
 * 顔グラフィックのサイズもあわせて拡大、または縮小されます。
 *
 *
 * 以下のプラグインコマンドを実行することにより
 *
 *   windowMessage positon [X座標] [Y座標]
 *
 * メッセージウィンドウの表示位置を変更することができます。
 * 変更後のウィンドウサイズ・顔グラフィックサイズは自動的に調整されます。
 *
 * なお、ウィンドウメッセージを閉じと上記プラグインコマンドによる変更は
 * 元に戻ります。
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
    // Game_Interpreter
    //  ・メッセージウィンドウに関するプラグインコマンドを定義します。
    //
    //=========================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        var x, y;
        x = $gameMessage.positionX();
        y = $gameMessage.positionY();

        if (command.toLowerCase() === "messagewindow") {
            switch (args[0].toLowerCase()) {
                case "position":
                    if(args[1] != "" && isFinite(args[1])) {
                        x = parseInt(args[1], 10);
                        $gameMessage.setPositionX(x);
                    }
                    if(args[2] != "" && isFinite(args[2])) {
                        y = parseInt(args[2], 10);
                        $gameMessage.setPositionY(y);
                    }
                    break;
            }
        }
    };


    //=========================================================================
    // Game_Message
    //  ・ウィンドウの表示設定を再定義します。
    //
    //=========================================================================
    var _Game_Message_clear = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        _Game_Message_clear.call(this);
        this._positionX = 0;
        this._positionY = 0;
    };

    Game_Message.prototype.positionX = function() {
        return this._positionX;
    };

    Game_Message.prototype.setPositionX = function(x) {
        this._positionX = x;
    };

    Game_Message.prototype.positionY = function() {
        return this._positionY;
    };

    Game_Message.prototype.setPositionY = function(y) {
        this._positionY = y;
    };


   //=========================================================================
    // Window_Message
    //  ・ウィンドウの表示設定を再定義します。
    //
    //=========================================================================
    var _Window_Message_windowHeight = Window_Message.prototype.windowHeight;
    Window_Message.prototype.windowHeight = function() {
        var ret = _Window_Message_windowHeight.call(this);
        ret += Params.MesOffsetH[0];
        return ret;
    };

    var _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function() {
        _Window_Message_updatePlacement.call(this);

        var width, height, x, y;
        width = this.windowWidth();
        height = this.windowHeight();
        x = (Graphics.boxWidth - width) / 2;
        y = this._positionType * (Graphics.boxHeight - this.height) / 2;

        if($gameMessage.positionX() > 0 || $gameMessage.positionY() > 0) {
            x = $gameMessage.positionX() > 0 ? $gameMessage.positionX() : x;
            y = $gameMessage.positionY() > 0 ? $gameMessage.positionY() : y;
            width = (Graphics.boxWidth - x) > 0 ? Graphics.boxWidth - x : width;
            height = (height + y) > Graphics.boxHeight ? Graphics.boxHeight - y : height;
        }
        this.move(x, y, width, height);
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
        if(Params.MesOffsetH[0] != 0) {
            var dw = pw + Params.MesOffsetH[0];
            var dh = ph + Params.MesOffsetH[0];
        } else {
            var dw = this.height - this.standardPadding() * 2;
            var dh = this.height - this.standardPadding() * 2;
        }
        this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, dw, dh);
    };

    Window_Message.prototype.newLineX = function() {
        return $gameMessage.faceName() === '' ? 0 : 168 + Params.MesOffsetH[0];
    };

})();