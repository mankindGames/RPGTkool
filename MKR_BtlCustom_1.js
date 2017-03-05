//=============================================================================
// MKR_BtlCustom_1.js
//=============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/0３/05 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.0) バトル画面レイアウトプラグイン その1
 * @author マンカインド
 *
 * @help = バトル画面レイアウトプラグイン その1 =
 *
 * バトル画面のアクターステータスウィンドウをアクター毎に描画するように変更し、
 * アクターコマンド選択中には、アクターコマンドウィンドウの右に
 * アクターフェイスウィンドウを描画します。
 *
 * この変更によってゲーム画面の横サイズが足りなくなった場合、
 * プラグインパラメーターからサイズの変更が可能です。
 * (他のプラグインで同等機能を使用している場合はそちらを使用してください)
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
 *
 * @param Screen_Width
 * @desc 画面横のサイズをpx単位で指定します。(0を指定すると、本プラグインでサイズの変更を行わない。0指定時の画面横サイズ:816)
 * @default 0
 *
 * @param Screen_Height
 * @desc 画面縦のサイズをpx単位で指定します。(0を指定すると、本プラグインでサイズの変更を行わない。0指定時の画面横サイズ:624)
 * @default 0
 *
 * @param Window_Left_Margin
 * @desc バトルステータスウィンドウ左側(フェイスウィンドウ右側)の余白をpx単位で指定します。
 * @default 100
 *
 * @param Battler_Position
 * @desc バトラーの位置を画面サイズで調節する機能を有効にする。[ON / OFF] (他のプラグインで変更している場合はOFFを指定)
 * @default OFF
 *
 * @param Fit_Titleback
 * @desc タイトル画面の背景を画面サイズに合わせる機能を有効にする。[ON / OFF] (他のプラグインで変更している場合はOFFを指定)
 * @default OFF
 *
 * @param Fit_Battleback
 * @desc 戦闘画面の背景を画面サイズに合わせる機能を有効にする。[ON / OFF] (他のプラグインで変更している場合はOFFを指定)
 * @default OFF
 *
 * @param Fit_Gameoverback
 * @desc ゲームオーバー画面の背景を画面サイズに合わせる機能を有効にする。[ON / OFF] (他のプラグインで変更している場合はOFFを指定)
 * @default OFF
 *
*/

var Imported = Imported || {};
Imported.MKR_BtlCustom_1 = true;

(function () {
    'use strict';

    var PN = "MKR_BtlCustom_1";

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
                default:
                    throw new Error("[CheckParam] " + param + "のタイプが不正です: " + type);
                    break;
            }
        }

        return [value, type, def, min, max, param];
    }

    var Params = {
        "ScreenW" : CheckParam("num", "Screen_Width", 0, 0),
        "ScreenH" : CheckParam("num", "Screen_Height", 0, 0),
        "MarginL" : CheckParam("num", "Window_Left_Margin", 100, 0),
        "BattlerPos" : CheckParam("bool", "Battler_Position", "OFF"),
        "FitTitleback" : CheckParam("bool", "Fit_Titleback", "OFF"),
        "FitBattleback" : CheckParam("bool", "Fit_Battleback", "OFF"),
        "FitGameoverback" : CheckParam("bool", "Fit_Gameoverback", "OFF"),
    };


    //=========================================================================
    // Game_System
    //  ・
    //
    //=========================================================================
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function(){
        _Game_System_initialize.call(this);
    };


    //=========================================================================
    // Window_BattleFace
    //  ・バトルフェイスウィンドウを定義します。
    //
    //=========================================================================
    function Window_BattleFace() {
        this.initialize.apply(this, arguments);
    }

    Window_BattleFace.prototype = Object.create(Window_Base.prototype);
    Window_BattleFace.prototype.constructor = Window_BattleFace;

    Window_BattleFace.prototype.initialize = function(x, y, width, height) {
        var width, height;
        width = width >= this.windowWidth() ? width : this.windowWidth();
        height = height >= this.windowHeight() ? height : this.windowHeight();
        Window_Base.prototype.initialize.call(this, x, y, width, height);

        this.openness = 0;
        this._actor = null;
    };

    Window_BattleFace.prototype.windowWidth = function() {
        return Window_Base._faceWidth + this.standardPadding() * 2;
    };

    Window_BattleFace.prototype.windowHeight = function() {
        return Window_Base._faceHeight + this.standardPadding() * 2;
    };

    Window_BattleFace.prototype.setup = function(actor) {
        this._actor = actor;
        if(this._actor) {
            this.loadImages();
            this.refresh();
            this.open();
        }
    };

    Window_BattleFace.prototype.loadImages = function() {
        if(this._actor) {
            ImageManager.loadFace(this._actor.faceName());
        }
    };

    Window_BattleFace.prototype.refresh = function() {
        var bitmap;
        if (this._actor) {
            this.contents.clear();
            bitmap = ImageManager.loadFace(this._actor.faceName());
            if (bitmap.width <= 0) {
                return setTimeout(this.refresh.bind(this), 5);
            }
            this.drawActorFace(this._actor, 0, 0, Window_Base._faceWidth, Window_Base._faceHeight);
        }
    };


    //=========================================================================
    // Window_BattleStatus
    //  ・バトルステータスウィンドウを再定義します。
    //
    //=========================================================================
    var _Window_BattleStatus_initialize = Window_BattleStatus.prototype.initialize;
    Window_BattleStatus.prototype.initialize = function() {
        _Window_BattleStatus_initialize.call(this);
        this.opacity = 0;

        var i, count, container, width;
        if(this._actorWindows === undefined) {
            this._actorWindows = [];
        }
        width = this.itemWidth();
        count = $gameParty.battleMembers().length;

        if(count != this._actorWindows.length) {
            for(i = 0; i < count; i++) {
                container = this.createWindowContainer(width, this.windowHeight());
                container.x = container.width * i;
                this.addChildToBack(container);
                this._actorWindows.push(container);
            }
        }
    };

    var _Window_BattleStatus_windowWidth = Window_BattleStatus.prototype.windowWidth;
    Window_BattleStatus.prototype.windowWidth = function() {
        var ret;

        ret = _Window_BattleStatus_windowWidth.call(this) - Window_Base._faceWidth - Params.MarginL[0];
        if(ret < 0) {
            ret += Window_Base._faceWidth + Params.MarginL[0];
        }
        return ret;
    };

    var _Window_BattleStatus_itemWidth = Window_BattleStatus.prototype.itemWidth;
    Window_BattleStatus.prototype.itemWidth = function() {
        var ret = _Window_BattleStatus_itemWidth.call(this);
        ret = Math.floor(this.width / this.maxCols() - this.standardPadding() * 2);
        return ret;
    };

    var _Window_BattleStatus_itemHeight = Window_BattleStatus.prototype.itemHeight;
    Window_BattleStatus.prototype.itemHeight = function() {
        var ret = _Window_BattleStatus_itemHeight.call(this);
        return this.lineHeight() * 4;
    };

    var _Window_BattleStatus_maxCols = Window_BattleStatus.prototype.maxCols;
    Window_BattleStatus.prototype.maxCols = function() {
        var ret = _Window_BattleStatus_maxCols;
        return 4;
    };

    var _Window_BattleStatus_itemRect = Window_BattleStatus.prototype.itemRect;
    Window_BattleStatus.prototype.itemRect = function(index) {
        var rect, maxCols;
        rect = _Window_BattleStatus_itemRect.call(this, index);
        maxCols = this.maxCols();

        rect.x = index % maxCols * (rect.width + this.standardPadding() * 2) - this._scrollX;

        return rect;
    };

    var _Window_BattleStatus_basicAreaRect = Window_BattleStatus.prototype.basicAreaRect;
    Window_BattleStatus.prototype.basicAreaRect = function(index) {
        var rect = _Window_BattleStatus_basicAreaRect.call(this, index);
        var maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.lineHeight() * 2;
        rect.x = index % maxCols * (rect.width + this.standardPadding() * 2) - this._scrollX;
        return rect;
    };

    var _Window_BattleStatus_gaugeAreaRect = Window_BattleStatus.prototype.gaugeAreaRect;
    Window_BattleStatus.prototype.gaugeAreaRect = function(index) {
        var rect, maxCols;
        maxCols = this.maxCols();
        rect = _Window_BattleStatus_gaugeAreaRect.call(this, index);
        rect.width = this.itemWidth();
        rect.height = this.lineHeight() * 2;
        rect.x = index % maxCols * (rect.width + this.standardPadding() * 2) - this._scrollX;
        rect.y = rect.height;
        return rect;
    };

    var _Window_BattleStatus_drawBasicArea = Window_BattleStatus.prototype.drawBasicArea;
    Window_BattleStatus.prototype.drawBasicArea = function(rect, actor) {
        var lineHeight = this.lineHeight();
        this.drawActorLevel(actor, rect.x, rect.y + lineHeight * 0);
        this.drawActorName(actor, rect.x, rect.y + lineHeight * 1, rect.width);
        // this.drawActorIcons(actor, rect.x + 156, rect.y, rect.width - 156);
    };

    var _Window_BattleStatus_drawGaugeAreaWithTp = Window_BattleStatus.prototype.drawGaugeAreaWithTp;
    Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect, actor) {
        var lineHeight = this.lineHeight();
        this.drawActorHp(actor, rect.x, rect.y + lineHeight * 0, rect.width);
        this.drawActorMp(actor, rect.x, rect.y + lineHeight * 1, rect.width);
        this.drawActorTp(actor, rect.x, rect.y + lineHeight * 2, rect.width);
    };

    var _Window_BattleStatus_drawGaugeAreaWithoutTp = Window_BattleStatus.prototype.drawGaugeAreaWithoutTp;
    Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect, actor) {
        var lineHeight = this.lineHeight();
        this.drawActorHp(actor, rect.x, rect.y + lineHeight * 0, rect.width);
        this.drawActorMp(actor, rect.x,  rect.y + lineHeight * 1, rect.width);
    };

    var _Window_BattleStatus_drawActorLevel = Window_BattleStatus.prototype.drawActorLevel;
    Window_BattleStatus.prototype.drawActorLevel = function(actor, x, y) {
        var dw1, dw2;
        dw1 = this.textWidth(TextManager.levelA);
        dw2 = this.textWidth(actor.maxLevel()) + this.standardFontSize();

        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.levelA, x, y, dw1);
        this.resetTextColor();
        this.drawText(actor.level, x + dw1, y, dw2, 'right');
    };

    var _Window_BattleStatus_drawActorHp = Window_BattleStatus.prototype.drawActorHp;
    Window_BattleStatus.prototype.drawActorHp = function(actor, x, y, width) {
        // width = width || 186;
        var color1 = this.hpGaugeColor1();
        var color2 = this.hpGaugeColor2();
        this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.hpA, x, y, 44);
        this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
                               this.hpColor(actor), this.normalColor());
    };


    //=========================================================================
    // Window
    //  ・ウィンドウ生成処理を定義します。
    //
    //=========================================================================
    Window.prototype.createWindowContainer = function(width, height, margin) {
        var w, h, m, p, q, tone, skin, windowSpriteContainer, windowFrameSprite, windowBackSprite,
            bitmap1, bitmap2;
        windowSpriteContainer = new PIXI.Container();
        windowBackSprite = new Sprite();
        windowFrameSprite = new Sprite();

        windowSpriteContainer.addChild(windowBackSprite);
        windowSpriteContainer.addChild(windowFrameSprite);

        m = margin || 4;
        w = width - m * 2 + this.standardPadding() * 2;
        h = height - m * 2;
        windowBackSprite.bitmap = new Bitmap(1, 1);
        windowBackSprite.alpha = 192 /255;
        bitmap1 = new Bitmap(w, h);
        windowBackSprite.bitmap = bitmap1;
        windowBackSprite.setFrame(0, 0, w, h);
        windowBackSprite.move(m, m);
        if (w > 0 && h > 0 && this.windowskin) {
            p = 96;
            bitmap1.blt(this.windowskin, 0, 0, p, p, 0, 0, w, h);
            for (var y = 0; y < h; y += p) {
                for (var x = 0; x < w; x += p) {
                    bitmap1.blt(this.windowskin, 0, p, p, p, x, y, p, p);
                }
            }
            tone = this._colorTone;
            bitmap1.adjustTone(tone[0], tone[1], tone[2]);
        }

        m = 24;
        w = width + this.standardPadding() * 2;
        h = height;
        bitmap2 = new Bitmap(w, h);
        windowFrameSprite.bitmap = bitmap2;
        windowFrameSprite.setFrame(0, 0, w, h);
        if (w > 0 && h > 0 && this.windowskin) {
            skin = this.windowskin;
            p = 96;
            q = 96;
            bitmap2.blt(skin, p+m, 0+0, p-m*2, m, m, 0, w-m*2, m);
            bitmap2.blt(skin, p+m, 0+q-m, p-m*2, m, m, h-m, w-m*2, m);
            bitmap2.blt(skin, p+0, 0+m, m, p-m*2, 0, m, m, h-m*2);
            bitmap2.blt(skin, p+q-m, 0+m, m, p-m*2, w-m, m, m, h-m*2);
            bitmap2.blt(skin, p+0, 0+0, m, m, 0, 0, m, m);
            bitmap2.blt(skin, p+q-m, 0+0, m, m, w-m, 0, m, m);
            bitmap2.blt(skin, p+0, 0+q-m, m, m, 0, h-m, m, m);
            bitmap2.blt(skin, p+q-m, 0+q-m, m, m, w-m, h-m, m, m);
        }

        return windowSpriteContainer;
    };


    //=========================================================================
    // Sprite_Actor
    //  ・アクターの位置を再定義します。
    //
    //=========================================================================
    if(Params.BattlerPos[0]) {
        var _Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;
        Sprite_Actor.prototype.setActorHome = function(index) {
            _Sprite_Actor_setActorHome.call(this, index);
            this._homeX += Graphics.boxWidth - 816;
            this._homeY += Graphics.boxHeight - 624;
        };
    }


    //=========================================================================
    // Sprite_Enemy
    //  ・エネミーの位置を再定義します。
    //
    //=========================================================================
    if(Params.BattlerPos[0]) {
        var _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
        Sprite_Enemy.prototype.setBattler = function(battler) {
            _Sprite_Enemy_setBattler.call(this, battler);
            this._homeY += Graphics.boxHeight - 624;
            this._enemy._screenY = this._homeY;

            if ($gameSystem.isSideView()) return;

            this._homeX += (Graphics.boxWidth - 816) / 2;
            this._enemy._screenX = this._homeX;
        };
    }


    //=========================================================================
    // Spriteset_Battle
    //  ・バトル画面背景を再定義します。
    //
    //=========================================================================
    var _Spriteset_Battle_locateBattleback = Spriteset_Battle.prototype.locateBattleback;
    Spriteset_Battle.prototype.locateBattleback = function() {
        _Spriteset_Battle_locateBattleback.call(this);
        if(Params.FitBattleback[0]) {
            this.setBattlebackScale(this._back1Sprite);
            this.setBattlebackScale(this._back2Sprite);
        }
    };

    Spriteset_Battle.prototype.setBattlebackScale = function(sprite) {
        if (sprite.bitmap.width <= 0) {
            return setTimeout(this.setBattlebackScale.bind(this, sprite), 5);
        }

        var width, height, scaleX, scaleY;
        width = Graphics.boxWidth;
        height = Graphics.boxHeight;
        scaleX = width / sprite.bitmap.width;
        scaleY = height / sprite.bitmap.height;

        if (scaleX > 1.0) {
            sprite.scale.x = scaleX;
            sprite.origin.x = 0.5;
            sprite.x = 0;
        }
        if (scaleY > 1.0) {
            sprite.scale.y = scaleY;
            sprite.origin.y = 0;
            sprite.y = 0;
        }
    };


    //=========================================================================
    // Scene_Gameover
    //  ・タイトル画面背景を再定義します。
    //
    //=========================================================================
    var _Scene_Gameover_start = Scene_Gameover.prototype.start;
    Scene_Gameover.prototype.start = function() {
        _Scene_Gameover_start.call(this);
        if(Params.FitGameoverback[0]) {
            this.setGameoverbackScale(this._backSprite);
        }
    };

    Scene_Gameover.prototype.setGameoverbackScale = function(sprite) {
        if (sprite.bitmap.width <= 0) {
            return setTimeout(this.setGameoverbackScale.bind(this, sprite), 5);
        }

        var width, height, scaleX, scaleY;
        width = Graphics.boxWidth;
        height = Graphics.boxHeight;
        scaleX = width / sprite.bitmap.width;
        scaleY = height / sprite.bitmap.height;

        if (scaleX > 1.0) {
            sprite.scale.x = scaleX;
        }
        if (scaleY > 1.0) {
            sprite.scale.y = scaleY;
        }

        this.centerSprite(sprite);
    };

    Scene_Gameover.prototype.centerSprite = function(sprite) {
        sprite.x = Graphics.width / 2;
        sprite.y = Graphics.height / 2;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
    };


    //=========================================================================
    // Scene_Battle
    //  ・バトル画面のレイアウトを再定義します。
    //
    //=========================================================================
    var _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.call(this);
        this.createFaceWindow();
    };

    Scene_Battle.prototype.createFaceWindow = function() {
        var x, y, width, height;
        x = this._partyCommandWindow.width;
        y = this._partyCommandWindow.y;
        width = Window_Base._faceWidth;
        height = this._partyCommandWindow.height;
        this._faceWindow = new Window_BattleFace(x, y, width, height);
        this.addWindow(this._faceWindow);
        this._windowLayer.addChildAt(this._faceWindow, 0);
    };

    var _Scene_Battle_updateWindowPositions = Scene_Battle.prototype.updateWindowPositions;
    Scene_Battle.prototype.updateWindowPositions = function() {
        // _Scene_Battle_updateWindowPositions.call(this);

        var statusX = 0;
        if (BattleManager.isInputting()) {
            statusX = this._partyCommandWindow.width + this._faceWindow.width + Params.MarginL[0];
        } else {
            statusX = Graphics.width / 2 - this._statusWindow.windowWidth() / 2;
        }
        if (this._statusWindow.x < statusX) {
            this._statusWindow.x += 16;
            if (this._statusWindow.x > statusX) {
                this._statusWindow.x = statusX;
            }
        }
        if (this._statusWindow.x > statusX) {
            this._statusWindow.x -= 16;
            if (this._statusWindow.x < statusX) {
                this._statusWindow.x = statusX;
            }
        }
    };

    var _Scene_Battle_startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
    Scene_Battle.prototype.startActorCommandSelection = function() {
        _Scene_Battle_startActorCommandSelection.call(this);
        this._faceWindow.setup(BattleManager.actor());
    };

    var _Scene_Battle_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
    Scene_Battle.prototype.startPartyCommandSelection = function() {
        _Scene_Battle_startPartyCommandSelection.call(this);
        this._faceWindow.close();
    };

    var _Scene_Battle_endCommandSelection = Scene_Battle.prototype.endCommandSelection;
    Scene_Battle.prototype.endCommandSelection = function() {
        _Scene_Battle_endCommandSelection.call(this);
        this._faceWindow.close();
    };


    //=========================================================================
    // Scene_Title
    //  ・タイトル画面背景を再定義します。
    //
    //=========================================================================
    var _Scene_Title_start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        _Scene_Title_start.call(this);
        if(Params.FitTitleback[0]) {
            this.setTitlebackScale(this._backSprite1);
            this.setTitlebackScale(this._backSprite2);
        }
    };

    Scene_Title.prototype.setTitlebackScale = function(sprite) {
        if (sprite.bitmap.width <= 0) {
            return setTimeout(this.setTitlebackScale.bind(this, sprite), 5);
        }

        var width, height, scaleX, scaleY;
        width = Graphics.boxWidth;
        height = Graphics.boxHeight;
        scaleX = width / sprite.bitmap.width;
        scaleY = height / sprite.bitmap.height;

        if (scaleX > 1.0) {
            sprite.scale.x = scaleX;
        }
        if (scaleY > 1.0) {
            sprite.scale.y = scaleY;
        }

        this.centerSprite(sprite);
    };


    //=========================================================================
    // Scene_Manager
    //  ・画面サイズを再定義します。
    //
    //=========================================================================
    var _SceneManager_initGraphics = SceneManager.initGraphics;
    SceneManager.initGraphics      = function() {
        this.setScreenSize();
        _SceneManager_initGraphics.call(this);
    };

    SceneManager.setScreenSize = function() {
        var width, height, rw, rh;
        width = Params.ScreenW[0];
        height = Params.ScreenH[0];

        this._screenWidth = width || this._screenWidth;
        this._screenHeight = height || this._screenHeight;
        this._boxWidth = width || this._boxWidth;
        this._boxHeight = height || this._boxHeight;

        if (width || height) {
            rw = this._screenWidth - window.innerWidth;
            rh = this._screenHeight - window.innerHeight;
            window.moveBy(-rw / 2, -rh / 2);
            window.resizeBy(rw, rh);
        }
    };


    //=========================================================================
    // DataManager
    //  ・プラグイン導入前のセーブデータを
    //    ロードしたとき用の処理を定義します。
    //
    //=========================================================================
    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        // 処理を追記
    };


})();