//=============================================================================
// MKR_VehicleEvent.js
//=============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2017/05/21 コード、プラグインヘルプを整備
// 1.0.0 2017/05/16 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.1) 乗り物イベントプラグイン
 * @author マンカインド
 *
 * @help = 乗り物イベントプラグイン =
 * イベントのメモ欄を設定することで、イベントのタイル通行可能設定を
 * 大型船、または小型船として扱い、
 * 深海、海を移動させることができるようになります。
 *
 *
 * イベント_メモ欄:
 *   <boat>
 *     ・イベントのタイル通行可能設定を小型船として扱い、
 *       海を移動できるようにします。
 *
 *   <ship>
 *     ・イベントのタイル通行可能設定を大型船として扱い、
 *       深海、海を移動できるようにします。
 *
 *
 * プラグインパラメーター:
 *   ありません。
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
*/

var Imported = Imported || {};
Imported.MKR_VehicleEvent = true;

(function () {
    'use strict';

    // var PN = "MKR_VehicleEvent";

    //=========================================================================
    // Game_CharacterBase
    //  ・イベントの通行可能設定を再定義します。
    //
    //=========================================================================
    var _Game_CharacterBase_canPass = Game_CharacterBase.prototype.canPass;
    Game_CharacterBase.prototype.canPass = function(x, y, d) {
        var ret, type, x2, y2;
        ret = _Game_CharacterBase_canPass.apply(this, arguments);
        type = this.vehicleType();

        if(type) {
            ret = true;
            x2 = $gameMap.roundXWithDirection(x, d);
            y2 = $gameMap.roundYWithDirection(y, d);

            if(type == "boat") {
                ret = $gameMap.isBoatPassable(x2, y2);
            } else if(type == "ship") {
                ret = $gameMap.isShipPassable(x2, y2);
            } else {
                if (!this.isMapPassable(x, y, d)) {
                    ret = false;
                }
            }

            if (!$gameMap.isValid(x2, y2)) {
                ret = false;
            }

            if (this.isThrough() || this.isDebugThrough()) {
                ret = true;
            }

            if (this.isCollidedWithCharacters(x2, y2)) {
                ret = false;
            }
        }
        return ret;
    };

    Game_CharacterBase.prototype.vehicleType = function() {
        var ret, ev, pattern, notes, cnt, n, i, match;
        ret = "";
        pattern = /<(boat|ship)>/i

        if(this instanceof Game_Vehicle) {
            return this._type;
        }
        if(this instanceof Game_Player || this instanceof Game_Follower) {
            return "";
        }
        ev = this.event();

        if(ev.note) {
            notes = ev.note.toLowerCase().split(/ (?=<)/);
            cnt = notes.length;

            for(i = 0; i < cnt; i++) {
                n = notes[i].trim();

                if(pattern.test(n)) {
                    match = n.match(pattern);
                    ret = match[1];
                }
            }
        }

        return ret;
    }

})();