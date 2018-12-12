//===============================================================================
// MKR_AnimationFlashSwitch.js
//===============================================================================
// Copyright (c) 2016 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.0 2018/12/12 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.0) アニメーションフラッシュ切替プラグイン
 * @author マンカインド
 *
 * @help = アニメーションフラッシュ切替プラグイン ver 1.0.0 =
 * MKR_AnimationFlashSwitch.js
 *
 * 指定したスイッチがONの間、戦闘アニメ(データベースのアニメーション)で
 * 設定されているフラッシュ効果を無効化します。
 *
 * フラッシュ―特に対象へのフラッシュは、スマートフォンなどのモバイル端末において
 * プレイ中の負荷が高くなる要因となっていますが、
 * 大量に作ったアニメーションからフラッシュ効果を削除するのは大変だ…
 * というときに効果を発揮するプラグインです。
 *
 *
 * ゲーム中のオプションとしてフラッシュ効果のON/OFFを表示させ
 * ユーザのプレイ環境によりフラッシュ効果の有り/無しを選択させたい場合は、
 * トリアコンタン氏の「オプション任意項目プラグイン」を使用すると
 * 簡単にオプション項目を追加することができます。
 *
 *   https://triacontane.blogspot.com/2016/01/blog-post.html
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
 * @text プラグイン有効化スイッチ
 * @desc 指定したスイッチがONのとき、アニメーションのフラッシュが無効化されます。
 * @type switch
 * @default 0
 *
 * @param flash type
 * @text 無効化するフラッシュ
 * @desc 1:対象へのフラッシュ 2:画面全体のフラッシュ 0:両方 いずれかを入力します。
 * @type number
 * @min 0
 * @max 2
 * @default 0
 *
*/

var Imported = Imported || {};
Imported.MKR_AnimationFlashSwitch = true;

(function () {
    'use strict';

    const PN = "MKR_AnimationFlashSwitch";

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
    let Params;

    Params = {
        "EnableSwitch" : CheckParam("switch", "プラグイン有効化スイッチ", Parameters["enable switch"], 0),
        "FlashType" : CheckParam("num", "無効化するフラッシュ", Parameters["flash type"], 0, 0, 2),
    };


    //=========================================================================
    // Sprite_Animation
    //  ・アニメーションのフラッシュ処理を再定義します。
    //
    //=========================================================================
    const _Sprite_Animation_processTimingData = Sprite_Animation.prototype.processTimingData;
    Sprite_Animation.prototype.processTimingData = function(timing) {
        let enable, duration;
        enable = !!$gameSwitches.value(Params.EnableSwitch);

        if(!enable) {
            _Sprite_Animation_processTimingData.call(this, timing);
            return ;
        }

        duration = timing.flashDuration * this._rate;
        switch (timing.flashScope) {
        case 1:
            if(Params.FlashType == 2) {
                this.startFlash(timing.flashColor, duration);
            }
            break;
        case 2:
            if(Params.FlashType == 1) {
                this.startScreenFlash(timing.flashColor, duration);
            }
            break;
        case 3:
            this.startHiding(duration);
            break;
        }
        if (!this._duplicated && timing.se) {
            AudioManager.playSe(timing.se);
        }
    };


})();