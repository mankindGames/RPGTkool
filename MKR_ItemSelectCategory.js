//===============================================================================
// MKR_ItemSelectCategory.js
//===============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.1 2017/12/10 アイテムメニューのカテゴリ設定を追加。
//
// 1.0.0 2017/10/25 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.1) アイテム選択カテゴリ設定プラグイン
 * @author マンカインド
 *
 * @help [アイテム選択の処理]イベントコマンドで"武器"や"防具"を選択可能にします。
 * 選択後、選択したカテゴリに属するアイテムのIDが指定した変数へと格納されます。
 *
 * 以下のプラグインコマンドを[アイテム選択の処理]前に使うことで、
 * アイテム選択ウィンドウに表示されるアイテムを切り替えられます。
 *
 * [コピー用]
 *   ItemCategory weapon
 *   ItemCategory armor
 *   ItemCategory item
 *
 *
 * プラグインコマンド:
 *   ItemCategory [weapon/armor/item]
 *     ・アイテム選択の処理で表示されるアイテムのカテゴリを変更します。
 *         weapon : カテゴリを"武器"に変更します。
 *          armor : カテゴリを"防具"に変更します。
 *           item : カテゴリを"アイテム"に変更します。(元々のカテゴリ)
 *
 *     ・アイテム選択ウィンドウが閉じられると、アイテムカテゴリは
 *       プラグインパラメータ[初期アイテムカテゴリ]で選択したものに
 *       変更されます。
 *
 *
 * スクリプトコマンド:
 *   ありません。
 *
 *
 * 補足：
 *   ・このプラグインに関するプラグインコマンドは
 *     大文字/小文字を区別していません。
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
 * @param init_item_category
 * @text 初期アイテムカテゴリ
 * @desc 初期状態でアイテム選択ウィンドウに表示されるアイテムのカテゴリを設定します。(デフォルト:アイテム)
 * @type select
 * @option アイテム
 * @value item
 * @option 武器
 * @value weapon
 * @option 防具
 * @value armor
 * @default item
 *
 * @param item_menu_category
 * @text アイテムメニューカテゴリ
 * @desc アイテムメニューを開いたときに選択されているアイテムのカテゴリを設定します。(デフォルト:アイテム)
 * @type select
 * @option アイテム
 * @value item
 * @option 武器
 * @value weapon
 * @option 防具
 * @value armor
 * @option 大事なもの
 * @value keyItem
 * @default item
 *
*/

var Imported = Imported || {};
Imported.MKR_ItemSelectCategory = true;

(function () {
    'use strict';

    const PN = "MKR_ItemSelectCategory";

    const CheckParam = function(type, name, value, def, min, max, options) {
        if(min == undefined || min == null) {
            min = -Infinity;
        }
        if(max == undefined || max == null) {
            max = Infinity;
        }

        if(value == null) {
            value = "";
        } else {
            value = String(value);
        }

        value = value.replace(/\\/g, '\x1b');
        value = value.replace(/\x1b\x1b/g, '\\');

        switch(type) {
            case "string":
                value = value.replace(/^\"/, "");
                value = value.replace(/\"$/, "");
                if(value != null && options && options.contains("lower")) {
                    value = value.toLowerCase();
                }
                if(value != null && options && options.contains("upper")) {
                    value = value.toUpperCase();
                }
                break;
            default:
                throw new Error("[CheckParam] " + name + "のタイプが不正です: " + type);
                break;
        }

        return value;
    };

    const paramParse = function(obj) {
        return JSON.parse(JSON.stringify(obj, paramReplace));
    }

    const paramReplace = function(key, value) {
        try {
            return JSON.parse(value || null);
        } catch (e) {
            return value;
        }
    };

    const Parameters = paramParse(PluginManager.parameters(PN));

    const Params = {
        "InitItemCategory" : CheckParam("string", "init_item_category", Parameters["init_item_category"], "item"),
        "ItemMenuCategory" : CheckParam("string", "item_menu_category", Parameters["item_menu_category"], "item"),
    };

    //=========================================================================
    // Game_Interpreter
    //  ・アイテムカテゴリ設定用コマンドを定義します。
    //
    //=========================================================================
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        let category;
        if (command.toLowerCase() === "itemcategory") {
            category = args[0].toLowerCase();
            switch (category) {
                case "weapon":
                case "armor":
                case "item":
                    $gameMessage.setItemChoiceCategory(category);
                    break;
            }
        }
    };


    //=========================================================================
    // Game_Message
    //  ・アイテム選択ウィンドウに関する変数を定義します。
    //
    //=========================================================================
    const _Game_Message_clear = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        _Game_Message_clear.call(this);
        this._itemChoiceCategory = Params.InitItemCategory;
    };

    Game_Message.prototype.itemChoiceCategory = function() {
        return this._itemChoiceCategory;
    };

    Game_Message.prototype.setItemChoiceCategory = function(category) {
        this._itemChoiceCategory = category;
    };

    //=========================================================================
    // Window_EventItem
    //  ・アイテム選択ウィンドウの項目を再定義します。
    //
    //=========================================================================
    const _Window_EventItem_includes = Window_EventItem.prototype.includes;
    Window_EventItem.prototype.includes = function(item) {
        switch($gameMessage.itemChoiceCategory()) {
            case 'armor':
                return DataManager.isArmor(item);
            case 'weapon':
                return DataManager.isWeapon(item);
            default:
                return _Window_EventItem_includes.call(this, item);
        }
    };

    //=========================================================================
    // Window_ItemCategory
    //  ・アイテムメニューのカテゴリウィンドウの項目を再定義します。
    //
    //=========================================================================
    const _Window_ItemCategory_initialize = Window_ItemCategory.prototype.initialize;
    Window_ItemCategory.prototype.initialize = function() {
        _Window_ItemCategory_initialize.call(this);
        this.selectSymbol(Params.ItemMenuCategory);
    };

})();