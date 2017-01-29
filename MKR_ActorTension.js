//=============================================================================
// MKR_ActorTension.js
//=============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/01/29 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.0) アクターテンションプラグイン
 *
 * @author マンカインド
 *
 * @help アクターにテンション(気分、気持ち)要素を実装し、
 * テンションが特定値を下回ることによって指定したステートの付与を行います。
 * また、特定ステートが付与されるとテンションによる影響を無効化できます。
 *
 * テンションはプラグイン/スクリプトコマンドにより
 * アクター毎に増減させることが可能の他、以下の条件で増減されます。
 *
 * テンションの増減条件(条件の有効/無効、増減量を設定可能)：
 *   ・戦闘に勝利すると増加
 *   ・戦闘中、PTメンバーが戦闘不能になると減少
 *   ・戦闘から逃亡すると減少
 *
 *
 * アクターメモ欄_基本設定:
 *   <Tension:X>
 *     ・アクターの初期テンションの値を指定します。(Xは整数)
 *
 *
 * アクターメモ欄_オプション(各オプションはスペースで区切る):
 *   low[数値]
 *     ・アクターにステートを付与するテンション値(指定値以下)を
 *       アクター毎に指定します。
 *
 *   lowsId[ステートID]
 *     ・テンション値が規定値以下となった場合に付与するステートIDを
 *       アクター毎に指定します。
 *
 *   vNo[数値]
 *     ・アクターのテンション値と同期させる変数の番号を
 *       アクター毎に指定します。
 *
 *   ※ 初期設定値よりオプション設定が優先されますのでご注意ください。
 *
 *
 * アクターメモ欄の設定例:
 *   <Tension:80>
 *     ・アクターの初期テンション値を80にします。
 *
 *   <Tension:50 lowsId15>
 *     ・アクターの初期テンション値を50にして、
 *       テンション値が規定値以下になった場合に
 *       ステートID:15のステートを付与します。
 *
 *   <Tension:100 low10>
 *     ・アクターの初期テンション値を100にして、
 *       アクターにステートを付与するテンション値(指定値以下)を10に設定します。
 *
 *   <Tension:50 vNo20>
 *     ・アクターの初期テンション値を50に設定します。
 *       また、変数20番にアクターのテンション値が代入されるようになります。
 *
 *
 * プラグインコマンド:
 *   Tension add "ActorId" "value"
 *     ・指定したアクターIDのテンション値をvalue分だけ増減します。
 *       また、アクターIDの他に"all", "Ball"を指定することも可能です。
 *         all : パーティメンバー全員に対するテンション値の増減
 *        ball : 戦闘参加メンバーに対するテンション値の増減
 *
 *     ・valueにはマイナスの値を指定することも可能で、指定した場合
 *       テンション値がマイナスされます。
 *
 *   Tension set "ActorId" "value"
 *     ・指定したアクターIDのテンション値をvalueと同じにします。
 *       また、アクターIDの他に"all", "Ball"を指定することも可能です。
 *         all : パーティメンバー全員に対するテンション値の指定
 *        ball : 戦闘参加メンバーに対するテンション値の指定
 *
 *
 * プラグインコマンド使用例:
 *   Tension add 3 15
 *     ・アクター(ID:3)のテンションを15増やします。
 *
 *   Tension add ball -10
 *     ・戦闘参加メンバーのテンションを10減らします。
 *
 *   Tension set all 80
 *     ・パーティメンバーのテンションを80にセットします。
 *
 *
 * スクリプトコマンド:
 *   $gameSystem.addTension("actorId", "value");
 *     ・指定したアクターIDのテンション値をvalue分だけ増減します。
 *       また、アクターIDの他に"all", "Ball"を指定することも可能です。
 *         all : パーティメンバー全員に対するテンション値の増減
 *        ball : 戦闘参加メンバーに対するテンション値の増減
 *
 *     ・valueにはマイナスの値を指定することも可能で、指定した場合
 *       テンション値がマイナスされます。
 *
 *   $gameSystem.setTension("actorId", "value");
 *     ・指定したアクターIDのテンション値をvalueと同じにします。
 *       また、アクターIDの他に"all", "Ball"を指定することも可能です。
 *         all : パーティメンバー全員に対するテンション値の指定
 *        ball : 戦闘参加メンバーに対するテンション値の指定
 *
 *
 * スクリプトコマンド使用例:
 *   $gameSystem.addTension(3, 15);
 *     ・アクター(ID:3)のテンションを15増やします。
 *
 *   $gameSystem.addTension("ball", -10);
 *     ・戦闘参加メンバーのテンションを10減らします。
 *
 *   $gameSystem.setTension("all", 80);
 *     ・パーティメンバーのテンションを80にセットします。
 *
 *
 * 補足：
 *   ・このプラグインに関するメモ欄の設定、プラグインコマンド/パラメーター、
 *     制御文字は大文字/小文字を区別していません。
 *
 *   ・プラグインパラメーターの説明に、[初期値]と書かれているものは
 *     メモ欄などで個別に設定が可能です。
 *     設定した場合、[初期値]よりメモ欄の設定が
 *     優先されますのでご注意ください。
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
 * @param Tension_Name
 * @desc メニューなどに表示されるテンション値の名称を指定します。
 * @default テンション
 *
 * @param Tension_Name_A
 * @desc メニューなどに表示されるテンション値の略称を指定します。
 * @default ﾃﾝｼｮﾝ
 *
 * @param Gauge_Color1
 * @desc テンションゲージのグラデーション用カラー番号1(左)、表示可能色はWindow.pngの右下部分にある色枠を参照してください。
 * @default 10
 *
 * @param Gauge_Color2
 * @desc テンションゲージのグラデーション用カラー番号2(右)、表示可能色はWindow.pngの右下部分にある色枠を参照してください。
 * @default 2
 *
 * @param Gauge_Menu_Enable
 * @desc メニュー画面にテンションゲージを表示するか指定します。(ON:表示する、OFF:表示しない)
 * @default ON
 *
 * @param Gauge_Menu_X
 * @desc メニュー画面テンションゲージのX座標増減値。横の位置を調整したい場合に指定してください。
 * @default 0
 *
 * @param Gauge_Menu_Y
 * @desc メニュー画面テンションゲージのY座標増減値。縦の位置を調整したい場合に指定してください。
 * @default 0
 *
 * @param Gauge_Menu_Width
 * @desc メニュー画面テンションゲージのwidth増減値。長さを調整したい場合に指定してください。
 * @default 0
 *
 * @param Gauge_Battle_Enable
 * @desc バトル画面にテンションゲージを表示するか指定します。(ON:表示する、OFF:表示しない)
 * @default ON
 *
 * @param Gauge_Battle_X
 * @desc バトル画面テンションゲージのX座標増減値、横の位置を調整したい場合に指定してください。
 * @default 0
 *
 * @param Gauge_Battle_Y
 * @desc バトル画面テンションゲージのY座標増減値、縦の位置を調整したい場合に指定してください。
 * @default 0
 *
 * @param Gauge_Battle_Width
 * @desc バトル画面テンションゲージのwidth増減値。長さを調整したい場合に指定してください。
 * @default 0
 *
 * @param Actor_Init_Tension
 * @desc [初期値] アクターの初期テンション値を指定します。
 * @default 50
 *
 * @param Actor_Max_Tension
 * @desc アクターの最大テンション値を指定します。
 * @default 100
 *
 * @param Actor_Die_Tension_Down_Enable
 * @desc アクターが戦闘不能になったとき、他アクターのテンションを減少させるか指定します。(ON:減少させる, OFF:減少させない)
 * @default ON
 *
 * @param Actor_Die_Tension_Down
 * @desc アクターが戦闘不能になったとき、他アクターに対して減少させるテンション値を指定します。
 * @default 20
 *
 * @param Battle_Win_Tension_Up_Enable
 * @desc 戦闘に勝利したとき、戦闘参加メンバーのテンションを増加させるか指定します。(ON:増加させる, OFF:増加させない)
 * @default ON
 *
 * @param Battle_Win_Tension_Up
 * @desc 戦闘に勝利したとき、戦闘参加メンバーに対して増加させるテンション値を指定します。
 * @default 10
 *
 * @param Battle_Getaway_Tension_Down_Enable
 * @desc 戦闘から逃走したとき、戦闘参加メンバーのテンションを減少させるか指定します。(ON:減少させる, OFF:減少させない)
 * @default ON
 *
 * @param Battle_Getaway_Tension_Down
 * @desc 戦闘に逃走したとき、戦闘参加メンバーに対して減少させるテンション値を指定します。
 * @default 5
 *
 * @param State_Add_Tension_Down_Enable
 * @desc テンション値が低下した場合、ステート付与を行うか指定します。(ON:行う, OFF:行わない)
 * @default ON
 *
 * @param State_Add_Tension_Low
 * @desc [初期値] ステート付与を行うテンション値を指定します。(0～100指定値以下で付与)
 * @default 30
 *
 * @param State_Id_Tension_Low
 * @desc [初期値] テンション値が指定値以下となった場合に付与するステートIDを指定します。
 * @default 5
 *
 * @param State_Id_Tension_Invalid
 * @desc テンション値の低下によるステート付与を無効化するステートIDを指定します。
 * @default 7
 *
*/

var Imported = Imported || {};
Imported.MKR_ActorTension = true;

(function () {
    'use strict';
    var PN, Params, Metas;
    PN = "MKR_ActorTension";

    var CheckParam = function(type, param, def, min, max) {
        var Parameters, regExp, value;
        Parameters = PluginManager.parameters(PN);

        if(arguments.length < 4) {
            min = -Infinity;
            max = Infinity;
        }
        if(arguments.length < 5) {
            max = Infinity;
        }
        if(param in Parameters) {
            value = String(Parameters[param]);
        } else {
            throw new Error("[CheckParam] プラグインパラメーターがありません: " + param);
        }

        value = value.replace(/\\/g, '\x1b');
        value = value.replace(/\x1b\x1b/g, '\\');

        regExp = /^\x1bV\[\d+\]$/i;
        if(!regExp.test(value)) {
            switch(type) {
                case "bool":
                    if(value == "") {
                        value = (def)? true : false;
                    }
                    value = value.toUpperCase() === "ON" || value.toUpperCase() === "TRUE" || value.toUpperCase() === "1";
                    break;
                case "num":
                    if(value == "") {
                        value = (isFinite(def))? parseInt(def, 10) : 0;
                    } else {
                        value = (isFinite(value))? parseInt(value, 10) : (isFinite(def))? parseInt(def, 10) : 0;
                        value = value.clamp(min, max);
                    }
                    break;
                case "string":
                    value = value;
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
        }

        return [value, type, def, min, max, param];
    }

    Params = {
        "TenName" : CheckParam("string", "Tension_Name", "テンション"),
        "TenNameA" : CheckParam("string", "Tension_Name_A", "ﾃﾝｼｮﾝ"),
        "GaugeColor1" : CheckParam("num", "Gauge_Color1", 10, 0),
        "GaugeColor2" : CheckParam("num", "Gauge_Color2", 2, 0),
        "GaugeMenuEnable" : CheckParam("bool", "Gauge_Menu_Enable", "ON"),
        "GaugeMenuX" : CheckParam("num", "Gauge_Menu_X", 0),
        "GaugeMenuY" : CheckParam("num", "Gauge_Menu_Y", 0),
        "GaugeMenuW" : CheckParam("num", "Gauge_Menu_Width", 0),
        "GaugeBattleEnable" : CheckParam("bool", "Gauge_Battle_Enable", "ON"),
        "GaugeBattleX" : CheckParam("num", "Gauge_Battle_X", 0),
        "GaugeBattleY" : CheckParam("num", "Gauge_Battle_Y", 0),
        "GaugeBattleW" : CheckParam("num", "Gauge_Battle_Width", 0),
        "ActorInitTen" : CheckParam("num", "Actor_Init_Tension", 50, 0, 100),
        "ActorMaxTen" : CheckParam("num", "Actor_Max_Tension", 50, 0, 100),
        "ActorDieTenDownEnable" : CheckParam("bool", "Actor_Die_Tension_Down_Enable", "ON"),
        "ActorDieTenDown" : CheckParam("num", "Actor_Die_Tension_Down", 20, 0),
        "BattleWinTenUpEnable" : CheckParam("bool", "Battle_Win_Tension_Up_Enable", "ON"),
        "BattleWinTenUp" : CheckParam("num", "Battle_Win_Tension_Up", 10, 0),
        "BattleGetawayTenDownEnable" : CheckParam("bool", "Battle_Getaway_Tension_Down_Enable", "ON"),
        "BattleGetawayTenDown" : CheckParam("num", "Battle_Getaway_Tension_Down", 5, 0),
        "StateAddTenDownEnable" : CheckParam("bool", "State_Add_Tension_Down_Enable", "ON"),
        "StateAddTenLow" : CheckParam("num", "State_Add_Tension_Low", 30, 1),
        "StateIdTenLow" : CheckParam("num", "State_Id_Tension_Low", 5, 1),
        "StateIdTenInvalid" : CheckParam("num", "State_Id_Tension_Invalid", 7, 1),
    };


    //=========================================================================
    // Game_Interpreter
    //  ・テンションの設定コマンドを定義します。
    //
    //=========================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === "tension") {
            switch (args[0].toLowerCase()) {
                case "add":// テンション値増減
                    $gameSystem.addTension(args[1], args[2]);
                    break;
                case "set":// テンション値セット
                    $gameSystem.setTension(args[1], args[2]);
                    break;
            }
        }
    };


    //=========================================================================
    // Game_System
    //  ・テンションの操作コマンドを定義します。
    //
    //=========================================================================
    Game_System.prototype.addTension = function(args1, args2) {
        var actorId, actor, value;

        value = isFinite(args2)? parseInt(args2, 10) : 0;
        if(args1.toLowerCase() == "all") {
            $gameParty.members().forEach(function(actor) {
                if(actor.isAlive()) {
                    actor.gainTension(value);
                }
            });
        }else if(args1.toLowerCase() == "ball") {
            $gameParty.battleMembers().forEach(function(actor) {
                if(actor.isAlive()) {
                    actor.gainTension(value);
                }
            });
        } else {
            if(isFinite(args1)) {
                actorId = parseInt(args1, 10);
                actor = $gameActors.actor(actorId);
                if(actor) {
                    actor.gainTension(value);
                }
            }
        }
    };

    Game_System.prototype.setTension = function(args1, args2) {
        var actorId, actor, value;

        value = isFinite(args2)? parseInt(args2, 10) : 0;
        if(args1.toLowerCase() == "all") {
            $gameParty.members().forEach(function(actor) {
                if(actor.isAlive()) {
                    actor.setTension(value);
                }
            });
        }else if(args1.toLowerCase() == "ball") {
            $gameParty.battleMembers().forEach(function(actor) {
                if(actor.isAlive()) {
                    actor.gainTension(value);
                }
            });
        } else {
            if(isFinite(args1)) {
                actorId = parseInt(args1, 10);
                actor = $gameActors.actor(actorId);
                if(actor) {
                    actor.setTension(value);
                }
            }
        }
    };


    //=========================================================================
    // Window_Base
    //  ・画面に表示するテンションゲージを定義します。
    //
    //=========================================================================
    var _Window_Base_drawActorSimpleStatus = Window_Base.prototype.drawActorSimpleStatus;
    Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
        _Window_Base_drawActorSimpleStatus.apply(this, arguments);

        if(Params.GaugeMenuEnable[0]) {
            var lineHeight, x2, y2, width2;
            lineHeight = this.lineHeight();
            x2 = x + 180;
            y2 = y + lineHeight * 3;
            width2 = Math.min(200, width - 180 - this.textPadding());
            if(Params.GaugeMenuX[0] != 0) {
                x2 = x2 + Params.GaugeMenuX[0];
            }
            if(Params.GaugeMenuY[0] != 0) {
                y2 = y2 + Params.GaugeMenuY[0];
            }
            if(Params.GaugeMenuW[0] != 0) {
                width2 = width2 + Params.GaugeMenuW[0];
            }

            this.drawActorTension(actor, x2, y2, width2);
        }
    };

    Window_Base.prototype.drawActorTension = function(actor, x, y, width) {
        var color1, color2;
        color1 = this.tensionGaugeColor1();
        color2 = this.tensionGaugeColor2();
        width = width || 186;

        this.drawGauge(x, y, width, actor.tensionRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(Params.TenNameA[0], x, y, 44);
        this.changeTextColor(this.tensionColor(actor));
        this.drawText(actor.tension, x + width - 64, y, 64, 'right');
        // this.drawCurrentAndMax(actor.ten, actor.maxTen(), x, y, width,
        //                        this.tensionColor(actor), this.normalColor());
    };

    Window_Base.prototype.tensionGaugeColor1 = function() {
        return this.textColor(Params.GaugeColor1[0]);
    };

    Window_Base.prototype.tensionGaugeColor2 = function() {
        return this.textColor(Params.GaugeColor2[0]);
    };

    Window_Base.prototype.tensionColor = function(actor) {
        return this.normalColor();
    };


    //=========================================================================
    // Window_MenuStatus
    //  ・メニュー画面に表示するテンションゲージを定義します。
    //
    //=========================================================================
    var _Window_MenuStatus_drawItemStatus = Window_MenuStatus.prototype.drawItemStatus;
    Window_MenuStatus.prototype.drawItemStatus = function(index) {
        if(Params.GaugeMenuEnable[0]) {
            var actor, rect, x, y, width;
            actor = $gameParty.members()[index];
            rect = this.itemRect(index);
            x = rect.x + 162;
            y = rect.y;
            width = rect.width - x - this.textPadding();

            this.drawActorSimpleStatus(actor, x, y, width);
        } else {
            _Window_MenuStatus_drawItemStatus.call(this, index);
        }
   };


    //=========================================================================
    // Window_BattleStatus
    //  ・バトル画面に表示するテンションゲージを定義します。
    //
    //=========================================================================
    var _Window_BattleStatus_gaugeAreaWidth = Window_BattleStatus.prototype.gaugeAreaWidth;
    Window_BattleStatus.prototype.gaugeAreaWidth = function() {
        if($dataSystem.optDisplayTp && Params.GaugeBattleEnable[0]) {
            return 343;
        } else {
            return _Window_BattleStatus_gaugeAreaWidth.call(this);
        }
    };

    var _Window_BattleStatus_drawBasicArea = Window_BattleStatus.prototype.drawBasicArea;
    Window_BattleStatus.prototype.drawBasicArea = function(rect, actor) {
        if($dataSystem.optDisplayTp && Params.GaugeBattleEnable[0]) {
            this.drawActorName(actor, rect.x + 0, rect.y, 150);
            this.drawActorIcons(actor, rect.x + 153, rect.y, rect.width - 153);
        } else {
            _Window_BattleStatus_drawBasicArea.apply(this, arguments);
        }
    };

    var _Window_BattleStatus_drawGaugeAreaWithTp = Window_BattleStatus.prototype.drawGaugeAreaWithTp;
    Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect, actor) {
        if(Params.GaugeBattleEnable[0]) {
            var x2, y2, width2;
            x2 = rect.x + 265;
            y2 = rect.y;
            width2 = 84;
            if(Params.GaugeBattleX[0] != 0) {
                x2 = x2 + Params.GaugeMenuX[0];
            }
            if(Params.GaugeBattleY[0] != 0) {
                y2 = y2 + Params.GaugeMenuY[0];
            }
            if(Params.GaugeBattleW[0] != 0) {
                width2 = width2 + Params.GaugeBattleW[0];
            }

            this.drawActorHp(actor, rect.x + 0, rect.y, 88);
            this.drawActorMp(actor, rect.x + 93, rect.y, 88);
            this.drawActorTp(actor, rect.x + 186, rect.y, 74);
            this.drawActorTension(actor, x2, y2, width2);
        } else {
            return _Window_BattleStatus_drawGaugeAreaWithTp.apply(this, arguments);
        }

    };

    var _Window_BattleStatus_drawGaugeAreaWithoutTp = Window_BattleStatus.prototype.drawGaugeAreaWithoutTp;
    Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect, actor) {
        if(Params.GaugeBattleEnable[0]) {
            var x2, y2;
            x2 = rect.x + 234;
            y2 = rect.y;
            if(Params.GaugeBattleX[0] != 0) {
                x2 = x2 + Params.GaugeMenuX[0];
            }
            if(Params.GaugeBattleY[0] != 0) {
                y2 = y2 + Params.GaugeMenuY[0];
            }

            this.drawActorHp(actor, rect.x + 0, rect.y, 108);
            this.drawActorMp(actor, rect.x + 123,  rect.y, 96);
            this.drawActorTension(actor, x2, y2, 96);
        } else {
            return _Window_BattleStatus_drawGaugeAreaWithoutTp.apply(this, arguments);
        }

    };


    //=========================================================================
    // Game_Actor
    //  ・テンションシステムを定義します。
    //
    //=========================================================================
    Object.defineProperties(Game_Actor.prototype, {
        // Tension
        tension: { get: function() { return this._tension; }, configurable: true },
        // syncNoiable
        syncNo: { get: function() { return this._syncNo; }, configurable: true },
        // TensionDownStateId
        lowsId: { get: function() { return this._lowsId; }, configurable: true },
        // TensionLowThreshold
        lowThreshold: { get: function() { return this._lowThresold; }, configurable: true },
    });

    var _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);

        this._tension = 0;
        this._syncNo = 0;
        this._lowsId = 0;
        this._lowThresold = 0;
    };

    var _Game_Actor_setup = Game_Actor.prototype.setup;
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);

        this.setupTension();
    };

    Game_Actor.prototype.setupTension = function() {
        var actor, pattern, match, note, cnt, i, n, m, options, value;
        actor = this.actor();
        pattern = /<tension:(\d*)([ 0-9a-z]*)?>/i

        this._tension = Params.ActorInitTen[0];
        this._lowsId = Params.StateIdTenLow[0];
        this._lowThresold = Params.StateAddTenLow[0];

        if(actor.note) {
            note = actor.note.toLowerCase();
            note = note.split(/\s*(?=<)/);
            cnt = note.length;

            for(i = 0;i < cnt;i++) {
                n = note[i].trim();

                if(n.match(pattern)) {
                    match = n.match(pattern);
                    if(match[1] && isFinite(match[1])) { // 初期テンション値
                        this.setTension(parseInt(match[1], 10));
                    }
                    if(match[2]) { // オプション
                        options = match[2].trim().split(" ");
                        options.forEach(function(op){
                            op = op.trim();
                            if(/^low(\d+)$/i.test(op)) { // テンションLow値
                                m = op.match(/^low(\d+)$/i);
                                if(isFinite(m[1]) && parseInt(m[1], 10) > 0) {
                                    this._lowThresold = parseInt(m[1], 10);
                                }
                            } else if(/^lowsid(\d+)$/i.test(op)) { // テンションLowステートID
                                m = op.match(/^lowsid(\d+)$/);
                                if(isFinite(m[1]) && parseInt(m[1], 10) > 0) {
                                    this._lowsId = parseInt(m[1], 10);
                                }
                            } else if(/^vno(\d+)$/.test(op)) { // テンション格納変数
                                m = op.match(/^vno(\d+)$/);
                                if(isFinite(m[1]) && parseInt(m[1], 10) > 0) {
                                    this._syncNo = parseInt(m[1], 10);
                                    $gameVariables._data[this.tensionSyncNo()] = this._tension;
                                }
                            }
                        }, this);
                    }
                }
            }
        }
    };

    Game_Actor.prototype.setTension = function(tension) {
        if(tension < 0) {
            this._tension = 0;
        } else if(tension > this.maxTen()) {
            this._tension = this.maxTen();
        } else {
            this._tension = tension;
        }
        if(this.tensionSyncNo() > 0) {
            $gameVariables._data[this.tensionSyncNo()] = tension;
        }
        this.refresh();
    };

    Game_Actor.prototype.tensionRate = function() {
        return this._tension / this.maxTen();
    };

    Game_Actor.prototype.maxTen = function() {
        return Params.ActorMaxTen[0];
    };

    var _Game_Actor_refresh = Game_Actor.prototype.refresh;
    Game_Actor.prototype.refresh = function() {
        _Game_Actor_refresh.call(this);

        if(Params.StateAddTenDownEnable[0]) {
            if(this.tension <= this.tensionLowThreshold()) {
                if(!this.isStateAffected(this.tensionLowStateId()) && !this.isStateAffected(this.tensionInvalidStateId())) {
                    this.addState(this.tensionLowStateId());
                }
            } else {
                this.removeState(this.tensionLowStateId());
            }
        }
        if(this.isStateAffected(this.tensionInvalidStateId()) && this.isStateAffected(this.tensionLowStateId())) {
            this.removeState(this.tensionLowStateId());
        }
    };

    Game_Actor.prototype.gainTension = function(value) {
        this._result.tensionDamage = -value;
        this.setTension(this.tension + value);
    };

    Game_Actor.prototype.gainSilentTension = function(value) {
        this.setTension(this.tension + value);
    };

    Game_Actor.prototype.tensionLowThreshold = function() {
        return this._lowThresold;
    };

    Game_Actor.prototype.tensionLowStateId = function() {
        return this._lowsId;
    };

    Game_Actor.prototype.tensionSyncNo = function() {
        return this._syncNo;
    };

    Game_Actor.prototype.tensionInvalidStateId = function() {
        return Params.StateIdTenInvalid[0];
    };


    //=========================================================================
    // Game_BattlerBase
    //  ・テンションシステムを定義します。
    //
    //=========================================================================
    var _Game_BattlerBase_die = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function() {
        _Game_BattlerBase_die.call(this);

        if(this.isActor() && Params.ActorDieTenDownEnable[0]) {
            $gameParty.battleMembers().forEach(function(actor) {
                if(actor._hp > 0) {
                    actor.setTension(actor.tension - Params.ActorDieTenDown[0]);
                }
            });
        }
    };


    //=========================================================================
    // Game_ActionResult
    //  ・テンションシステムを定義します。
    //
    //=========================================================================
    var _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear.call(this);
        this.tensionDamage = 0;
    };


    //=========================================================================
    // BattleManager
    //  ・テンションシステムを定義します。
    //
    //=========================================================================
    var _BattleManager_processVictory = BattleManager.processVictory;
    BattleManager.processVictory = function() {
        _BattleManager_processVictory.call(this);

        if(Params.BattleWinTenUpEnable[0]) {
            $gameParty.battleMembers().forEach(function(actor) {
                if(actor.isAlive()) {
                    actor.setTension(actor.tension + Params.BattleWinTenUp[0]);
                }
            });
        }
    };

    var _BattleManager_processEscape = BattleManager.processEscape;
    BattleManager.processEscape = function() {
        var success;
        success = _BattleManager_processEscape.call(this);

        if(success && Params.BattleGetawayTenDownEnable[0]) {
            $gameParty.battleMembers().forEach(function(actor) {
                if(actor.isAlive()) {
                    actor.setTension(actor.tension - Params.BattleGetawayTenDown[0]);
                }
            });
        }

        return success;
    };


    //=========================================================================
    // DataManager
    //  ・プラグイン導入前のセーブデータをロードしたとき用処理を再定義します。
    //
    //=========================================================================
    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        $gameActors._data.forEach(function(actor) {
            if(actor && actor._tension === undefined) {
                actor.setupTension();
            }
        });
    };


})();