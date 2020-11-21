//===============================================================================
// MKR_GetXparamCustomize.js
//===============================================================================
// (c) 2016 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.0 2020/11/21 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.0) 追加能力値取得方法変更プラグイン
 * @author マンカインド
 *
 * @help = 追加能力値取得方法変更プラグイン =
 * MKR_GetXparamCustomize.js
 *
 * 追加能力値の取得方法を下記の通り変更します。
 *
 *   [変更前]
 *   アクター/クラスの特徴、装備等による合計値を追加能力値として取得。
 *
 *   [変更後]
 *   アクター/クラスの特徴、装備等の中から一番大きい値を追加能力値として取得。
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
 * @param xparamIds
 * @text 対象の追加能力値
 * @type select[]
 * @desc 取得方法を合計値から最大値に変更する追加能力値を選択します。
 * @option 命中率
 * @value 0
 * @option 回避率
 * @value 1
 * @option 会心率
 * @value 2
 * @option 会心回避率
 * @value 3
 * @option 魔法回避率
 * @value 4
 * @option 魔法反射率
 * @value 5
 * @option 反撃率
 * @value 6
 * @option HP再生率
 * @value 7
 * @option MP再生率
 * @value 8
 * @option TP再生率
 * @value 9
 *
*/

(() => {
    'use strict';

    const PLUGIN_NAME = document.currentScript.src.split("/").pop().replace(/\.js$/, "");
    const PARAMS = PluginManager.parameters(PLUGIN_NAME);

    const xparamIds = JSON.parse(PARAMS["xparamIds"]).map(value => Number.parseInt(value, 10));


    //=========================================================================
    // Game_BattlerBase
    //  ・追加能力値の取得方法を再定義します。
    //
    //=========================================================================
    const _Game_BattlerBase_xparam = Game_BattlerBase.prototype.xparam;
    Game_BattlerBase.prototype.xparam = function(xparamId) {
        if(xparamIds.contains(xparamId)) {
            return this.traitsMax(Game_BattlerBase.TRAIT_XPARAM, xparamId);
        }
        return _Game_BattlerBase_xparam.apply(this, arguments);
    };

    Game_BattlerBase.prototype.traitsMax = function(code, id) {
        return this.traitsWithId(code, id).reduce((r, trait) => Math.max(r, trait.value), 0);
    };

})();