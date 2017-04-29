//=============================================================================
// MKR_CloseCommand.js
//=============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/04/30 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.0) 閉じるコマンド追加プラグイン
 * @author マンカインド
 *
 * @help
 * 以下のウィンドウに「閉じる」コマンドを追加し、
 * 選択・決定することでウィンドウを閉じることができるようになります。
 *
 *   ・オプションウィンドウ
 *
 *
 * モバイルなどのキャンセル動作が分かりづらい環境や、視覚的に「閉じる」動作を
 * 表示させたい場合にご使用ください。
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
 * @param command_symbol
 * @desc コマンドのシンボル名を指定します。他コマンドとシンボル名が重複する場合に変更が必要です。(基本的にこのままで大丈夫です)
 * @default mkrClose
 *
 * @param close_option
 * @desc オプションウィンドウに「閉じる」コマンドを追加する場合はONを指定してください。(ON/OFF)
 * @default ON
 *
 * @param close_option_name
 * @desc オプションウィンドウ追加する「閉じる」コマンドの名称を指定してください。
 * @default 閉じる
 *
*/

var Imported = Imported || {};
Imported.MKR_CloseCommand = true;

(function () {
    'use strict';

    var PN = "MKR_CloseCommand";

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

        switch(type) {
            case "bool":
                if(value == "") {
                    value = (def)? true : false;
                }
                value = value.toUpperCase() === "ON" || value.toUpperCase() === "TRUE" || value.toUpperCase() === "1";
                break;
            case "string":
                value = value;
                break;
            default:
                throw new Error("[CheckParam] " + param + "のタイプが不正です: " + type);
                break;
        }

        return [value, type, def, min, max, param];
    };

    var Params = {
        "CS" : CheckParam("string", "command_symbol", "mkrClose"),
        "CloseOp" : CheckParam("bool", "close_option", "ON"),
        "CloseOpN" : CheckParam("string", "close_option_name", "閉じる"),
    };


    //=========================================================================
    // Window_Options
    //  ・閉じるコマンドを定義します。
    //
    //=========================================================================
    if(Params.CloseOp[0]) {
        var _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
        Window_Options.prototype.makeCommandList = function() {
            _Window_Options_makeCommandList.call(this);
            this.addCloseCommand();
        };

        Window_Options.prototype.addCloseCommand = function() {
            this.addCommand(Params.CloseOpN[0], Params.CS[0]);
        };

        var _Window_Options_drawItem = Window_Options.prototype.drawItem;
        Window_Options.prototype.drawItem = function(index) {
            var symbol, rect, width;
            symbol = this.commandSymbol(index);

            if(this.isCloseSymbol(symbol)){
                rect = this.itemRectForText(index);
                width = this.statusWidth();
                this.resetTextColor();
                this.changePaintOpacity(this.isCommandEnabled(index));
                this.drawText(this.commandName(index), rect.x, rect.y, width, 'left');
            } else {
                _Window_Options_drawItem.call(this, index);
            }
        };

        var _Window_Options_processOk = Window_Options.prototype.processOk
        Window_Options.prototype.processOk = function() {
            var index, symbol;
            index = this.index();
            symbol = this.commandSymbol(index);

            if(this.isCloseSymbol(symbol)) {
                this.processCancel();
            } else {
                _Window_Options_processOk.call(this);
            }
        };

        Window_Options.prototype.isCloseSymbol = function(symbol) {
            return symbol.contains(Params.CS[0]);
        };
    }

})();