//===============================================================================
// MKR_InputEnemyName.js
//===============================================================================
// (c) 2016 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.0 2020/04/04 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.0) エネミー名入力プラグイン
 * @author マンカインド
 *
 * @help = エネミー名入力プラグイン =
 * MKR_InputEnemyName.js
 *
 * ゲーム中にエネミーの名前を変更することができるようになります。
 * 変更する際は、アクター名の変更のように名前入力画面から変更します。
 * (変更したエネミー名は変数に保存されます)
 *
 *
 * 簡単な使い方説明:
 *   １．ツクールMVのデータベースを開き、[敵キャラ]タブを選択します。
 *   ２．名前を変更させたいエネミーのメモ欄に
 *         <enemyName:XX>
 *       と設定しデータベースを閉じます。(XXは変数番号)
 *   ３．既存のイベントをダブルクリックか、新規のイベントを作成し
 *       イベントエディタを表示します。
 *   ４．イベントコマンドから「プラグインコマンド」を選択し、
 *         enemyNameInput open XX YY
 *       と設定しイベントエディタを閉じます。
 *       (XXはエネミー番号、YYは最大入力可能文字数)
 *   ５．ゲーム中に４で作ったイベントを実行すると
 *       「エネミー名入力画面」が開きますので、好きな名前を入力します。
 *   ６．ゲーム中に５で名前を変更したエネミーと戦闘を開始すると
 *       エネミー名の表示が変更後のものになっています。
 *
 *
 * メモ欄_コピペ用:
 *     <enemyName:12>
 *   エネミー名として変数12番の値を参照します。
 *
 *
 * プラグインコマンド_コピペ用:
 *     enemyNameInput open 20 16
 *   エネミー名入力画面を開きます。
 *   変更対象のエネミーIDは20で、最大16文字まで入力できます。
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
 *   ・このプラグインに関するメモ欄の設定、プラグインコマンド/パラメーター、
 *     制御文字は大文字/小文字を区別していません。
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
*/

var Imported = Imported || {};
Imported.MKR_InputEnemyName = true;

(function () {
    'use strict';

    const PN = "MKR_InputEnemyName";

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


    //=========================================================================
    // Game_Interpreter
    //  ・エネミー名入力画面を開くプラグインコマンドを定義します。
    //
    //=========================================================================
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === "enemynameinput") {
            switch (args[0].toLowerCase()) {
                case "open":
                    SceneManager.push(Scene_EnemyName);
                    SceneManager.prepareNextScene(args[1], args[2]);
                    break;
            }
        }
    };


    //=========================================================================
    // Game_Enemy
    //  ・名前の参照処理を再定義し、名前の登録処理を定義します。
    //
    //=========================================================================
    const _Game_Enemy_originalName = Game_Enemy.prototype.originalName;
    Game_Enemy.prototype.originalName = function() {
        const index = GetMeta(this.enemy().meta, "enemyName");
        const value = index && index > 0 ? $gameVariables.value(index) : 0;
        return value ? value : _Game_Enemy_originalName.call(this);
    };

    Game_Enemy.prototype.setName = function(name) {
        const index = GetMeta(this.enemy().meta, "enemyName");
        if(index && index > 0) {
            $gameVariables.setValue(index, name);
        }
    };


    //=========================================================================
    // Scene_EnemyName
    //  ・エネミー名入力シーンを定義します。(Scene_Nameを継承)
    //
    //=========================================================================
    function Scene_EnemyName() {
        this.initialize.apply(this, arguments);
    }

    Scene_EnemyName.prototype = Object.create(Scene_Name.prototype);
    Scene_EnemyName.prototype.constructor = Scene_EnemyName;

    Scene_EnemyName.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._actor = new Game_Enemy(this._actorId, 0, 0);
        this.createEditWindow();
        this.createInputWindow();
    };

    Scene_Name.prototype.createEditWindow = function() {
        this._editWindow = new Window_EnemyNameEdit(this._actor, this._maxLength);
        this.addWindow(this._editWindow);
    };

    Scene_EnemyName.prototype.onInputOk = function() {
        this._actor.setName(this._editWindow.name());
        this.popScene();
    };


    //=========================================================================
    // Window_EnemyNameEdit
    //  ・エネミー名編集ウィンドウを定義します。(Window_NameEditの継承)
    //
    //=========================================================================
    function Window_EnemyNameEdit() {
        this.initialize.apply(this, arguments);
    }

    Window_EnemyNameEdit.prototype = Object.create(Window_NameEdit.prototype);
    Window_EnemyNameEdit.prototype.constructor = Window_EnemyNameEdit;

    Window_EnemyNameEdit.prototype.initialize = function(actor, maxLength) {
        const width = this.windowWidth();
        const height = this.windowHeight();
        const x = (Graphics.boxWidth - width) / 2;
        const y = (Graphics.boxHeight - (height + this.fittingHeight(9) + 8)) / 2;
        Window_Base.prototype.initialize.call(this, x, y, width, height);

        this._actor = actor;
        this._name = actor.name().slice(0, this._maxLength);
        this._index = this._name.length;
        this._maxLength = maxLength;
        this._defaultName = this._name;
        this.deactivate();
        this.refresh();
    };

    Window_EnemyNameEdit.prototype.left = function() {
        return 0;
    };

    Window_EnemyNameEdit.prototype.refresh = function() {
        this.contents.clear();
        for (let i = 0; i < this._maxLength; i++) {
            this.drawUnderline(i);
        }
        for (let j = 0; j < this._name.length; j++) {
            this.drawChar(j);
        }
        var rect = this.itemRect(this._index);
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    };


})();