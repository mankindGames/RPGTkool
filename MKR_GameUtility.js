//===============================================================================
// MKR_GameUtility.js
//===============================================================================
// Copyright (c) 2016-2018 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.0 2018/12/15 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.0) ゲームユーティリティプラグイン
 * @author マンカインド
 *
 * @help = ゲームユーティリティプラグイン ver 1.0.0 =
 * MKR_GameUtility.js
 *
 * ゲーム中の以下の動作を変更します。
 * 各動作はプラグインパラメータから有効/無効を切り替えられます。
 *
 * [1]
 * イベントコマンド「戦闘の中断」実行時に逃走時SEを再生させません。
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
 * ==============================================================================
 *
 * @param action 1 enable
 * @text [1]動作変更の有効化
 * @desc [1]動作変更の有効/無効を切り替えます。
 * @type boolean
 * @on 有効にする
 * @off 無効にする
 * @default false
 *
*/

var Imported = Imported || {};
Imported.MKR_GameUtility = true;

(function () {
    'use strict';

    const PN = "MKR_GameUtility";

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
            case "bool":
                if(value == "") {
                    value = (def)? true : false;
                }
                value = value.toUpperCase() === "ON" || value.toUpperCase() === "TRUE" || value.toUpperCase() === "1";
                break;
            default:
                throw new Error("[CheckParam] " + param + "のタイプが不正です: " + type);
                break;
        }

        return value;
    };

    const ParamParse = function(obj) {
        return JSON.parse(JSON.stringify(obj, ParamReplace));
    }

    const ParamReplace = function(key, value) {
        try {
            return JSON.parse(value || null);
        } catch (e) {
            return value;
        }
    };

    const Parameters = ParamParse(PluginManager.parameters(PN));
    let Params = {};

    Params = {
        "Action001" : CheckParam("bool", "[1]動作変更の有効化", Parameters["action 1 enable"], ""),
    };


    //=========================================================================
    // BattleManager
    //  ・戦闘中断時、逃走SEを再生させないようにします。
    //
    //=========================================================================
    const _BattleManager_checkAbort = BattleManager.checkAbort;
    BattleManager.checkAbort = function() {
        if(!Params.Action001) {
            return _BattleManager_checkAbort.call(this);
        }

        if ($gameParty.isEmpty() || this.isAborting()) {
            if(!this.isAborting()) {
                SoundManager.playEscape();
            }
            this._escaped = true;
            this.processAbort();
        }
        return false;
    };


})();