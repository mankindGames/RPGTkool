//===============================================================================
// MKR_TileEvent.js
//===============================================================================
// (c) 2016 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.1 2020/10/28 機能制御スイッチの状態判定が逆転していた不具合を修正
// 1.0.0 2018/09/03 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.1) タイルイベントプラグイン
 * @author マンカインド
 *
 * @help MKR_TileEvent.js
 *
 * タイルセット毎に地形タグとメモ欄を設定し、
 * そのタイルにプレイヤーが移動することで
 * 対応するコモンイベントを起動することができるようになります。
 *
 *
 * タイルセット_メモ欄:
 *   <tile[地形タグ]:[コモンイベント番号]>
 *     ・指定した[地形タグ]を持つタイルにプレイヤーが移動した時、
 *       [コモンイベント番号]のコモンイベントを起動します。
 *       例:
 *         <tile1:50>  -> 地形タグ1番のタイルに移動すると、
 *                        コモンイベント50番のイベントが起動します。
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
 * @param enable switch
 * @text 機能制御スイッチ
 * @desc 指定したスイッチがONのとき、タイルセットイベントを起動させません。(0の場合はスイッチ制御無効)
 * @type switch
 * @default 0
 *
*/

var Imported = Imported || {};
Imported.MKR_TileEvent = true;

(function () {
    'use strict';

    const PN = "MKR_TileEvent";

    const CheckParam = function(type, name, value, def, min, max, options) {
        if(arguments.length < 4) {
            min = -Infinity;
            max = Infinity;
        }
        if(arguments.length < 5) {
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
            case "switch":
                if(value == "") {
                    value = (def != "")? def : value;
                }
                if(!value.match(/^([A-D]|\d+)$/i)) {
                    throw new Error("[CheckParam] " + param + "の値がスイッチではありません: " + param + " : " + value);
                }
                break;
            default:
                throw new Error("[CheckParam] " + param + "のタイプが不正です: " + type);
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
        EnableSwitch : CheckParam("switch", "機能制御スイッチ", Parameters["enable switch"], 0),
    };


    //=========================================================================
    // Game_Player
    //  ・地形タグによるコモンイベント起動処理を定義します。
    //
    //=========================================================================
    const _Game_Player_updateNonmoving = Game_Player.prototype.updateNonmoving;
    Game_Player.prototype.updateNonmoving = function(wasMoving) {
        let isEnable;
        isEnable = (Params.EnableSwitch < 1) ? true : $gameSwitches.value(Params.EnableSwitch) ? false : true;

        if (!$gameMap.isEventRunning() && isEnable) {
            if (wasMoving) {
                $gameParty.onPlayerWalk();
                this.checkTileEventTriggerHere();
                if ($gameMap.setupStartingEvent()) {
                    return;
                }
            }
        }

        _Game_Player_updateNonmoving.call(this, wasMoving);
    };

    Game_Player.prototype.checkTileEventTriggerHere = function() {
        let tilesetId, tileset,metas,tagId,commonId;

        tilesetId = $gameMap.tilesetId();
        if(tilesetId < 1) {
            return;
        }

        tileset = $dataTilesets[tilesetId];
        if(!tileset) {
            return;
        }

        metas = tileset.meta;
        if(!metas) {
            return;
        }

        tagId = $gamePlayer.terrainTag();
        if(!("tile"+tagId in metas)) {
            return;
        }

        commonId = metas["tile"+tagId];
        if(commonId > 0) {
            $gameTemp.reserveCommonEvent(commonId);
        }

    };


})();