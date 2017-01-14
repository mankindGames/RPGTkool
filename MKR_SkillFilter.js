//=============================================================================
// MKR_SkillFilter.js
//=============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/01/14 初版公開
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.0) 表示スキルフィルタープラグイン
 * @author マンカインド
 *
 * @help
 * バトル中、スキルウィンドウに表示するアクターごとのスキルを
 * 以下のように制限します。
 *   (1) アクターがその時点で覚えているスキル
 *
 *   (2) (1)の中で[必要武器]が設定されていないスキル
 *
 *   (3) (1)の中で[必要武器]が設定されており、
 *       アクターが該当する武器を装備しているスキル
 *
 * 本プラグインを導入するだけで上記制限が適用されます。
 *
 * ※ [必要武器]はツクールMVの[データベース]->[スキル]から
 *    設定できます。
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
(function () {
    'use strict';

    var Imported, PN;
    Imported = Imported || {};
    Imported.MKR_SkillFilter = true;
    PN = "MKR_SkillFilter";


    //=========================================================================
    // Window_BattleSkill
    //  ・スキルの表示制限を再定義します。
    //
    //=========================================================================
    var _Window_BattleSkill_includes = Window_BattleSkill.prototype.includes;
    Window_BattleSkill.prototype.includes = function(item) {
        var result, wtypeId1, wtypeId2;
        result = _Window_BattleSkill_includes.apply(this, arguments);
        if(item && this._actor) {
            if(this._actor.isSkillWtypeOk(item)) {
                result = true;
            } else {
                result = false;
            }
        }
        return result;
    };

})();