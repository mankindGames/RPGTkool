//===============================================================================
// MKR_BattleCustomized_1.js
//===============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.0 2017/01/05 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.0) バトルシーンカスタマイズプラグインその1
 * @author マンカインド
 *
 * @help このプラグインを導入することでバトルシーンに以下の変更を行います。
 *
 *   ・アクターが行動選択状態のとき、アクターの前進距離をピクセル単位で調整可能。
 *
 *
 * その1 と名付けていますがこのプラグイン単体で動作します。
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
 * @param actor_step
 * @text アクター移動距離
 * @desc アクター行動選択状態の移動距離をピクセル単位で指定します。(デフォルト:48)
 * @type number
 * @min 0
 * @max 9999
 * @default 48
 *
*/

var Imported = Imported || {};
Imported.MKR_BattleCustomized_1 = true;

(function () {
    'use strict';

    const PN = "MKR_BattleCustomized_1";

    const CheckParam = function(type, param, def, min, max) {
        let Parameters, regExp, value;
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

        regExp = /(\x1bV|\x1bN)\[\d+\]/i;
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

        return value;
    };

    const Params = {
        "ActorStep" : CheckParam("num", "actor_step", 48, 0, 9999),
    };


    //=========================================================================
    // Sprite_Actor
    //  ・アクター前進処理を再定義します。
    //
    //=========================================================================
    const _Sprite_Actor_stepForward = Sprite_Actor.prototype.stepForward;
    Sprite_Actor.prototype.stepForward = function() {
        _Sprite_Actor_stepForward.call(this);
        this.startMove(-Params.ActorStep, 0, 12);
    };


})();