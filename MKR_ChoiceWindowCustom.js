//=============================================================================
// MKR_ChoiceWindowCustom.js
//=============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/06/21 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.0) 選択肢ウィンドウカスタマイズプラグイン
 * @author マンカインド
 *
 * @help = 選択肢ウィンドウカスタマイズプラグイン ver1.0.0 =
 *
 * プラグインコマンドによって、選択肢ウィンドウに以下の変更を行います。
 *   ・1行の高さを変更
 *
 *
 * プラグインコマンド:
 *   ChoiceWindow line [数字]
 *     ・選択肢ウィンドウに表示されている1行の高さを[数字]に変更します。
 *
 *     ・[数字]には0より大きい数を指定してください。
 *
 *     ・rpg_windows.jsの35行目付近に書かれている
 *       Window_Base.prototype.lineHeight() 内の数字である
 *       36 がデフォルト値となります。
 *       (他のプラグインによって値が変更されている場合を覗く)
 *
 *     ・プラグインコマンドの効果は、その後の選択肢の表示1回分のみです。
 *       指定しない場合はデフォルト値が使用されます。
 *
 *
 * プラグインパラメーター:
 *   ありません。
 *
 *
 * スクリプトコマンド:
 *   ありません。
 *
 *
 * 補足：
 *   ・このプラグインに関するプラグインコマンドは大文字/小文字を
 *     区別していません。
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
*/

var Imported = Imported || {};
Imported.MKR_ChoiceWindowCustom = true;

(function () {
    'use strict';

    // var PN = "MKR_ChoiceWindowCustom";


    //=========================================================================
    // Game_Interpreter
    //  ・選択肢ウィンドウに変更を加えるプラグインコマンドを定義します。
    //
    //=========================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === "choicewindow") {
            switch (args[0].toLowerCase()) {
                case "line":
                    $gameMessage.setChoiceLineHeight(args[1]);
                    break;
            }
        }
    };


    //=========================================================================
    // Game_Message
    //  ・選択肢ウィンドウで行の高さ変更を保持する変数を定義します。
    //
    //=========================================================================
    var _Game_Message_clear = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        _Game_Message_clear.call(this);
        this._choiceLineHeight = Window_Base.prototype.lineHeight();
    };

    Game_Message.prototype.setChoiceLineHeight = function(height) {
        if(height != null && isFinite(height)) {
            height = parseInt(height, 10);
            if(height > 0) {
                this._choiceLineHeight = height;
            }
        }
    };

    Game_Message.prototype.getChoiceLineHeight = function() {
        return this._choiceLineHeight;
    };


    //=========================================================================
    // Window_ChoiceList
    //  ・行の高さを再定義します。
    //
    //=========================================================================
    Window_ChoiceList.prototype.lineHeight = function() {
        return $gameMessage.getChoiceLineHeight();
    };

    var _Window_ChoiceList_drawItem = Window_ChoiceList.prototype.drawItem;
    Window_ChoiceList.prototype.drawItem = function(index) {
        // _Window_ChoiceList_drawItem.call(this, index);

        var rect, y;
        rect = this.itemRectForText(index);
        y = rect.y + rect.height / 2 - this.standardFontSize() / 2 - 2;

        this.drawTextEx(this.commandName(index), rect.x, y);
    };

})();