//=============================================================================
// MKR_BattlerRotation.js
//=============================================================================
// Copyright (c) 2016 mankind
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/10/23 ・プラグインコマンドに変数(制御文字参照)を使用可能に。
//                  ・プラグインコマンド[BR_Battler],[BR_Enemy]を追加。
//                  ・バトラーの回転軸を画像中心に設定できるように。
//
// 0.0.1 2016/10/18 試作01号
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.0) 戦闘中にバトラーの傾きを変更できるようにします。
 * @author mankind
 *
 * @help
 * 戦闘中にプラグインコマンドを使用することでバトラーグラフィックの傾きを
 * 調整することができます。
 * 設定した傾きは次回のバトルに引き継がれません。
 *
 *
 * 簡単な使い方説明:
 *   戦闘中にプラグインコマンドを実行してください。
 *
 *
 * プラグインコマンド:
 *   BR_Actor X Y Z
 *     ・アクターを傾けます。Xには戦闘参加パーティ内の並び順番号(1～)、
 *       または all を指定してください。(全アクターの角度が変わります。)
 *     ・Yには傾ける角度を指定してください(0～360)。
 *     ・Zにはアクターを回転させるときの軸位置を番号で指定してください。
 *       0で画像の中央下(デフォルト)、1で画像の中央を軸位置とします。
 *     ・XとYには変数を表す制御文字の\V[n]が使用可能です。
 *
 *   BR_Enemy X Y Z
 *     ・エネミーを傾けます。Xには戦闘参加エネミー内の並び順番号(1～)、
 *       または all を指定してください。(全エネミーの角度が変わります。)
 *     ・Yには傾ける角度を指定してください(0～360)。
 *     ・Zにはエネミーを回転させるときの軸位置を番号で指定してください。
 *       0で画像の中央下(デフォルト)、1で画像の中央を軸位置とします。
 *     ・XとYには変数を表す制御文字の\V[n]が使用可能です。
 *
 *   BR_Battler X Y Z
 *     ・バトラーを傾けます。Xには0か-1の数字が入ります。
 *       Xが0で攻撃側のバトラー、Xが-1で攻撃対象のバトラーを傾けます。
 *     ・Yには傾ける角度を指定してください(0～360)。
 *     ・Zにはバトラーを回転させるときの軸位置を番号で指定してください。
 *       0で画像の中央下(デフォルト)、1で画像の中央を軸位置とします。
 *       Yには変数を表す制御文字の\V[n]が使用可能です。
 *
 *   ※ Yanfly氏のプラグイン
 *      「YEP_BattleEngineCore.js」を導入しているときに
 *      バトラーの回転軸を画像の中央に設定したい場合、
 *
 *      予め「YEP_BattleEngineCore.js」の
 *      プラグインパラメーター[Default Y Anchor]を
 *      0.5 に設定する必要があります。(デフォルト値は1.0)
 *
 *
 * スクリプトコマンド:
 *   ありません。
 *
 *
 * 補足：
 *   ・このプラグインに関するメモ欄の設定、プラグインコマンド、
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

var Imported = Imported || {};
Imported.MKR_BattlerRotation = true;

(function () {
    'use strict';

    var ConvVb = function(text) {
        var num;

        if(typeof text == "string") {
            text = text.replace(/\\/g, '\x1b');
            text = text.replace(/\x1b\x1b/g, '\\');
            text = text.replace(/\x1bV\[(\d+)\]/i, function() {
                num = parseInt(arguments[1]);
                return $gameVariables.value(num);
            }.bind(this));
            text = text.replace(/\x1bV\[(\d+)\]/i, function() {
                num = parseInt(arguments[1]);
                return $gameVariables.value(num);
            }.bind(this));
        }

        return text;
    }


    //=========================================================================
    // Game_Interpreter
    //  ・バトラーの傾き変更コマンドを定義します。
    //=========================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        var rotation, anchor, target, i;

        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === "br_actor") {
            $gameParty.rotation(args);
        } else if (command.toLowerCase() === "br_enemy") {
            $gameTroop.rotation(args);
        } else if (command.toLowerCase() === "br_battler") {
            rotation = ConvVb(args[1]);
            anchor = ConvVb(args[2]);
            if(args[0] == 0) {
                BattleManager._subject.setRotation(rotation, anchor);
            } else if(args[0] == -1) {
                for(i = 0; i < BattleManager._targets.length; i++) {
                    target = BattleManager._targets[i];
                    if(target instanceof Game_Actor) {
                        target.setRotation(rotation, anchor);
                    } else if(target instanceof Game_Enemy) {
                        target.setRotation(rotation, anchor);
                    }
                }
            }
        }
    };


    //=========================================================================
    // Game_Unit
    //  ・バトラーの傾き変更処理を定義します。
    //=========================================================================
    Game_Unit.prototype.rotation = function() {
        var index, rotation, anchor, i;

        index = ConvVb(arguments[0][0]);
        rotation = ConvVb(arguments[0][1]);
        anchor = arguments[0][2] == 1 ? 1 : 0;

        if(index == "all"){
            for(i = 0; i < this.members().length; i++) {
                this.members()[i].setRotation(rotation, anchor);
            }
        }

        index--;
        if(index >= 0 && index < this.members().length){
            this.members()[index].setRotation(rotation, anchor);
        }
    };


    //=========================================================================
    // Game_Battler
    //  ・バトラーの傾き変更処理を定義します。
    //=========================================================================
    Game_Battler.prototype.setRotation = function(rotation, anchor) {
        var sprite = this.getBattlerSprite();
        if(sprite) {
            sprite.setRotation(rotation, anchor);
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
    //  ・アクターの傾きを定義します。
    //=========================================================================
    Sprite_Actor.prototype.setRotation = function(rotation, anchor) {
        if(anchor == 1) {
            if(!Imported.YEP_X_ActSeqPack2) {
                this._mainSprite.anchor.y = 0.5;
                this._weaponSprite.anchor.y = 0.5;
                this._mainSprite.y = -(this._mainSprite.bitmap.height / 12);
                this._weaponSprite.y = -(this._mainSprite.bitmap.height / 12);
            }
        } else {
            this._mainSprite.anchor.y = 1.0;
            this._weaponSprite.anchor.y = 1.0;
            this._mainSprite.y = 0;
            this._weaponSprite.y = -2;
        }

        this._mainSprite.rotation = rotation * Math.PI / 180;
        this._weaponSprite.rotation = rotation * Math.PI / 180;
    };

    if(Imported.YEP_X_ActSeqPack2 && Yanfly.Param.BECAnchorY == 0.5) {
        var _Sprite_Actor_updateBitmap = Sprite_Actor.prototype.updateBitmap;
        Sprite_Actor.prototype.updateBitmap = function() {
            _Sprite_Actor_updateBitmap.call(this);

            if(this._mainSprite.bitmap) {
                this._mainSprite.y = -(this._mainSprite.bitmap.height / 12);
                this._weaponSprite.y = -(this._mainSprite.bitmap.height / 12);
            }
        };
    }


    //=========================================================================
    // Sprite_Enemy
    //  ・エネミーの傾き、位置を定義します。
    //=========================================================================
    Sprite_Enemy.prototype.setRotation = function(rotation, anchor) {
        if(anchor == 1) {
            if(!Imported.YEP_X_ActSeqPack2) {
                this.anchor.y = 0.5;
                this._offsetY = -(this.bitmap.height / 2);
            }
        } else {
            this.anchor.y = 1.0;
            this._offsetY = 0;
        }

        this.rotation = rotation * Math.PI / 180;
    };

    if(Imported.YEP_X_ActSeqPack2 && Yanfly.Param.BECAnchorY == 0.5) {
        var _Sprite_Enemy_updateBitmap = Sprite_Enemy.prototype.updateBitmap;
        Sprite_Enemy.prototype.updateBitmap = function() {
            if(this.bitmap) {
                this._homeY = this._enemy.screenY() - this.bitmap.height / 2;
            }

            _Sprite_Enemy_updateBitmap.call(this);
        };
    }


    //=========================================================================
    // Window_EnemyVisualSelect
    //  ・YEP_BattleEngineCore.js内メソッドを再定義します。
    //    エネミーネーム表示位置を再設定します。
    //=========================================================================
    if(Imported.YEP_BattleEngineCore && Yanfly.Param.BECAnchorY == 0.5) {
        var _Window_EnemyVisualSelect_updateWindowPosition = Window_EnemyVisualSelect.prototype.updateWindowPosition;
        Window_EnemyVisualSelect.prototype.updateWindowPosition = function() {
            var spriteHeight;

            _Window_EnemyVisualSelect_updateWindowPosition.call(this);

            if (!this._battler) return;
            spriteHeight = this._battler.spriteHeight();
            this.y += spriteHeight / 2;
        };
    }


    //=========================================================================
    // Spriteset_Battle
    //  ・Game_BattlerとSprite_Battlerを関連付けする処理を定義します。
    //=========================================================================
    var _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
        var party, troop, i;
        party = $gameParty.battleMembers();
        troop = $gameTroop.members();

        _Spriteset_Battle_update.call(this);

        for (i = 0; i < party.length; i++) {
            $gameTemp.setBattlerSprite(party[i], this._actorSprites[i]);
        }
        for (i = 0; i < troop.length; i++) {
            $gameTemp.setBattlerSprite(troop[i], this._enemySprites[i]);
        }
    };


    //=========================================================================
    // Game_Temp
    //  ・Sprite_Battlerに関する処理を定義します。
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
    //  ・Sprite_Battlerに関する処理を定義します。
    //=========================================================================
    var _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        _BattleManager_endBattle.call(this, result);
        $gameTemp.clearBattlerSprite();
    };

})();