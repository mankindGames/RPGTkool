//===============================================================================
// MKR_FollowerLimit.js
//===============================================================================
// Copyright (c) 2016-2018 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.0 2018/05/09 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.0) 隊列人数制限プラグイン
 * @author マンカインド
 *
 * @help = 隊列人数制限プラグイン ver 1.0.0 =
 * MKR_FollowerLimit.js
 *
 * マップ画面でプレイヤーの後ろに表示される仲間の人数を、
 * プラグインパラメータで指定した数に制限します。
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
 * @param follower_limit
 * @text 隊列人数
 * @desc プレイヤーの後ろに表示される仲間の数を指定します。(デフォルト:3)
 * @type number
 * @min 0
 * @default 3
 *
*/

var Imported = Imported || {};
Imported.MKR_FollowerLimit = true;

(function () {
    'use strict';

    const PN = "MKR_FollowerLimit";

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
            case "num":
                if(value == "") {
                    value = (isFinite(def))? parseInt(def, 10) : 0;
                } else {
                    value = (isFinite(value))? parseInt(value, 10) : (isFinite(def))? parseInt(def, 10) : 0;
                    value = value.clamp(min, max);
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
        "FollwerLimit" : CheckParam("num", "隊列人数", Parameters["follower_limit"], 3, 0),
    };


    //=========================================================================
    // Game_Followers
    //  ・隊列拡張処理を定義します。
    //
    //=========================================================================
    const _Game_Followers_initialize = Game_Followers.prototype.initialize;
    Game_Followers.prototype.initialize = function() {
        _Game_Followers_initialize.call(this);
        this.followerExtended();
    };

    Game_Followers.prototype.followerExtended = function() {
        let limit, i, cnt;
        limit = this._data.length - Params.FollwerLimit;
        i = 0;
        cnt = this._data.length + 1;

        if(limit > 0) {
            limit = Math.abs(limit);
            for(i; i < limit; i++) {
                this._data.pop();
            }
        } else {
            limit = Math.abs(limit);
            for(i; i < limit; i++) {
                this._data.push(new Game_Follower(cnt++));
            }
        }
    };


    //=========================================================================
    // Game_Follower
    //  ・アクター参照をバトルメンバーから全てのメンバーにします。
    //
    //=========================================================================
    const _Game_Follower_actor = Game_Follower.prototype.actor;
    Game_Follower.prototype.actor = function() {
        let ret = _Game_Follower_actor.call(this);
        return $gameParty.allMembers()[this._memberIndex];
    };


    //=========================================================================
    // DataManager
    //  ・プラグイン導入前のセーブデータを
    //    ロードしたとき用の処理を定義します。
    //
    //=========================================================================
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        // 処理を追記
        $gamePlayer.followers().followerExtended();
    };


})();