//=============================================================================
// MKR_EventGauge.js
//=============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2017/02/14 スクリプトによるコマンドが一部動作していなかったため修正。
//
// 1.0.0 2017/02/13 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.0) イベントゲージプラグイン
 * @author マンカインド
 *
 * @help = イベントゲージプラグイン =
 *
 * 指定したイベントの足元にゲージを表示します。(表示位置は調節が可能)
 * ゲージ残量はメモ欄で指定した変数の値に対応しており、
 * 変数の値とゲージ残量が同期します。
 * (ただし、ゲージ残量は最大値より上になることは無く、
 *  0より小さくなることもありません)
 *
 * ゲージはイベントの透明化によって非表示になり、
 * 透明化を解除すると再表示されます。
 *
 * ただし、後述するプラグイン/スクリプトコマンドでゲージを非表示にした場合は
 * 透明化の有無に関わらず、プラグイン/スクリプトコマンドで
 * ゲージを明示的に表示させる必要があります。
 *
 *
 * [コピペ用使用例、メモ欄設定・コマンド]
 *   ※各項目の意味は後述しています。
 *     内容は1行毎になっていますので、
 *     必要な行の使用例をコピーしてお使いください。
 *
 *   イベント_メモ欄:
 *     <Egauge:vr10>
 *
 *   プラグインコマンド:
 *     Egauge show 1
 *     Egauge hide 1
 *     Egauge add 1 3
 *     Egauge set 1 5
 *     Egauge maxset 1 5
 *
 *   スクリプトコマンド:
 *     $gameMap.showGaugeWindow(1);
 *     $gameMap.hideGaugeWindow(1);
 *     $gameMap.addGaugeValue(1, 3);
 *     $gameMap.setGaugeValue(1, 5);
 *     $gameMap.setGaugeMaxValue(1, 5);
 *
 *
 * ゲージの色について:
 *   このプラグインでは、ゲージの色番号をプラグインパラメーターで
 *   指定する必要があります。
 *
 *   色番号はsystem/Window.pngの右下側にある
 *   色とりどりの四角い枠群に対応しています。
 *
 *   四角い枠群の左上(デフォルトだと白く塗られている四角い枠)を0番として
 *   右に向かって数えていきます。一番右下が31です。
 *
 *   プラグインパラメーター
 *     Gauge_Color_1
 *     Gauge_Color_2
 *   で指定されているデフォルト値である色番号20と21は、
 *   メニュー等で表示されるHPゲージの色と同じものです。
 *   (デフォルトだと赤みがかった黄色で塗られている四角い枠)
 *
 *   同じく、プラグインパラメーター
 *     Gauge_Back_Color
 *   で指定されているデフォルト値である色番号19は、
 *   メニュー等で表示されるゲージの背景色と同じものです。
 *   (デフォルトだと紺色で塗られている四角い枠)
 *
 *
 * イベント_メモ欄_基本設定:
 *   <Egauge:vr[変数番号]>
 *     ・イベントにゲージを表示します。
 *       [変数番号]の部分に変数の番号を指定してください。
 *
 *     ・ゲージ残量に使用する変数は0より大きい値を入れてください。
 *
 *
 * イベント_メモ欄の設定例:
 *   <Egauge:vr10>
 *     ・イベントにゲージを表示します。
 *       ゲージの表示は変数10番の値が反映されます。
 *
 *
 * コマンド:　※使用する際は、[]を実際の値に置き換えてください。
 *   プラグイン → Egauge show [イベントID]
 *   スクリプト → $gameMap.showGaugeWindow([イベントID]);
 *     ・指定した[イベントID]のゲージを表示設定にします。
 *
 *     ・イベントが透明、イベント画像が未設定のとき、コマンドを実行しても
 *       ゲージは表示されません。
 *
 *     ・ゲージが非表示設定になっている場合、
 *       このコマンドで表示設定にすることが可能です。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、何も変化しません。
 *
 *   プラグイン → Egauge hide [イベントID]
 *   スクリプト → $gameMap.hideGaugeWindow([イベントID]);
 *     ・指定した[イベントID]のゲージを非表示設定にします。
 *
 *     ・イベントが透明ではない、イベント画像が設定されているとき、
 *       コマンドの実行によりゲージが非表示になります。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、何も変化しません。
 *
 *   プラグイン → Egauge add [イベントID] [数字]
 *   スクリプト → $gameMap.addGaugeValue([イベントID], [数字]);
 *     ・指定した[イベントID]のゲージ残量を指定した[数字]分、
 *       増加/減少させます。([数字]がマイナス値だと減少します)
 *
 *     ・変数によってゲージ残量が決められている場合、このコマンドによって
 *       変数の値が変化します。
 *
 *     ・ゲージ残量は最大値より多くなることはなく、
 *       0より小さくなることもありません。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、何も変化しません。
 *
 *   プラグイン → Egauge set [イベントID] [数字]
 *   スクリプト → $gameMap.setGaugeValue([イベントID], [数字]);
 *     ・指定した[イベントID]のゲージ残量を指定した[数字]に設定します。
 *       ([数字]は0以上の値を指定してください。
 *        また、ゲージ最大値より残量が多くなることはありません)
 *
 *     ・変数によってゲージ残量が決められている場合、このコマンドによって
 *       変数の値が変化する場合があります。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、何も変化しません。
 *
 *   プラグイン → Egauge maxset [イベントID] [数字]
 *   スクリプト → $gameMap.setGaugeMaxValue([イベントID], [数字]);
 *     ・指定した[イベントID]のゲージ最大値を指定した[数字]に設定します。
 *       ([数字]は0より大きい値を指定してください)
 *
 *     ・ゲージ最大値がゲージ残量を下回る場合、このコマンドによって
 *       ゲージ残量がゲージ最大値と同じになります。
 *
 *     ・変数によってゲージ残量が決められている場合、このコマンドによって
 *       変数の値が変化する場合があります。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、何も変化しません。
 *
 *
 * 補足：
 *   ・このプラグインに関するメモ欄の設定、プラグインコマンド/パラメーター、
 *     制御文字は大文字/小文字を区別していません。
 *
 *   ・プラグインパラメーターの説明に、[初期値]と書かれているものは
 *     アクター/イベントのメモ欄で個別に設定が可能です。
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
 *     可能性がありますが、バージョンアップにより本プラグインの仕様が
 *     変更される可能性があります。
 *     ご了承ください。
 *
 *
 * @param Gauge_Width
 * @desc ゲージの長さを数値で指定してください。
 * @default 40
 *
 * @param Gauge_Height
 * @desc ゲージの高さを数値で指定してください。
 * @default 10
 *
 * @param Gauge_Offset_X
 * @desc ゲージX座標をズラして表示する場合は指定してください。(プラス値で右へ、マイナス値で左に)
 * @default 0
 *
 * @param Gauge_Offset_Y
 * @desc ゲージY座標をズラして表示する場合は指定してください。(プラス値で下へ、マイナス値で上に)
 * @default 0
 *
 * @param Gauge_Visible
 * @desc 初めからゲージを表示しておく場合はON、後から表示させる場合はOFFを指定してください。
 * @default ON
 *
 * @param Gauge_Color_1
 * @desc ゲージの表示色番号を指定してください。(実際に表示される色はsystem/Window.pngを参照してください)
 * @default 20
 *
 * @param Gauge_Color_2
 * @desc ゲージの表示色番号を指定してください。(この項目はグラデーション用です)
 * @default 21
 *
 * @param Gauge_Back_Color
 * @desc ゲージ背景の表示色番号を指定してください。(ゲージ全体が背景色で塗られ、残量分がゲージ表示色で塗られます)
 * @default 19
 *
*/

var Imported = Imported || {};
Imported.MKR_EventGauge = true;

(function () {
    'use strict';
    var PN, Params;
    PN = "MKR_EventGauge";

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
                    } else {
                        value = value.toUpperCase() === "ON" || value.toUpperCase() === "TRUE" || value.toUpperCase() === "1";
                    }
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
    };

    var GetMeta = function(meta, name, sep) {
        var value, values, i, count;
        value = "";
        values = [];
        name = name.toLowerCase().trim();

        Object.keys(meta).forEach(function(key) {
            if(key.toLowerCase().trim() == name) {
                value = meta[key].trim();
                return false;
            }
        });

        if(sep !== undefined && sep != "" && value != "") {
            values = value.split(sep);
            count = values.length;
            values = values.map(function(elem) {
                return elem.trim();
            });

            return values;
        }

        return value;
    };

    Params = {
        "GaugeW" : CheckParam("num", "Gauge_Width", 40, 0),
        "GaugeH" : CheckParam("num", "Gauge_Height", 10, 0),
        "GaugeOX" : CheckParam("num", "Gauge_Offset_X", 0),
        "GaugeOY" : CheckParam("num", "Gauge_Offset_Y", 0),
        "GaugeVisible" : CheckParam("bool", "Gauge_Visible", true),
        "GaugeColor1" : CheckParam("num", "Gauge_Color_1", 20, 0,31),
        "GaugeColor2" : CheckParam("num", "Gauge_Color_2", 21, 0, 31),
        "GaugeBackColor" : CheckParam("num", "Gauge_Back_Color", 19, 0, 31),
    };


    //=========================================================================
    // Game_Interpreter
    //  ・プラグイン用コマンドを定義します。
    //
    //=========================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        var eventId, value;
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === "egauge") {
            eventId = isFinite(args[1]) ? parseInt(args[1], 10) : 0;
            value = args[2];
            switch (args[0].toLowerCase()) {
                case "show":
                    $gameMap.showGaugeWindow(eventId);
                    break;
                case "hide":
                    $gameMap.hideGaugeWindow(eventId);
                    break;
                case "add":
                    $gameMap.addGaugeValue(eventId, value);
                    break;
                case "set":
                    $gameMap.setGaugeValue(eventId, value);
                    break;
                case "maxset":
                    $gameMap.setGaugeMaxValue(eventId, value);
                    break;
            }
        }
    };


    //=========================================================================
    // Window_Gauge
    //  ・ゲージウィンドウを定義します。
    //
    //=========================================================================
    function Window_Gauge() {
        this.initialize.apply(this, arguments);
    }

    Window_Gauge.prototype = Object.create(Window_Base.prototype);
    Window_Gauge.prototype.constructor = Window_Gauge;

    Window_Gauge.prototype.initialize = function(character) {
        var x, y, width, height;
        width = this.windowWidth();
        height = this.windowHeight();
        x = character.screenX() - width / 2;
        y = character.screenY();

        Window_Base.prototype.initialize.call(this, x, y, width, height);

        this.initMembers();
        this.setCharacter(character);

        if(!Params.GaugeVisible[0]) {
            this.hideGauge();
            this.hide();
        }
    };

    Window_Gauge.prototype.initMembers = function() {
        this._character = null;
        this._gaugeNum = $gameMap.countGaugeWindow();
        this._hide = false;
        this.opacity = 0;
    };

    Window_Gauge.prototype.hideGauge = function() {
        this._hide = true;
    };

    Window_Gauge.prototype.showGauge = function() {
        this._hide = false;
    };

    Window_Gauge.prototype.windowWidth = function() {
        return Params.GaugeW[0] + this.standardPadding() * 2;
    };

    Window_Gauge.prototype.windowHeight = function() {
        return Params.GaugeH[0] + this.standardPadding() * 2;
    };

    Window_Gauge.prototype.setCharacter = function(character) {
        this._character = character;
    };

    Window_Gauge.prototype.getCharacter = function() {
        return this._character;
    };

    Window_Gauge.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this.updateGauge();
        this.updatePosition();
        this.updateVisibility();
    };

    Window_Gauge.prototype.updateVisibility = function() {
        var chara;
        chara = this._character;

        if (this._hide || chara.isTransparent() || chara.characterName() == "" || !$gameMap.getGaugeWindow(this._gaugeNum)) {
            this.hide();
        } else if(!this._hide) {
            this.show();
        }

        if(chara._erased) {
            $gameMap.delGaugeWindow(this._gaugeNum);
            this.parent.removeChild(this);
        }
    };

    Window_Gauge.prototype.updateGauge = function() {
        var color1, color2, backColor, width, height, fillW;
        width = Params.GaugeW[0];
        height = Params.GaugeH[0];
        color1 = this.textColor(Params.GaugeColor1[0]);
        color2 = this.textColor(Params.GaugeColor2[0]);
        backColor = this.textColor(Params.GaugeBackColor[0]);
        fillW = Math.floor(width * this._character.gaugeRate());

        this.contents.clear();
        this.contents.fillRect(0, 0, width, height, backColor);
        this.contents.gradientFillRect(0, 0, fillW, height, color1, color2);
    };

    Window_Gauge.prototype.updatePosition = function() {
        this.x = this._character.screenX() - this.width / 2 + Params.GaugeOX[0];
        this.y = this._character.screenY() + Params.GaugeOY[0];
        this.z = this._character.screenZ();
    };


    //=========================================================================
    // Spriteset_Map
    //  ・イベントにゲージウィンドウを追加する処理を定義します。
    //
    //=========================================================================
    var _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        _Spriteset_Map_createLowerLayer.call(this);
        this.createGaugeWindow();
    };

    Spriteset_Map.prototype.createGaugeWindow = function() {
        var index;

        $gameMap.events().forEach(function(event) {
            if(event && GetMeta(event.event().meta, "egauge") != "") {
                index = $gameMap.addGaugeWindow(new Window_Gauge(event));
                event.setGaugeNum(index);
                this.addChild($gameMap.getGaugeWindow(index));
            }
        }, this);
    };


    //=========================================================================
    // Game_Map
    //  ・ウィンドウゲージ群を保持する処理を定義します。
    //  ・プラグイン用コマンドを定義します。
    //
    //=========================================================================
    var _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);

        this._gaugeWindows = [];
    }

    Game_Map.prototype.getGaugeWindow = function(index) {
        if(index < 0 || index > this._gaugeWindows.length) {
            return null;
        }
        return this._gaugeWindows[index];
    }

    Game_Map.prototype.countGaugeWindow = function() {
        if(this._gaugeWindows) {
            return this._gaugeWindows.length;
        }
        return 0;
    }

    Game_Map.prototype.addGaugeWindow = function(gaugeWindow) {
        this._gaugeWindows.push(gaugeWindow);
        return this._gaugeWindows.length - 1;
    }

    Game_Map.prototype.delGaugeWindow = function(index) {
        if(index >= 0 && index < this._gaugeWindows.length) {
            this._gaugeWindows[index].getCharacter().delMember();
            this._gaugeWindows[index] = null;
        }
    }

    Game_Map.prototype.showGaugeWindow = function(eventId) {
        var gaugeNum;
        gaugeNum = -1;

        if(eventId > 0) {
            gaugeNum = this.event(eventId).getGaugeNum();
            this.getGaugeWindow(gaugeNum).showGauge();
        }
    }

    Game_Map.prototype.hideGaugeWindow = function(eventId) {
        var gaugeNum;
        gaugeNum = -1;

        if(eventId > 0) {
            gaugeNum = this.event(eventId).getGaugeNum();
            this.getGaugeWindow(gaugeNum).hideGauge();
        }
    }

    Game_Map.prototype.addGaugeValue = function(eventId, value) {
        if(eventId > 0) {
            this.event(eventId).addGaugeValue(value);
        }
    }

    Game_Map.prototype.setGaugeValue = function(eventId, value) {
        if(eventId > 0) {
            this.event(eventId).setGaugeValue(value);
        }
    }

    Game_Map.prototype.setGaugeMaxValue = function(eventId, value) {
        if(eventId > 0) {
            this.event(eventId).setGaugeMaxValue(value);
        }
    }


    //=========================================================================
    // Game_Event
    //  ・イベントの追加メンバーを定義します。
    //
    //=========================================================================
    var _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);

        if(GetMeta(this.event().meta, "egauge") != "") {
            this.addMembers();
        }
    };

    Game_Event.prototype.addMembers = function() {
        var vr, value, metas;

        this._gauge = 0;
        this._gaugeMax = 0;
        this._gaugeNum = -1;
        this._gaugeVr = 0;
        this._gaugeType = "num";

        metas = GetMeta(this.event().meta, "egauge", " ");

        if(metas && metas.length) {
            metas.forEach(function(meta) {
                meta = meta.trim();
                if(/^vr(\d+)$/.test(meta)) {
                    vr = isFinite(RegExp.$1) ? parseInt(RegExp.$1, 10) : 0;
                    if(vr > 0) {
                        this._gaugeVr = vr;
                        this._gaugeType = "vr";
                        value = $gameVariables.value(vr);
                        if(isFinite(value)) {
                            this._gaugeMax = parseInt(value, 10);
                        }
                    }
                }
            }, this);
        }
    };

    Game_Event.prototype.gaugeEnable = function() {
        return this._gaugeType !== undefined;
    }

    Game_Event.prototype.gaugeRate = function() {
        var value, maxValue;

        value = this.getGaugeValue();
        maxValue = this.getGaugeMaxValue();
        if(maxValue == 0) {
            return 0;
        }
        return value / maxValue;
    };

    Game_Event.prototype.setGaugeNum = function(index) {
        if(this.gaugeEnable()) {
            this._gaugeNum = index;
        }
    }

    Game_Event.prototype.getGaugeNum = function() {
        var value;
        value = 0;

        if(this.gaugeEnable()) {
            value = this._gaugeNum;
        }
        return value;
    }

    Game_Event.prototype.addGaugeValue = function(value) {
        var gameValue;
        value = isFinite(value) ? parseInt(value, 10) : 0;

        if(this.gaugeEnable()) {
            gameValue = this.getGaugeValue();

            if(value != 0 && gameValue + value >= 0 && gameValue + value <= this.getGaugeMaxValue() ) {
                if(this._gaugeType == "vr") {
                    $gameVariables.setValue(this._gaugeVr, gameValue + value);
                }
            }
        }
    }

    Game_Event.prototype.setGaugeValue = function(value) {
        var maxValue;
        value = isFinite(value) ? parseInt(value, 10) : -1;

        if(this.gaugeEnable()) {
            maxValue = this.getGaugeMaxValue();

            if(value >= 0 && maxValue >= value) {
                if(this._gaugeType == "vr") {
                    $gameVariables.setValue(this._gaugeVr, value);
                }
            }
        }
    }

    Game_Event.prototype.getGaugeValue = function() {
        var value;
        value = 0;

        if(this.gaugeEnable()) {
            if(this._gaugeType == "vr") {
                value = $gameVariables.value(this._gaugeVr);
            }
        }

        return value;
    }

    Game_Event.prototype.setGaugeMaxValue = function(value) {
        var gameValue;
        value = isFinite(value) ? parseInt(value, 10) : 0;

        if(this.gaugeEnable()) {
            if(value > 0) {
                if(this._gaugeType == "vr") {
                    gameValue = $gameVariables.value(this._gaugeVr);
                    if(value < gameValue) {
                        $gameVariables.setValue(this._gaugeVr, value);
                    }
                }
                this._gaugeMax = value;
            }
        }
    }

    Game_Event.prototype.getGaugeMaxValue = function() {
        var value;
        value = 0;

        if(this.gaugeEnable()) {
            value = this._gaugeMax
        }

        return value;
    }

    Game_Event.prototype.delMember = function() {
        if(this._gauge !== undefined) {
            delete this._gauge;
        }
        if(this._gaugeMax !== undefined) {
            delete this._gaugeMax;
        }
        if(this._gaugeNum !== undefined) {
            delete this._gaugeNum;
        }
        if(this._gaugeVr !== undefined) {
            delete this._gaugeVr;
        }
        if(this._gaugeType !== undefined) {
            delete this._gaugeType;
        }
    }

})();