//=============================================================================
// MKR_MenuCustomized_2.js
//=============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2017/05/31 ・コマンド「アイテム選択の処理」で開かれる
//                    アイテムリストの列数を指定可能に。
//
// 1.0.0 2017/05/30 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.1) メニューカスタマイズプラグインその2
 * @author マンカインド
 *
 * @help = メニューカスタマイズプラグインその2 ver 1.0.1 =
 *
 * このプラグインを導入すると、
 *   ・メニュー画面のアイテム一覧
 *   ・メニュー画面のスキル一覧
 *   ・バトル画面のアイテム一覧
 *   ・バトル画面のスキル一覧
 *   ・マップ画面の「アイテム選択の処理」一覧
 * の表示列数が変更されます。
 *
 * 変更後の列数についてはプラグインパラメーターで個別に指定が可能です。
 * 値を2に設定すればツクールMVの初期表示と同じ状態になります。
 *
 * パラメーターの初期値は1のため、導入するだけで各一覧の表示が1列になります。
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
 * @param Menu_ItemList_Cols
 * @desc メニュー→アイテムリストの列数を指定します。(デフォルト:1)
 * @default 1
 *
 * @param Menu_SkillList_Cols
 * @desc メニュー→スキルリストの列数を指定します。(デフォルト:1)
 * @default 1
 *
 * @param Battle_ItemList_Cols
 * @desc バトル→アイテムリストの列数を指定します。(デフォルト:1)
 * @default 1
 *
 * @param Battle_SkillList_Cols
 * @desc バトル→スキルリストの列数を指定します。(デフォルト:1)
 * @default 1
 *
 * @param Map_ItemList_Cols
 * @desc マップ→「アイテム選択の処理」リストの列数を指定します。(デフォルト:1)
 * @default 1
 *
*/

var Imported = Imported || {};
Imported.MKR_MenuCustomized_2 = true;

(function () {
    'use strict';
    var PN, Params;
    PN = "MKR_MenuCustomized_2";

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

        return [value, type, def, min, max, param];
    }

    Params = {
        "MenuIListCols" : CheckParam("num", "Menu_ItemList_Cols", 1, 0),
        "MenuSListCols" : CheckParam("num", "Menu_SkillList_Cols", 1, 0),
        "BattleIListCols" : CheckParam("num", "Battle_ItemList_Cols", 1, 0),
        "BattleSListCols" : CheckParam("num", "Battle_SkillList_Cols", 1, 0),
        "MapIListCols" : CheckParam("num", "Map_ItemList_Cols", 1, 0),
    };


    //=========================================================================
    // Window_SkillList
    //  ・メニューシーンのスキルリストウィンドウを再定義します。
    //
    //=========================================================================
    var _Window_SkillList_maxCols = Window_SkillList.prototype.maxCols;
    Window_SkillList.prototype.maxCols = function() {
        return Params.MenuSListCols[0];
    };


    //=========================================================================
    // Window_ItemList
    //  ・メニューシーンのアイテムリストウィンドウを再定義します。
    //
    //=========================================================================
    var _Window_ItemList_maxCols = Window_ItemList.prototype.maxCols;
    Window_ItemList.prototype.maxCols = function() {
        return Params.MenuIListCols[0];
    };


    //=========================================================================
    // Window_BattleSkill
    //  ・バトルシーンのスキルリストウィンドウを再定義します。
    //
    //=========================================================================
    Window_BattleSkill.prototype.maxCols = function() {
        return Params.BattleSListCols[0];
    };


    //=========================================================================
    // Window_BattleItem
    //  ・バトルシーンのアイテムリストウィンドウを再定義します。
    //
    //=========================================================================
    Window_BattleItem.prototype.maxCols = function() {
        return Params.BattleIListCols[0];
    };


    //=========================================================================
    // Window_EventItem
    //  ・マップシーンの「アイテム選択の処理」コマンドで開かれる
    //    アイテムリストウィンドウを再定義します。
    //
    //=========================================================================
    Window_EventItem.prototype.maxCols = function() {
        return Params.MapIListCols[0];
    };


})();