//=============================================================================
// MKR_MapScrollFix.js
//=============================================================================
// Copyright (c) 2016 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2019/07/28 DP_MapZoomプラグインとの競合を修正
//
// 1.0.4 2019/07/15 画面固定時、画面のスクロールを
//                  タイル単位で行わないようにできる設定を追加
//
// 1.0.3 2017/10/24 画面固定時、ジャンプ移動で画面外へ移動できていた
//                  問題を修正。
//
// 1.0.2 2017/10/20 一部プラグインとの競合に対応。
//
// 1.0.1 2017/10/04 スクロール固定時、画面外への離脱と画面内への侵入を
//                  制限できるようにした。
//
// 1.0.0 2016/10/24 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.1.0) マップスクロール固定プラグイン
 * @author マンカインド
 *
 * @help = MKR_MapScrollFix.js =
 * 指定されたスイッチがオンの間、
 * プレイヤーの移動によるマップスクロールを固定します。
 *
 * プラグインパラメータ(以下、パラメータ)でスクロールを禁止するための
 * スイッチ番号を指定します。
 * ゲーム中にそのスイッチがオンになると画面スクロールが固定されます。
 *
 *
 * パラメータ[画面外への離脱/画面内への侵入]により、
 * イベントが固定された画面から外への離脱、画面内への侵入が可能か設定できます。
 * (プレイヤー/イベントがすり抜けONの場合、この設定は無視されます)
 *
 *
 * スクロール固定はタイル(48px四方)単位で行われます。
 * そのため、解像度変更などでマップ画面の更新がタイル単位で行われなくなった場合、
 * 画面表示がタイル単位になるようスクロールされてから固定が行われます。
 *
 * パラメータ[画面固定方法]で「緩和する」を設定することで、
 * タイル単位ではなくその場で画面が固定されます。
 * ただし、キャラクター移動はタイル単位となっているため、
 * 画面固定の結果、画面内に収まっていないタイルは画面外と判定されます。
 *
 *
 * プラグイン:DP_MapZoom.js(以下、MapZoomプラグイン)併用時、
 * プラグイン管理画面で本プラグインをMapZoomプラグインより下に登録し
 * 本プラグインのプラグインパラメータ[MapZoom併用]を「有効にする」と
 * 設定してください。
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
 *
 * @param Default_Scroll_Fix_Sw
 * @text スクロール固定スイッチ
 * @desc 画面スクロールを固定するスイッチの番号を指定します。
 * @type switch
 * @default 10
 *
 * @param Is_Display_Out
 * @text 画面外への離脱
 * @desc 画面スクロール固定時、イベントが画面外へと移動可能か選択します。
 * @type boolean
 * @on 移動可能
 * @off 移動不可
 * @default true
 *
 * @param Is_Display_In
 * @text 画面内への侵入
 * @desc 画面スクロール固定時、画面外にいるイベントが画面内へと移動可能か選択します。
 * @type boolean
 * @on 移動可能
 * @off 移動不可
 * @default true
 *
 * @param Scroll_Fix_Type
 * @text 画面固定方法
 * @type select
 * @option 厳格に行う
 * @value 1
 * @option 緩和する
 * @value 0
 * @default 1
 * @desc ゲーム画面内にマップタイルが収まる(=画面解像度がタイル1マスのサイズ、48の倍数である)場合は[厳格に行う]を選択します。
 *
 * @param Enable_MapZoom
 * @text MapZoom併用
 * @desc DP_MapZoom.jsプラグイン併用時、「有効する」に設定してください
 * @type boolean
 * @on 有効にする
 * @off 無効にする
 * @default false
 *
*/

var Imported = Imported || {};
Imported.MKR_MapScrollFix = true;

(function () {
    'use strict';

    const PN = "MKR_MapScrollFix";

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

        switch(type) {
            case "bool":
                if(value == "") {
                    value = (def)? true : false;
                }
                value = value.toUpperCase() === "ON" || value.toUpperCase() === "TRUE" || value.toUpperCase() === "1";
                break;
            case "num":
                value = (isFinite(value))? parseInt(value, 10) : (isFinite(def))? parseInt(def, 10) : 0;
                value = value.clamp(min, max);
                break;
            default:
                throw new Error("[CheckParam] " + name + "のタイプが不正です: " + type);
                break;
        }

        return [value, type, def, min, max];
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
    let Params = {};

    Params = {
        "ScrollFixSw" : CheckParam("num", "Default_Scroll_Fix_Sw", Parameters["Default_Scroll_Fix_Sw"], 10, 0),
        "ScrollFixType" : CheckParam("num", "Scroll_Fix_Type", Parameters["Scroll_Fix_Type"], 1),
        "IsDisplayOut" : CheckParam("bool", "Is_Display_Out", Parameters["Is_Display_Out"], true),
        "IsDisplayIn" : CheckParam("bool", "Is_Display_In", Parameters["Is_Display_In"], true),
        "EnableMapZoom" : CheckParam("bool", "Enable_MapZoom", Parameters["Enable_MapZoom"], false),
    };


    //=========================================================================
    // Game_Player
    //  ・プレイヤー移動による画面のスクロールを再定義します。
    //
    //=========================================================================
    var _Game_Player_updateScroll = Game_Player.prototype.updateScroll;
    Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
        if(!$gameSwitches.value(Params.ScrollFixSw[0])) {
            _Game_Player_updateScroll.apply(this, arguments);
            return;
        }

        if(Params.ScrollFixType[0] != 1) {
            return;
        }

        if($gameMap.displayX() != Math.round($gameMap.displayX())) {
            $gameMap._displayX = Math.round($gameMap.displayX());
        }
        if($gameMap.displayY() != Math.round($gameMap.displayY())) {
            $gameMap._displayY = Math.round($gameMap.displayY());
        }
    };


    //=========================================================================
    // Game_Map
    //  ・マップスクロール処理を再定義します。
    //
    //=========================================================================
    const _Game_Map_scrollDown = Game_Map.prototype.scrollDown;
    Game_Map.prototype.scrollDown = function(distance) {
        if(Params.EnableMapZoom[0] && $gameSwitches.value(Params.ScrollFixSw[0])) {
            return;
        }
        _Game_Map_scrollDown.call(this, distance);
    };

    const _Game_Map_scrollLeft = Game_Map.prototype.scrollLeft;
    Game_Map.prototype.scrollLeft = function(distance) {
        if(Params.EnableMapZoom[0] && $gameSwitches.value(Params.ScrollFixSw[0])) {
            return;
        }
        _Game_Map_scrollLeft.call(this, distance);
    };

    const _Game_Map_scrollRight = Game_Map.prototype.scrollRight;
    Game_Map.prototype.scrollRight = function(distance) {
        if(Params.EnableMapZoom[0] && $gameSwitches.value(Params.ScrollFixSw[0])) {
            return;
        }
        _Game_Map_scrollRight.call(this, distance);
    };

    const _Game_Map_scrollUp = Game_Map.prototype.scrollUp;
    Game_Map.prototype.scrollUp = function(distance) {
        if(Params.EnableMapZoom[0] && $gameSwitches.value(Params.ScrollFixSw[0])) {
            return;
        }
        _Game_Map_scrollUp.call(this, distance);
    };


    //=========================================================================
    // Game_CharacterBase
    //  ・画面外への移動可能判定を定義します
    //
    //=========================================================================
    var _Game_CharacterBase_isMapPassable = Game_CharacterBase.prototype.isMapPassable;
    Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
        let isPass, x2, y2;
        isPass = _Game_CharacterBase_isMapPassable.apply(this, arguments);

        if(!this.isThrough() && $gameSwitches.value(Params.ScrollFixSw[0])) {
            if(isPass && !Params.IsDisplayOut[0]) {
                isPass = this.isDisplayOutPassible(x, y, d);
            }
            if(isPass && !Params.IsDisplayIn[0]) {
                isPass = this.isDisplayInPassible(x, y, d);
            }
        }
        return isPass;
    };

    Game_CharacterBase.prototype.isDisplayOutPassible = function(x, y, d) {
        let x2, y2, dx, rdx, dy, rdy, realX, realY;
        dx = $gameMap.displayX();
        rdx = dx + $gameMap.screenTileX() - 1;
        dy = $gameMap.displayY();
        rdy = dy + $gameMap.screenTileY() - 1;
        x2 = $gameMap.roundXWithDirection(x, d);
        y2 = $gameMap.roundYWithDirection(y, d);
        realX = this._realX;
        realY = this._realY;

        // switch(true) {
        //     case x == dx && x2 < dx:
        //     case x == rdx && x2 > rdx:
        //     case y == dy && y2 < dy:
        //     case y == rdy && y2 > rdy:
        //     case realX == dx && x2 < dx:
        //     case realX == rdx && x2 > rdx:
        //     case realY == dy && y2 < dy:
        //     case realY == rdy && y2 > rdy:
        //         return false;
        // }

        if(d == 8 || d == 2) {
            switch(true) {
                case y == Math.floor(dy) && y2 < dy:
                case y == Math.ceil(dy) && y2 < dy:
                case y == Math.floor(rdy) && y2 > rdy:
                case y == Math.ceil(rdy) && y2 > rdy:
                case realY == Math.floor(dy) && y2 < dy:
                case realY == Math.ceil(dy) && y2 < dy:
                case realY == Math.floor(rdy) && y2 > rdy:
                case realY == Math.ceil(rdy) && y2 > rdy:
                    return false;
            }
        } else if(d == 6 || d == 4) {
            switch(true) {
                case x == Math.floor(dx) && x2 < dx:
                case x == Math.ceil(dx) && x2 < dx:
                case x == Math.floor(rdx) && x2 > rdx:
                case x == Math.ceil(rdx) && x2 > rdx:
                case realX == Math.floor(dx) && x2 < dx:
                case realX == Math.ceil(dx) && x2 < dx:
                case realX == Math.floor(rdx) && x2 > rdx:
                case realX == Math.ceil(rdx) && x2 > rdx:
                    return false;
            }
        }

        return true;
    };

    Game_CharacterBase.prototype.isDisplayInPassible = function(x, y, d) {
        let x2, y2, dx, rdx, dy, rdy, realX, realY;
        dx = $gameMap.displayX();
        rdx = dx + $gameMap.screenTileX();
        dx--;
        dy = $gameMap.displayY();
        rdy = dy + $gameMap.screenTileY();
        dy--;
        x2 = $gameMap.roundXWithDirection(x, d);
        y2 = $gameMap.roundYWithDirection(y, d);
        realX = this._realX;
        realY = this._realY;

        // switch(true) {
        //     case x == dx && x2 > dx:
        //     case x == rdx && x2 < rdx:
        //     case y == dy && y2 > dy:
        //     case y == rdy && y2 < rdy:
        //     case realX == dx && x2 > dx:
        //     case realX == rdx && x2 < rdx:
        //     case realY == dy && y2 > dy:
        //     case realY == rdy && y2 < rdy:
        //         return false;
        // }

        if(d == 8 || d == 2) {
            switch(true) {
                case y == Math.floor(dy) && y2 > dy:
                case y == Math.ceil(dy) && y2 > dy:
                case y == Math.floor(rdy) && y2 < rdy:
                case y == Math.ceil(rdy) && y2 < rdy:
                case realY == Math.floor(dy) && y2 > dy:
                case realY == Math.ceil(dy) && y2 > dy:
                case realY == Math.floor(rdy) && y2 < rdy:
                case realY == Math.ceil(rdy) && y2 < rdy:
                    return false;
            }
        } else if(d == 6 || d == 4) {
            switch(true) {
                case x == Math.floor(dx) && x2 < dx:
                case x == Math.ceil(dx) && x2 < dx:
                case x == Math.floor(rdx) && x2 > rdx:
                case x == Math.ceil(rdx) && x2 > rdx:
                case realX == Math.floor(dx) && x2 > dx:
                case realX == Math.ceil(dx) && x2 > dx:
                case realX == Math.floor(rdx) && x2 < rdx:
                case realX == Math.ceil(rdx) && x2 < rdx:
                    return false;
            }
        }

        return true;
    };

    const _Game_CharacterBase_updateJump = Game_CharacterBase.prototype.updateJump;
    Game_CharacterBase.prototype.updateJump = function() {
        _Game_CharacterBase_updateJump.call(this);

        let maxDisplayX, maxDisplayY;
        maxDisplayX = $gameMap.displayX() + $gameMap.screenTileX() - 1;
        maxDisplayY = $gameMap.displayY() + $gameMap.screenTileY() - 1;

        if(!this.isThrough() && $gameSwitches.value(Params.ScrollFixSw[0])) {
            if(this._realX > maxDisplayX) {
                this._realX = maxDisplayX;
                this._x = maxDisplayX;
            } else if(this._realX <= $gameMap.displayX()) {
                this._realX = $gameMap.displayX();
                this._x = $gameMap.displayX();
            }
            if(this._realY >= maxDisplayY) {
                this._realY = maxDisplayY;
                this._y = maxDisplayY;
            } else if(this._realY <= $gameMap.displayY()) {
                this._realY = $gameMap.displayY();
                this._y = $gameMap.displayY();
            }
        }
    };

})();