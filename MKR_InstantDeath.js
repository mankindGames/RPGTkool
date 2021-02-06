//=============================================================================
// MKR_InstantDeath.js
//=============================================================================
// Copyright (c) 2016 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.0 2021/02/06 ・RPGツクールMZに対応
//                  ・即死ステートを複数作成できるよう機能改善
//                  ・プラグインパラメータの形式を変更
//                  ・コードをリファクタリング
//
// 1.1.2 2017/12/10 プラグインパラメータの指定方法を変更
//
// 1.1.1 2016/08/15 行動状況により即死ステート付与後の動作がおかしい問題を解決
//
// 1.1.0 2016/08/06 YEP_BattleEngineCoreとの競合改善
//
// 1.0.0 2016/08/04 初版公開
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 * @target MZ MV
 *
 * @plugindesc (v2.0.0) 即死ステートを実装します。
 * @author マンカインド
 *
 * @url https://github.com/mankindGames/RPGTkoolMZ
 *
 * @help
 * 即死ステートを定義し、
 * バトル中にそのステートが付与されたバトラーを即死させます。
 *
 * (v1.1.2以前のプラグインパラメータと互換性がありません。
 *  v1.1.2以前からプラグインを更新された場合は再設定をお願いします)
 *
 * 簡単な使い方説明:
 *   まずは即死扱いとするステートをツクール側で作成してください。
 *   設定:
 *     ・[SV]モーション を 戦闘不能 に設定してください。
 *     ・メッセージ [アクターがこの状態になったとき]
 *                  [敵キャラがこの状態になったとき] を
 *       それぞれ設定してください。
 *
 *   作成したステートのIDを、
 *   プラグインパラメーター[即死ステートID]に設定します。
 *   (リスト部分をダブルクリックするとステート選択ウィンドウが表示されます。
 *    リストなので即死ステートは複数指定できます)
 *
 *   即死スキルを作るには、スキルの使用効果:ステート付与に
 *   即死ステート:100%を指定し、スキル発動の成功率を調整します。
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
 *
 * @param stateIdList
 * @text ステートリスト
 * @desc 即死ステートとして扱うステートを指定します。
 * @type state[]
 *
*/
(() => {
    'use strict';

    const isYepBattleCoreMV = !!BattleManager.isBattleSystem && Utils.RPGMAKER_NAME === "MV";

    //=========================================================================
    // Parameter
    //  ・プラグインパラメータの取得と加工
    //
    //=========================================================================
    const numberListParse = s => {
        if(!s) {
            return [];
        }
        return JSON.parse(s).map(number => Number.parseInt(number, 10));
    }

    const PLUGIN_NAME = document.currentScript.src.split("/").pop().replace(/\.js$/, "");
    const PLUGIN_PARAMETER = PluginManager.parameters(PLUGIN_NAME);

    const PARAMS = {
        stateIdList: numberListParse(PLUGIN_PARAMETER["stateIdList"])
    };


    //=========================================================================
    // Game_BattlerBase
    //  即死ステートを定義します。
    //
    //=========================================================================
    const _Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
    Game_BattlerBase.prototype.addNewState = function(stateId) {
        if(PARAMS.stateIdList.contains(stateId)) {
            this.die();
        }

        _Game_BattlerBase_addNewState.call(this, stateId);
    };


    //=========================================================================
    // Sprite_Actor
    //  即死ステート付与時のアクターモーションを再定義します。
    //
    //=========================================================================
    const _Sprite_Actor_refreshMotion = Sprite_Actor.prototype.refreshMotion;
    Sprite_Actor.prototype.refreshMotion = function() {
        const actor = this._actor;

        if(actor && actor.isDead()) {
            this._motion = null;
        }

        _Sprite_Actor_refreshMotion.call(this);
    };


    //=========================================================================
    // Window_BattleLog
    //  即死ステート付与時のステート表示処理を再定義します。
    //
    //=========================================================================
    const _Window_BattleLog_displayAddedStates = Window_BattleLog.prototype.displayAddedStates;
    Window_BattleLog.prototype.displayAddedStates = function(target) {
        const isInstantDeath = PARAMS.stateIdList.some(
            stateId => target.result().isStateAdded(stateId)
        );

        // MV版YEP_BattleEngineCoreを導入している、
        // または即死ステートが付与されていない場合は
        // 元の処理を呼び出す。
        if(isYepBattleCoreMV || !isInstantDeath) {
            _Window_BattleLog_displayAddedStates.call(this, target);
            return;
        }

        target.result().addedStateObjects().some((state, index) => {
            if(state.id === target.deathStateId()) {
                target.result().addedStates.splice(index, 1);
                return true;
            }
        });

        _Window_BattleLog_displayAddedStates.call(this, target);
        this.push('performCollapse', target);
    };

})();