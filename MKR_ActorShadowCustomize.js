//===============================================================================
// MKR_ActorShadowCustomize.js
//===============================================================================
// (c) 2016 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.0 2019/07/06 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.0) アクターシャドウカスタマイズ
 * @author マンカインド
 *
 * @help = アクターシャドウカスタマイズ =
 * MKR_ActorShadowCustomize.js
 *
 * サイドビュー戦闘時、アクターの下に表示されている影の位置、拡大率を
 * アクター毎に変更することができます。
 *
 * [データベース]→[アクター]のメモ欄に以下のように設定します。
 * (****は適切な数値を入れてください)
 *
 * <shadowOffsetX:****>
 *   アクターの影を指定した数値分、左右にズラします。(元の値は0です)
 *   プラスの値で右方向、マイナスの値で左方向にズレます。
 *
 * <shadowOffsetY:****>
 *   アクターの影を指定した数値分、上下にズラします。(元の値は-2です)
 *   プラスの値で下方向、マイナスの値で上方向にズレます。
 *
 * <shadowScaleX:****>
 *   アクターの影を指定した数値分、左右方向に拡大/縮小します。(元の値は1.0です)
 *   2.0で影の大きさが2倍、0.5で影の大きさが半分になります。
 *   0.0以下にはできません。
 *
 * <shadowScaleX:****>
 *   アクターの影を指定した数値分、上下方向に拡大/縮小します。(元の値は1.0です)
 *   2.0で影の大きさが2倍、0.5で影の大きさが半分になります。
 *   0.0以下にはできません。
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
 * ==============================================================================
 *
*/

var Imported = Imported || {};
Imported.MKR_ActorShadowCustomize = true;

(function () {
    'use strict';

    const PN = "MKR_ActorShadowCustomize";


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
    // Sprite_Actor
    //  ・アクターシャドウを再定義します。
    //
    //=========================================================================
    const _Sprite_Actor_setBattler = Sprite_Actor.prototype.setBattler;
    Sprite_Actor.prototype.setBattler = function(battler) {
        let actor = this._actor;

        _Sprite_Actor_setBattler.call(this, battler);

        if (battler !== actor) {
            this.positionShadowSprite();
            this.resizeShadowSprite();
        }
    };

    Sprite_Actor.prototype.positionShadowSprite = function() {
        if(!this._actor || !this._shadowSprite) {
            return;
        }

        let offsetX, offsetY;
        offsetX = GetMeta(this._actor.actor().meta,"shadowOffsetX");
        offsetY = GetMeta(this._actor.actor().meta,"shadowOffsetY");

        if(offsetX && isFinite(offsetX)) {
            this._shadowSprite.x += offsetX * 1;
        }
        if(offsetY && isFinite(offsetY)) {
            this._shadowSprite.y += offsetY * 1;
        }
    };

    Sprite_Actor.prototype.resizeShadowSprite = function() {
        if(!this._actor || !this._shadowSprite) {
            return;
        }

        let scaleX, scaleY;
        scaleX = GetMeta(this._actor.actor().meta,"shadowScaleX");
        scaleY = GetMeta(this._actor.actor().meta,"shadowScaleY");

        this._shadowSprite.bitmap.smooth = true;
        if(scaleX && isFinite(scaleX) && scaleX > 0) {
            this._shadowSprite.scale.x = scaleX * 1.0;
        }
        if(scaleY && isFinite(scaleY) && scaleY > 0) {
            this._shadowSprite.scale.y = scaleY * 1.0;
        }
    };
})();