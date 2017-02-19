//=============================================================================
// MKR_BtcCustom_1.js
//=============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/02/19 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.0) バトルコマンドカスタマイズプラグイン その1
 * @author マンカインド
 *
 * @help
 * バトル中、アクターコマンドウィンドウに表示されるスキルのコマンドを
 * 「特技」コマンドとしてひとつにまとめ、
 *
 * 「特技」コマンド選択時に、使用したスキルのタイプを選択するウィンドウを
 * 新しく表示、タイプを選択することでスキルウィンドウが表示されるように
 * します。
 *
 * アクターが複数のスキルタイプを使用可能な場合に、アクターコマンドが
 * ウィンドウに収まらず、コマンド行が長くなってしまう現象を改善できます。
 *
 * その1 と名付けていますがこのプラグイン単体で動作します。
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
 * @param Skill_Category_Name
 * @desc スキルカテゴリウィンドウを表示するためのバトルコマンド名を指定してください。
 * @default 特技
 *
*/


var Imported = Imported || {};
Imported.MKR_BtcCustom_1 = true;

(function () {
    'use strict';

    var PN = "MKR_BtcCustom_1";

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
                case "string":
                    value = value;
                    break;
                default:
                    throw new Error("[CheckParam] " + param + "のタイプが不正です: " + type);
                    break;
            }
        }

        return [value, type, def, min, max, param];
    }

    var Params = {
        "SkillCateName" : CheckParam("string", "Skill_Category_Name", "特技"),
    };


    //=========================================================================
    // Window_SkillCommand
    //  ・スキルカテゴリーウィンドウを定義します。
    //
    //=========================================================================
    function Window_SkillCategory() {
        this.initialize.apply(this, arguments);
    }

    Window_SkillCategory.prototype = Object.create(Window_Command.prototype);
    Window_SkillCategory.prototype.constructor = Window_SkillCategory;

    Window_SkillCategory.prototype.initialize = function() {
        var y = Graphics.boxHeight - this.windowHeight();
        Window_Command.prototype.initialize.call(this, 0, y);
        this.openness = 0;
        this.deactivate();
        this._actor = null;
    };

    Window_SkillCategory.prototype.windowWidth = function() {
        return 192;
    };

    Window_SkillCategory.prototype.numVisibleRows = function() {
        return 4;
    };

    Window_SkillCategory.prototype.makeCommandList = function() {
        if (this._actor) {
            this.addSkillCommands();
        }
    };

    Window_SkillCategory.prototype.addSkillCommands = function() {
        var skillTypes = this._actor.addedSkillTypes();
        skillTypes.sort(function(a, b) {
            return a - b;
        });
        skillTypes.forEach(function(stypeId) {
            var name = $dataSystem.skillTypes[stypeId];
            this.addCommand(name, 'cate', true, stypeId);
        }, this);
    };

    Window_SkillCategory.prototype.setup = function(actor) {
        this._actor = actor;
        this.clearCommandList();
        this.makeCommandList();
        this.refresh();
        this.selectLast();
        this.activate();
        this.open();
    };

    Window_SkillCategory.prototype.selectLast = function() {
        this.select(0);
        if (this._actor && ConfigManager.commandRemember) {
            var symbol = this._actor.lastCommandSymbol();
            if (symbol === 'skill') {
                var skill = this._actor.lastBattleSkill();
                if (skill) {
                    this.selectExt(skill.stypeId);
                }
            }
        }
    };


    //=========================================================================
    // Window_ActorCommand
    //  ・スキルコマンドを再定義します。
    //
    //=========================================================================
    var _Window_ActorCommand_addSkillCommands = Window_ActorCommand.prototype.addSkillCommands;
    Window_ActorCommand.prototype.addSkillCommands = function() {
        this.addCommand(Params.SkillCateName[0], 'skill', true);
    };

    var _Window_ActorCommand_selectLast = Window_ActorCommand.prototype.selectLast;
    Window_ActorCommand.prototype.selectLast = function() {
        _Window_ActorCommand_selectLast.call(this);
        if (this._actor && ConfigManager.commandRemember) {
            var symbol = this._actor.lastCommandSymbol();
            this.selectSymbol(symbol);
        }
    };


    //=========================================================================
    // Scene_Battle
    //  ・スキルカテゴリーウィンドウを定義します。
    //
    //=========================================================================
    var _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        this.createSkillCategoryWindow();
        _Scene_Battle_createAllWindows.call(this);
    };

    Scene_Battle.prototype.createSkillCategoryWindow = function() {
        this._skillCategoryWindow = new Window_SkillCategory();
        this._skillCategoryWindow.setHandler('cate',  this.onSkillCategory.bind(this));
        this._skillCategoryWindow.setHandler('cancel', this.onSkillCategoryCancel.bind(this));
        this.addWindow(this._skillCategoryWindow);
    };

    var _Scene_Battle_commandSkill = Scene_Battle.prototype.commandSkill;
    Scene_Battle.prototype.commandSkill = function() {
        this._actorCommandWindow.close();
        this._skillCategoryWindow.setup(BattleManager.actor());
    };

    var _Scene_Battle_stop = Scene_Battle.prototype.stop;
    Scene_Battle.prototype.stop = function() {
        _Scene_Battle_stop.call(this);
        this._skillCategoryWindow.close();
    };

    var _Scene_Battle_updateStatusWindow = Scene_Battle.prototype.updateStatusWindow
    Scene_Battle.prototype.updateStatusWindow = function() {
        if ($gameMessage.isBusy()) {
            this._skillCategoryWindow.close();
        }
        _Scene_Battle_updateStatusWindow.call(this);
    };

    Scene_Battle.prototype.onSkillCategory = function() {
        this._skillWindow.setActor(BattleManager.actor());
        this._skillWindow.setStypeId(this._skillCategoryWindow.currentExt());
        this._skillWindow.refresh();
        this._skillWindow.show();
        this._skillWindow.activate();
    };

    Scene_Battle.prototype.onSkillCategoryCancel = function() {
        this._skillCategoryWindow.close();
        this._actorCommandWindow.setup(BattleManager.actor());
    };

    var _Scene_Battle_onSkillCancel = Scene_Battle.prototype.onSkillCancel;
    Scene_Battle.prototype.onSkillCancel = function() {
        _Scene_Battle_onSkillCancel.call(this);
        this._actorCommandWindow.deactivate();
        this._skillCategoryWindow.activate();
    };

    var _Scene_Battle_isAnyInputWindowActive = Scene_Battle.prototype.isAnyInputWindowActive;
    Scene_Battle.prototype.isAnyInputWindowActive = function() {
        return (_Scene_Battle_isAnyInputWindowActive.call(this) || this._skillCategoryWindow.active);
    };

    var _Scene_Battle_startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
    Scene_Battle.prototype.startActorCommandSelection = function() {
        this._skillCategoryWindow.close();
        _Scene_Battle_startActorCommandSelection.call(this);
    };

    var _Scene_Battle_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
    Scene_Battle.prototype.startPartyCommandSelection = function() {
        this._skillCategoryWindow.close();
        _Scene_Battle_startPartyCommandSelection.call(this);
    };

    var _Scene_Battle_endCommandSelection = Scene_Battle.prototype.endCommandSelection;
    Scene_Battle.prototype.endCommandSelection = function() {
        _Scene_Battle_endCommandSelection.call(this);
        this._skillCategoryWindow.close();
    };


})();