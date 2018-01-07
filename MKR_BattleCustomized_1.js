//===============================================================================
// MKR_BattleCustomized_1.js
//===============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.3 2018/01/07 一部プラグインとの競合を修正。
//
// 1.0.2 2018/01/05 一部プラグインとの競合を修正。
//
// 1.0.1 2018/01/05 アクター選択中以外の行動時にも前進しなくなっていたため修正。
//
// 1.0.0 2018/01/05 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.3) バトルシーンカスタマイズプラグインその1
 * @author マンカインド
 *
 * @help このプラグインを導入することでバトルシーンに以下の変更を行います。
 *
 *   ・アクターが行動選択状態のとき、そのアクターが前進しなくなる。
 *
 *
 * その1 と名付けていますがこのプラグイン単体で動作します。
 *
 *
 * プラグインパラメータ:
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
 * ==============================================================================
*/

var Imported = Imported || {};
Imported.MKR_BattleCustomized_1 = true;

(function () {
    'use strict';

    // const PN = "MKR_BattleCustomized_1";

    //=========================================================================
    // Sprite_Actor
    //  ・アクター前進処理を再定義します。
    //
    //=========================================================================
    const _Sprite_Actor_updateTargetPosition = Sprite_Actor.prototype.updateTargetPosition;
    Sprite_Actor.prototype.updateTargetPosition = function() {
        _Sprite_Actor_updateTargetPosition.call(this);
        if (this._actor.isInputting()) {
            this.stepBack();
        } else if(this._actor.isActing()) {
            this.stepForward();
        } else if (this._actor.canMove() && BattleManager.isEscaped()) {
            this.retreat();
        } else if (!this.inHomePosition()) {
            this.stepBack();
        }
    };


    //=========================================================================
    // BattleManager
    //  ・YEP_BattleEngineCore.js併用時にアクターが前進してしまうため再定義
    //
    //=========================================================================
    const _BattleManager_changeActor = BattleManager.changeActor;
    BattleManager.changeActor = function(newActorIndex, lastActorActionState) {
        _BattleManager_changeActor.apply(this, arguments);

        if(Imported.YEP_BattleEngineCore) {
            this._actorIndex = newActorIndex;
            let newActor = this.actor();
            if (newActor) {
                newActor.spriteReturnHome();
            }
        }
    };


    //=========================================================================
    // Scene_Battle
    //  ・YEP_X_BattleSysATB.js / YEP_X_BattleSysCTB.js併用時に
    //    アクターが前進してしまうため再定義
    //
    //=========================================================================
    const _Scene_Battle_startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
    Scene_Battle.prototype.startActorCommandSelection = function() {
        _Scene_Battle_startActorCommandSelection.call(this);
        if(Imported.YEP_X_BattleSysATB) {
            if (BattleManager.isATB()) {
                BattleManager.actor().spriteReturnHome();
            }
        }
        if(Imported.YEP_X_BattleSysCTB) {
            if (BattleManager.isCTB()) {
                BattleManager.actor().spriteReturnHome();
            }
        }
    };


})();