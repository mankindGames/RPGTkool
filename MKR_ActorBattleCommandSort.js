//=============================================================================
// MKR_ActorBattleCommandSort.js
//=============================================================================
// Copyright (c) 2016 mankind
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/10/27 初版公開
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.0) アクターバトルコマンドの並びを
 *「攻撃」「防御」「スキル」「アイテム」に変更します。
 *
 * @author mankind
 *
 * @help
 * プラグインを導入すれば自動的にコマンドが並び替えられます。
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
 * *
*/
(function () {
    'use strict';

    //=========================================================================
    // Window_ActorCommand
    //  ・コマンドの並び順を変更します。
    //
    //=========================================================================
    var _Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
    // コマンド作成処理関数
    Window_ActorCommand.prototype.makeCommandList = function() {
        // 元の処理を呼び出し
        _Window_ActorCommand_makeCommandList.call(this);
        // コマンドの再作成用関数呼び出し
        this.remakeCommand();
    };

    Window_ActorCommand.prototype.remakeCommand = function() {
        var oldList, i;
        if(this.maxItems() > 0) {
            // 現在のコマンドリストの内容を退避して、
            // 新たに並び順を変更したコマンドリストを作成
            oldList = this._list;
            this.clearCommandList();
            if (this._actor) {
                this.addAttackCommand(); // 攻撃
                this.addGuardCommand(); // 防御
                this.addSkillCommands(); // スキル
                this.addItemCommand(); // アイテム
            }
            // もし古いコマンドリストに新しいコマンドが追加されていたら、
            // 作り直したコマンドリストにも追加する。
            // (追加コマンドが古いコマンドリストの末尾ではなく、
            //  途中にある場合については考慮していない)
            if(this.maxItems() < oldList.length) {
                for(i = this.maxItems(); i < oldList.length; i++) {
                    this._list.push(oldList[i]);
                }
            }
        }
    }

})();