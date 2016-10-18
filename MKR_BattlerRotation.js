//=============================================================================
// MKR_BattlerRotation.js
//=============================================================================
// Copyright (c) 2016 mankind
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 0.0.1 2016/10/18 試作01号
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v0.0.1) 戦闘中にアクターの傾きを変更できるようにします。
 * @author mankind
 *
 * @help
 * 戦闘中にプラグインコマンドを使用することでアクターグラフィックの傾きを
 * 調整することができます。(グラフィックの原点は左下固定となります。)
 * 設定した傾きは次回のバトルに引き継がれません。
 *
 * 簡単な使い方説明:
 *   戦闘中にプラグインコマンドを実行してください。
 *
 * プラグインコマンド:
 *   BR_Actor X Y
 *     ・アクターを傾けます。Xには戦闘参加パーティの並び順番号(1～)、
 *       Yには傾ける角度を指定してください(0～360)。
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
 * *
*/
(function () {
    'use strict';

    //=========================================================================
    // Game_Interpreter
    //  ・バトラーの傾き変更コマンドを定義します。
    //=========================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === "br_actor") {
            $gameParty.rotation(args[0], args[1]);
        }
    };


    //=========================================================================
    // Game_Unit
    //  ・アクターの傾き変更処理を定義します。
    //=========================================================================
    Game_Unit.prototype.rotation = function(index, rotation) {
        index--;
        if(index >= 0 && index < this.members().length){
            this.members()[index].setRotation(rotation);
        }
    };


    //=========================================================================
    // Game_Battler
    //  ・バトラーの傾き変更処理を定義します。
    //=========================================================================
    Game_Battler.prototype.setRotation = function(rotation, frame) {
        var sprite = this.getBattlerSprite();
        if(sprite) {
            sprite.setRotation(rotation);
        }
    };

    Game_Battler.prototype.getBattlerSprite = function() {
        var id = "";
        if (this.isActor()) {
            id = "A" + this.actorId();
        }
        if (this.isEnemy()) {
            id = "E" + this.index();
        }
        return $gameTemp.getBattlerSprite(id);
    };


    //=========================================================================
    // Sprite_Actor
    //  ・バトラーの傾きを定義します。
    //=========================================================================
    Sprite_Actor.prototype.setRotation = function(rotation) {
        this._mainSprite.origin = new Point(32, 32);
        this._mainSprite.rotation = rotation * Math.PI / 180;
    };


    //=========================================================================
    // Spriteset_Battle
    //  ・バトラースプライトを呼び出し可能にする処理を定義します。
    //=========================================================================
    var _Spriteset_Battle_updateActors = Spriteset_Battle.prototype.updateActors;
    Spriteset_Battle.prototype.updateActors = function() {
        _Spriteset_Battle_updateActors.call(this);
        var members = $gameParty.battleMembers();
        for (var i = 0; i < members.length; i++) {
            $gameTemp.setBattlerSprite(members[i], this._actorSprites[i]);
        }
    };


    //=========================================================================
    // Game_Temp
    //  ・バトラースプライトを一時的に記憶する処理を定義します。
    //=========================================================================
    var _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._battlerSprites = {};
    };

    Game_Temp.prototype.setBattlerSprite = function(battler, battlerSprite) {
        var id = "";

        if(battler.isActor()) {
            id = "A" + battler.actorId();
            this._battlerSprites[id] = battlerSprite;
        }
        if(battler.isEnemy()) {
            id = "E" + battler.index();
            this._battlerSprites[id] = battlerSprite;
        }
    };

    Game_Temp.prototype.getBattlerSprite = function(id) {
        return this._battlerSprites[id];
    };

    Game_Temp.prototype.clearBattlerSprite = function() {
        this._battlerSprites = {};
    };


    //=========================================================================
    // BattleManager
    //  ・バトラースプライト記録用変数を初期化します。
    //=========================================================================
    var _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        _BattleManager_setup.call(this, result);
        $gameTemp.clearBattlerSprite();
    };

})();