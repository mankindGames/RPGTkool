//===============================================================================
// MKR_ThroughCustomize.js
//===============================================================================
// Copyright (c) 2016-2018 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.1 2018/04/01 イベントページに対しすり抜けの不許可設定を行えるようにした。
//
// 1.0.0 2018/03/25 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.1) すり抜けカスタマイズ
 * @author マンカインド
 *
 * @help = すり抜けカスタマイズ ver 1.0.1 =
 * MKR_ThroughCustomize.js
 *
 * プラグインパラメータで指定したスイッチがONの間、
 * プレイヤーがすり抜け状態ですり抜けられる対象が他イベントのみに制限されます。
 * = 壁や障害物など、通行不可能な地形がすり抜けられなくなります。
 *
 * また、イベントページ最初の注釈文に以下の記述がされたイベントは
 * プレイヤーがすり抜けることができなくなります。
 * (そのページの出現条件を満たしている場合のみ)
 *
 *   <すり抜け禁止>
 *
 * オマケ機能として、プラグインパラメータからリージョン、地形タグを
 * 指定することでそれらが設定されたマスもすり抜け不可になります。
 *
 * なお、これらの機能は
 * テストプレイ中のみ実行可能なデバッグ機能によるすり抜け状態の場合には
 * 有効になりません。
 * (Windows環境の場合、CtrlキーまたはAltキーを押しながら移動
 *  Mac環境の場合、Commmandキーまたはoptionキーを押しながら移動)
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
 * @param enable_switch
 * @text 機能有効スイッチ
 * @desc ONのときに機能を有効にするスイッチ番号を指定します。
 * @type switch
 * @default 0
 *
 * @param region_setting
 * @text すり抜け無効リージョン
 * @desc すり抜けられないリージョン番号を指定します。
 * @type number[]
 * @decimals 0
 * @min 1
 * @max 255
 * @default []
 *
 * @param terrain_setting
 * @text すり抜け無効地形タグ
 * @desc すり抜けられない地形タグ番号を指定します。
 * @type number[]
 * @decimals 0
 * @min 0
 * @max 7
 * @default []
 *
*/

var Imported = Imported || {};
Imported.MKR_ThroughCustomize = true;

(function () {
    'use strict';

    const PN = "MKR_ThroughCustomize";

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
    };

    const paramReplace = function(key, value) {
        try {
            return JSON.parse(value || null);
        } catch (e) {
            return value;
        }
    };

    const Parameters = paramParse(PluginManager.parameters(PN));

    const Params = {
        "EnableSwitch" : CheckParam("num", "機能有効スイッチ", Parameters["enable_switch"], 0, 0),
        "RegionSetting" : Parameters["region_setting"].map(function(value, i) {
            return CheckParam("num", "すり抜け無効リージョン[" + (i + 1) + "]", value, 1, 1, 255);
        }),
        "TerrainSetting" : Parameters["terrain_setting"].map(function(value, i) {
            return CheckParam("num", "すり抜け無効地形タグ[" + (i + 1) + "]", value, 0, 0, 7);
        }),
    };

    const Regex = {
        "ThroughDisable" : /<すり抜け禁止>/,
    };


    //=========================================================================
    // Game_Player
    //  ・プレイヤーの移動可能判定処理を再定義します。
    //
    //=========================================================================
    const _Game_Player_canPass = Game_Player.prototype.canPass;
    Game_Player.prototype.canPass = function(x, y, d) {
        let ret;
        ret = _Game_Player_canPass.apply(this, arguments);


        if(this.canThrough(ret, x, y, d)) {
            return ret;
        }

        return false;
    };

    Game_Player.prototype.canThrough = function(ret, x, y, d) {
        let x2, y2, regionId, terrainTag, events, hasThroughTag;
        x2 = $gameMap.xWithDirection(x, d);
        y2 = $gameMap.yWithDirection(y, d);
        regionId = $gameMap.regionId(x2, y2);
        terrainTag = $gameMap.terrainTag(x2, y2);
        events = $gameMap.eventsXy(x2, y2);
        hasThroughTag = function(events) {
            return events.some(function(ev) {
                return ev.hasThroughTag();
            });
        };

        if(!ret || !$gameSwitches.value(Params.EnableSwitch)) {
            return ret;
        }
        if(!this.isThrough() || this.isDebugThrough()) {
            return ret;
        }
        if(!this.isMapPassable(x, y, d)) {
            return false;
        }
        if(Params.RegionSetting.indexOf(regionId) != -1) {
            return false;
        }
        if(Params.TerrainSetting.indexOf(terrainTag) != -1) {
            return false;
        }
        if(hasThroughTag(events)) {
            return false;
        }

        // switch(true) {
        //     case !ret || !$gameSwitches.value(Params.EnableSwitch):
        //     case !this.isThrough() || this.isDebugThrough():
        //         return ret;
        //     case !this.isMapPassable(x, y, d):
        //     case Params.RegionSetting.indexOf(regionId) != -1:
        //     case Params.TerrainSetting.indexOf(terrainTag) != -1:
        //     case hasThroughTag(events):
        //         return false;
        // }

        return ret;
    };


    //=========================================================================
    // Game_Event
    //  ・ページセットアップに注釈文を解釈する処理を定義します。
    //  ・イベントごとにすり抜け禁止設定を追加します。
    //
    //=========================================================================
    const _Game_Event_initMembers = Game_Event.prototype.initMembers;
    Game_Event.prototype.initMembers = function() {
        _Game_Event_initMembers.call(this);
        this._throughTag = 0;
    };

    const _Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function() {
        _Game_Event_setupPage.call(this);

        this.setupThroughTag();
    };

    Game_Event.prototype.setupThroughTag = function() {
        let page, comment;
        this._throughTag = 0;
        page = this.page();
        comment = "";

        if(!page) {
            return;
        }

        page.list.forEach(function(list) {
            if(!list || list.code != 108 && list.code != 408) {
                return false;
            }
            if(comment.length > 0) {
                comment += "\n";
            }
            comment += list.parameters[0];
        });

        if(Regex.ThroughDisable.test(comment)) {
            this._throughTag = 1;
        }
    };

    Game_Event.prototype.hasThroughTag = function() {
        return this._throughTag;
    }

})();