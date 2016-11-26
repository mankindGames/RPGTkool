//=============================================================================
// MKR_ChoiceWait.js
//=============================================================================
// Copyright (c) 2016 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.4 2016/11/26 キーボードで選択する際に、
//                  2番目の選択肢が初回選択になってしまう不具合を修正
//
// 1.0.3 2016/11/26 キーボードで選択肢を選択できないことがある不具合を修正
//
// 1.0.2 2016/11/23 不具合修正
//
// 1.0.1 2016/11/23 プラグインコマンドを追加。本機能をON/OFFできるように。
//
// 1.0.0 2016/11/23 初版公開
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v 1.0.4) デフォルト選択肢ウェイトプラグイン
 * @author マンカインド
 *
 * @help
 * 選択肢の表示時に、デフォルトの選択肢が選択されるまでの時間を
 * 指定したフレーム数の分だけ遅らせます。
 *
 * 簡単な使い方説明:
 *   プラグインを導入するだけでデフォルトの選択肢が選択されるまでの時間が
 *   60フレーム(1秒) 遅れます。
 *
 *   方向キーによる選択動作が発生した場合、
 *   即座にデフォルトの選択肢が選択されます。
 *
 *   プラグインパラメーターを設定することで
 *   デフォルトの選択肢が選択されるまでの時間は変更可能です。
 *
 *
 * プラグインコマンド:
 *   ChoiceWait ON
 *     ・本プラグインの機能を有効にします。
 *       (初期状態では有効になっています)
 *
 *   ChoiceWait OFF
 *     ・本プラグインの機能を無効にします。
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
 * @param Choice_Wait
 * @desc [変数可]デフォルトの選択肢が選択されるまでのフレーム数です。(60フレーム=1秒)
 * @default 60
 *
*/
(function () {
    'use strict';
    var PN = "MKR_ChoiceWait";

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

    var CEC = function(params) {
        var text, value, type, def, min, max, param;
        type = params[1];
        text = String(params[0]);
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        type = params[1];
        def = params[2];
        min = params[3];
        max = params[4];
        param = params[5];

        text = convertEscapeCharacters(text)

        switch(type) {
            case "num":
                value = (isFinite(text))? parseInt(text, 10) : (isFinite(def))? parseInt(def, 10) : 0;
                value = value.clamp(min, max);
                break;
            default:
                throw new Error("[CEC] " + param + "のタイプが不正です: " + type);
                break;
        }

        return value;
    };

    var convertEscapeCharacters = function(text) {
        var windowChild;

        if(typeof text == "string") {
            if(SceneManager._scene) {
                windowChild = SceneManager._scene._windowLayer.children[0];
                text = windowChild ? windowChild.convertEscapeCharacters(text) : text;
            } else {
                text = ConvVb(text);
            }
        }

        return text;
    };

    var ConvVb = function(text) {
        var num;

        if(typeof text == "string") {
            text = text.replace(/\x1bV\[(\d+)\]/i, function() {
                num = parseInt(arguments[1]);
                return $gameVariables.value(num);
            }.bind(this));
            text = text.replace(/\x1bV\[(\d+)\]/i, function() {
                num = parseInt(arguments[1]);
                return $gameVariables.value(num);
            }.bind(this));
        }

        return text;
    }

    var Choice_Wait;
    Choice_Wait = CheckParam("num", "Choice_Wait", 60, 0);


    //=========================================================================
    // Game_Interpreter
    //  ・デフォルト選択肢ウェイト制御プラグインコマンドを定義します
    //=========================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === "choicewait") {
            switch (args[0].toLowerCase()) {
                case "on":// 機能有効
                    $gameSystem.onChoiceWait();
                    break;
                case "off":// 機能無効
                    $gameSystem.offChoiceWait();
                    break;
            }
        }
    };


    //=========================================================================
    // Game_System
    //  ・デフォルト選択肢ウェイト制御を定義
    //=========================================================================
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function(){
        _Game_System_initialize.call(this);
        this._choiceWait = true;
    };

    Game_System.prototype.onChoiceWait = function(choiceWait) {
        if(!this.isChoiceWait()) {
            this._choiceWait = true;
        }
    };

    Game_System.prototype.offChoiceWait = function(choiceWait) {
        if(this.isChoiceWait()) {
            this._choiceWait = false;
        }
    };

    Game_System.prototype.isChoiceWait = function() {
        if('_choiceWait' in this) {
            return this._choiceWait;
        } else {
            return true;
        }
    };


    //=========================================================================
    // Window_ChoiceList
    //  ・選択肢の表示ウィンドウの機能を拡張します。
    //
    //=========================================================================
    var _Window_ChoiceList_start = Window_ChoiceList.prototype.start;
    Window_ChoiceList.prototype.start = function() {
        _Window_ChoiceList_start.call(this);

        if($gameSystem.isChoiceWait()) {
            this.select(-1);
        }
    };

    Window_ChoiceList.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);

        var waitCount = CEC(Choice_Wait);

        if(this.isOpen() && $gameSystem.isChoiceWait()) {
            if(this._index == -1 && this._stayCount >= waitCount) {
                this.selectDefault();
            }
        }
    };

    Window_ChoiceList.prototype.cursorUp = function(wrap) {
        var index, maxItems, maxCols;
        index = this.index();
        maxItems = this.maxItems();
        maxCols = this.maxCols();

        if($gameSystem.isChoiceWait()) {
            if (index >= maxCols || (wrap && maxCols === 1)) {
                if(index == -1) {
                    if($gameMessage.choiceDefaultType() > -1) {
                        this.selectDefault();
                    } else {
                        this.select(0);
                    }
                } else {
                    this.select((index - maxCols + maxItems) % maxItems);
                }
            }
        } else {
            Window_Selectable.prototype.cursorUp.call(this, wrap);
        }
    };

    Window_ChoiceList.prototype.cursorDown = function(wrap) {
        var index, maxItems, maxCols;
        index = this.index();
        maxItems = this.maxItems();
        maxCols = this.maxCols();

        if($gameSystem.isChoiceWait()) {
            if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
                if(index == -1) {
                    if($gameMessage.choiceDefaultType() > -1) {
                        this.selectDefault();
                    } else {
                        this.select(0);
                    }
                } else {
                    this.select((index + maxCols) % maxItems);
                }
            }
        } else {
            Window_Selectable.prototype.cursorDown.call(this, wrap);
        }
    };

})();