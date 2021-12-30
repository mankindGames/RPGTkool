//===============================================================================
// MKR_ReciveCriticalState.js
//===============================================================================
// (c) 2021 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.0 2021/12/30 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.0) 被クリティカルステート
 * @author マンカインド
 *
 * @help = 被クリティカルステート =
 * MKR_ReciveCriticalState.js
 *
 *
 * このプラグインで指定したステートを付与された敵・味方に対する攻撃を
 * 会心の一撃(クリティカル)にします。
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
 *   ・要望などがある場合プラグインのバージョンアップを行う可能性がありますが
 *     バージョンアップによりプラグインの仕様が変更される場合があります。
 *     ご了承ください。
 *
 * ==============================================================================
 *
 * @param stateList
 * @text ステート
 * @desc 被クリティカル状態となるステートを指定します。
 * @type state[]
 *
*/


(() => {
    "use strict";

    //=========================================================================
    // Function
    //  ・ローカル関数
    //
    //=========================================================================
    /**
     * プラグインパラメータのパース：数字配列
     *
     * @param {String} json JSON文字列
     * @returns {Number[]} 数字配列
     */
    function parseNumberList(json) {
        return JSON.parse(json || "[]").map(v => parseInt(v.trim(), 10));
    }


    //=========================================================================
    // Parameter
    //  ・プラグインパラメータの取得と加工
    //
    //=========================================================================
    const pluginName = document.currentScript.src.split("/").pop().replace(/\.js$/, "");
    const pluginParameter = PluginManager.parameters(pluginName);

    const settings = {
        stateList: parseNumberList(pluginParameter["stateList"]),
    };


    //=========================================================================
    // Game_Action
    //  ・クリティカル判定処理を変更します。
    //
    //=========================================================================
    const _Game_Action＿temCri = Game_Action.prototype.itemCri;
    Game_Action.prototype.itemCri = function(target) {
        const isCri = _Game_Action＿temCri.call(this, target);

        if(settings.stateList.length <= 0 || !settings.stateList.some(stateId => target.isStateAffected(stateId))) {
            return isCri;
        }

        return 1;
    };


})();