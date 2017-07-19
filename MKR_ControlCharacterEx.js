//===============================================================================
// MKR_ControlCharacterEx.js
//===============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.2.0 2017/07/19 制御文字「\im[n]」を追加、文中アイコンの余白を指定可能に。
//
// 1.1.4 2016/10/16 制御文字「\me[n]」を追加、文中でMEを再生可能に。
//
// 1.1.3 2016/08/24 ・制御文字「\$」で表示される
//                    所持金ウィンドウの位置を変更可能に。
//                  ・上記対応のためプラグインパラメーター追加。
//
// 1.1.2 2016/08/24 制御文字「\$[n]」を追加。
//
// 1.1.1 2016/08/17 制御文字「\n」「\p」の表示に「\c」の色を自動で付与可能に。
//
// 1.1.0 2016/07/27 制御文字「\.」「\|」のウェイト時間を指定可能に。
//
// 1.0.1 2016/07/22 一部制御文字が動作しなくなるバグを修正。
//
// 1.0.0 2016/07/21 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.2.0) 制御文字拡張プラグイン
 * @author マンカインド
 *
 * @help = 制御文字拡張プラグイン ver 1.2.0 = (作:マンカインド)
 * メッセージ内で利用可能な制御文字を追加/拡張します。
 *
 *
 * 新規追加した制御文字:
 *   \IM[アイコン右余白]
 *     ・この制御文字の後から表示されるアイコンの右余白をpx単位で設定します。
 *
 *       余白は数値で指定、または制御文字の\v[n]を利用可能です。
 *
 *       なお、ここでの余白設定は
 *       プラグインパラメータで指定できる初期値よりも優先されます。
 *
 *       余白設定はメッセージウィンドウが開かれている間、持続します。
 *       1度ウィンドウが閉じられると、余白はプラグインパラメーターの設定に
 *       戻ります。
 *
 *   \SE[SE名,SE音量,SEピッチ,SE位相]
 *     ・メッセージ表示中にSEを演奏します。
 *       SE名は必須です。
 *       audio/se/配下にあるSEファイル名(拡張子は除く)を指定してください。
 *
 *       音量、ピッチ、位相は数値で指定、または
 *       制御文字の\v[n]を利用可能です。
 *
 *       なお、ここでの音量、ピッチ、位相設定は
 *       プラグインパラメータで指定できる初期値よりも優先されます。
 *
 *       音量、ピッチ、位相を初期値のまま使用する場合は、
 *       SE名のみ指定してください。
 *       (音量のみを指定して、残りを初期設定値で再生させることも可能です)
 *
 *   \ME[ME名,ME音量,MEピッチ,ME位相]
 *     ・メッセージ表示中にMEを演奏します。
 *       ME名は必須です。
 *       audio/me/配下にあるMEファイル名(拡張子は除く)を指定してください。
 *
 *       音量、ピッチ、位相は数値で指定、または
 *       制御文字の\v[n]を利用可能です。
 *
 *       なお、ここでの音量、ピッチ、位相設定は
 *       プラグインパラメータで指定できる初期値よりも優先されます。
 *
 *       音量、ピッチ、位相を初期値のまま使用する場合は、
 *       ME名のみ指定してください。
 *       (音量のみを指定して、残りを初期設定値で再生させることも可能です)
 *
 *   \$[X,Y]
 *     ・メッセージ中に挿入すると、画面右上に所持金ウィンドウを表示します。
 *       本プラグインでは、所持金ウィンドウの背景をメッセージウィンドウと
 *       同じく選択可能にしました。
 *
 *       Xには0～2の数値、または制御文字の\v[n]を指定してください。
 *       Xが0で所持金ウィンドウを通常表示(デフォルト設定)、
 *       1で暗くして表示、2で透明表示します。
 *
 *       Yには0～8の数値、または制御文字の\v[n]を指定してください。
 *       Yが0で所持金ウィンドウを画面左上に表示、1で左中央、2で左下、
 *       3で上中央、4で中央、5で下中央、6で右上(デフォルト)、
 *       7で右中央、8で右下に表示されます。
 *
 *
 * 機能を拡張した制御文字：
 *   \.
 *     ・メッセージ中に挿入すると、その位置で15フレーム待機してから
 *       続きのメッセージを表示する制御文字です。
 *       本プラグインでは、待機フレーム数をプラグインパラメーターで
 *       指定できます。
 *
 *   \|
 *     ・メッセージ中に挿入すると、その位置で60フレーム待機してから
 *       続きのメッセージを表示する制御文字です。
 *       本プラグインでは、待機フレーム数をプラグインパラメーターで
 *       指定できます。
 *
 *   \n[X]
 *     ・メッセージ中に挿入すると、アクターID:Xの名前に置き換わる制御文字です。
 *       本プラグインでは、名前の部分に自動的に色をつけて表示します。
 *       (つまり、\c[2]\n[X]\c[0] のように制御文字\cで囲むのと同じ状態ですが、
 *        この制御文字の記述を\n[X]単体で済ますことができます)
 *
 *       つける色はプラグインパラメーターで指定できます。
 *
 *       この制御文字の直前に色変更の制御文字が記述されていた場合は、
 *       本プラグインによる色変更を行わず、直前に記述されている
 *       色変更の制御文字に従い色が変更されます。
 *
 *   \p[X]
 *     ・メッセージ中に挿入すると、パーティーメンバーX番目の
 *       アクターの名前に置き換わる制御文字です。
 *       本プラグインでは、自動的に名前の部分に色をつけて表示します。
 *       (つまり、\c[2]\p[X]\c[0] のように制御文字\cで囲むのと同じ状態ですが、
 *        この制御文字の記述を\p[X]単体で済ますことができます)
 *
 *       つける色はプラグインパラメーターで指定できます。
 *
 *       この制御文字の直前に色変更の制御文字が記述されていた場合は、
 *       本プラグインによる色変更を行わず、直前に記述されている
 *       色変更の制御文字に従い色が変更されます。
 *
 *   \$
 *     ・メッセージ中に挿入すると、画面右上に所持金ウィンドウを表示します。
 *
 *       本プラグインでは、プラグインパラメーター[Default_Gold_Background]に
 *       指定されている数値または制御文字の\v[n]によって
 *       ウィンドウの背景が自動的に変更されるようになります。
 *
 *       数値が0で所持金ウィンドウを通常表示(デフォルト設定)、
 *       1で暗くして表示、2で透明表示します。
 *
 *       また、プラグインパラメーター[Default_Gold_Potision]によって
 *       ウィンドウの位置が変更可能です。
 *
 *       値は数値の0～8、または制御文字の\v[n]を指定してください。
 *       0で所持金ウィンドウを画面左上に表示、1で左中央、2で左下、
 *       3で上中央、4で中央、5で下中央、6で右上(デフォルト)、
 *       7で右中央、8で右下に表示されます。
 *
 *
 *
 * 制御文字の設定例:
 *   \se[Cat,20,100,0]
 *     ・猫のSEを音量20、ピッチ100、位相0で再生します。
 *
 *   \SE[Bell1]
 *     ・ベル1のSEを初期値の設定で再生します。
 *
 *   \SE[Coin,\v[20]]
 *     ・コインのSEを音量[変数20番に格納されている数値]、
 *       他は初期値の設定を使い再生します。
 *
 *   \ME[Fanfare1]
 *     ・ファンファーレ1のMEを初期値の設定で再生します。
 *
 *   \$[1]
 *     ・所持金ウィンドウを背景を暗くした状態で画面右上に表示します。
 *
 *
 * プラグインコマンド:
 *    ありません。
 *
 *
 * スクリプトコマンド:
 *    ありません。
 *
 *
 * 補足：
 *   ・このプラグインに関するメモ欄の設定、プラグインコマンド、
 *     制御文字は大文字/小文字を区別していません。
 *     ですが、SEファイル名を指定する部分は念のため実際のファイル名と
 *     名前を合せておくことを推奨します。
 *
 *   ・プラグインパラメーターの説明に、[初期値]と書かれているものは
 *     一部の制御文字にて個別設定が可能です。
 *     設定した場合、[初期値]より制御文字の設定が
 *     優先されますのでご注意ください。
 *
 *   ・プラグインパラメーターの説明に、[変数可]と書かれているものは
 *     設定値に変数の制御文字である\v[n]を使用可能です。
 *     変数を設定した場合、そのパラメーターの利用時に変数の値を
 *     参照するため、パラメーターの設定をゲーム中に変更できます。
 *
 *
 * 利用規約:
 *    ・作者に無断で本プラグインの改変、再配布が可能です。
 *      (ただしヘッダーの著作権表示部分は残してください。)
 *
 *    ・利用形態(フリーゲーム、商用ゲーム、R-18作品等)に制限はありません。
 *      ご自由にお使いください。
 *
 *    ・本プラグインを使用したことにより発生した問題について作者は一切の責任を
 *      負いません。
 *
 *    ・要望などがある場合、本プラグインのバージョンアップを行う
 *      可能性がありますが、
 *      バージョンアップにより本プラグインの仕様が変更される可能性があります。
 *      ご了承ください。
 *
 * ==============================================================================
 *
 * @param Default_SE_Volume
 * @desc [初期値:変数可] 制御文字 \SE 使用時に再生するSEの音量です。
 * @type string
 * @default 90
 *
 * @param Default_SE_Pitch
 * @desc [初期値:変数可] 制御文字 \SE 使用時に再生するSEのピッチです。
 * @type string
 * @default 100
 *
 * @param Default_SE_Pan
 * @desc [初期値:変数可] 制御文字 \SE 使用時に再生するSEの位相です。
 * @type string
 * @default 0
 *
 * @param Default_ME_Volume
 * @desc [初期値:変数可] 制御文字 \ME 使用時に再生するMEの音量です。
 * @type string
 * @default 90
 *
 * @param Default_ME_Pitch
 * @desc [初期値:変数可] 制御文字 \ME 使用時に再生するMEのピッチです。
 * @type string
 * @default 100
 *
 * @param Default_ME_Pan
 * @desc [初期値:変数可] 制御文字 \ME 使用時に再生するSEの位相です。
 * @type string
 * @default 0
 *
 * @param Default_Wait_Period
 * @desc [変数可] 制御文字 \. 使用時に待機するフレーム数です。デフォルト15フレーム(15フレーム=1/4秒)
 * @type string
 * @default 15
 *
 * @param Default_Wait_Line
 * @desc [変数可] 制御文字 \| 使用時に待機するフレーム数です。デフォルト60フレーム(60フレーム=1秒)
 * @type string
 * @default 60
 *
 * @param Default_Name_Color
 * @desc [変数可] 制御文字 \N[n] または \P[n] 使用時に名前部分につける色の番号です。番号でつく色は制御文字 \C[n] を参考にしてください。
 * @type string
 * @default 0
 *
 * @param Default_Icon_Margin
 * @desc [変数可] 制御文字 \I[n] または \p 使用時に名前部分につける色の番号です。番号でつく色は制御文字 \C[n] を参考にしてください。
 * @type string
 * @default 0
 *
 * @param Default_Gold_Background
 * @desc [初期値:変数可] 制御文字 \$ 使用時に表示する所持金ウィンドウの背景を指定します。(0:ウィンドウ 1:暗くする 2:透明)
 * @type string
 * @default 0
 *
 * @param Default_Gold_Position
 * @desc [初期値:変数可] 制御文字 \$ 使用時に表示する所持金ウィンドウの位置を指定します。詳細はヘルプを確認してください。
 * @type string
 * @default 6
 *
 * @param Message_Icon_Margin
 * @desc [初期値] 制御文字 \I[n] 使用時に表示されるアイコンの余白を指定します。
 * @type number
 * @decimals 0
 * @min 0
 * @default 4
 *
 * ==============================================================================
*/

var Imported = Imported || {};
Imported.MKR_ControlCharacterEx = true;

(function () {
    'use strict';

    var PN = "MKR_ControlCharacterEx";

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

        regExp = /(\x1bV|\x1bN)\[\d+\]/i;
        if(!regExp.test(value)) {
            switch(type) {
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
                default:
                    throw new Error("[CheckParam] " + param + "のタイプが不正です: " + type);
                    break;
            }
        }

        return [value, type, def, min, max, param];
    };

    var CEC = function(params) {
        var text, value, type, def, min, max, param;
        type = params[1];
        text = String(params[0]);
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        type = params[1];
        def = params[2];
        min = params[3];
        max = params[4];
        param = params[5];

        text = text.replace(/\x1bV\[\d+\]/i, function() {
            return String(ConvVb(text));
        }.bind(this));

        switch(type) {
            case "num":
                value = (isFinite(text))? parseInt(text, 10) : (isFinite(def))? parseInt(def, 10) : 0;
                value = value.clamp(min, max);
                break;
            case "string":
                if(text == "") {
                    value = (def != "")? def : value;
                } else {
                    value = text;
                }
                break;
            default:
                throw new Error("[CEC] " + param + "のタイプが不正です: " + type);
                break;
        }

        return value;
    };

    var ConvVb = function(text) {
        var num;

        if(typeof text == "string") {
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
    };

    var DefSeVolume, DefSePitch, DefSePan, DefWaitPeriod, DefWaitLine, DefNameColor,
        DefGoldBackground, DefGoldPosition,
        DefMeVolume, DefMePitch, DefMePan, MesIconMargin;
    DefSeVolume = CheckParam("num", "Default_SE_Volume", 90, 20, 100);
    DefSePitch = CheckParam("num", "Default_SE_Pitch", 100, 50, 150);
    DefSePan = CheckParam("num", "Default_SE_Pan", 0, -100, 100);
    DefWaitPeriod = CheckParam("num", "Default_Wait_Period", 15, 0);
    DefWaitLine = CheckParam("num", "Default_Wait_Line", 60, 0);
    DefNameColor = CheckParam("num", "Default_Name_Color", 0, 0);
    DefGoldBackground = CheckParam("num", "Default_Gold_Background", 0, 0, 2);
    DefGoldPosition = CheckParam("num", "Default_Gold_Position", 0, 0, 8);
    DefMeVolume = CheckParam("num", "Default_ME_Volume", 90, 20, 100);
    DefMePitch = CheckParam("num", "Default_ME_Pitch", 100, 50, 150);
    DefMePan = CheckParam("num", "Default_ME_Pan", 0, -100, 100);
    MesIconMargin = CheckParam("num", "Message_Icon_Margin", 4, 0);


    //=========================================================================
    // Game_Message
    //  設定保持用変数を定義します。
    //
    //=========================================================================
    var _Game_Message_clear = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        _Game_Message_clear.call(this);

        this._iconMargin = MesIconMargin[0];
    };

    Game_Message.prototype.iconMargin = function() {
        return this._iconMargin;
    };

    Game_Message.prototype.setIconMargin = function(margin) {
        this._iconMargin = margin;
    };


    //=========================================================================
    // Window_Base
    //  制御文字を追加定義します。
    //
    //=========================================================================
    var _Window_Base_obtainEscapeCode = Window_Base.prototype.obtainEscapeCode;
    Window_Base.prototype.obtainEscapeCode = function(textState) {
        var regExp, arr;
        textState.index++;
        regExp = /^(SE|\$|ME|IM)\[.*?\]/i;
        arr = regExp.exec(textState.text.slice(textState.index));

        if (arr) {
            textState.index += arr[0].length;
            return arr[0];
        } else {
            textState.index--;
            return _Window_Base_obtainEscapeCode.call(this, textState);
        }
    };

    var _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        var nameColor;
        nameColor = CEC(DefNameColor);

        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');

        text = text.replace(/\x1bC\[(\d+)\]\x1bN\[(\d+)\]/gi, function() {
            return '\x1bC['+parseInt(arguments[1])+']'+this.actorName(parseInt(arguments[2]))+'\x1bC[0]';
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            return '\x1bC['+nameColor+']'+this.actorName(parseInt(arguments[1]))+'\x1bC[0]';
        }.bind(this));

        text = text.replace(/\x1bC\[(\d+)\]\x1bP\[(\d+)\]/gi, function() {
            return '\x1bC['+parseInt(arguments[1])+']'+this.partyMemberName(parseInt(arguments[2]))+'\x1bC[0]';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            return '\x1bC['+nameColor+']'+this.partyMemberName(parseInt(arguments[1]))+'\x1bC[0]';
        }.bind(this));

        return _Window_Base_convertEscapeCharacters.call(this,text);
    };

    var _Window_Base_processDrawIcon = Window_Base.prototype.processDrawIcon;
    Window_Base.prototype.processDrawIcon = function(iconIndex, textState) {
        var x, ret, iconMargin;
        x = textState.x;
        iconMargin = $gameMessage.iconMargin();
        ret = _Window_Base_processDrawIcon.apply(this, arguments);
        textState.x = x + Window_Base._iconWidth + iconMargin;

        return ret;
    };


    //=========================================================================
    // Window_Messge
    //  制御文字を追加定義します。
    //
    //=========================================================================
    var _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        var regExp, arr, res, se, seVolume, sePitch, sePan, waitPeriod, waitLine,
            goldBackground, goldPosition, me, meVolume, mePitch, mePan, iconMargin;
        waitPeriod = CEC(DefWaitPeriod);
        waitLine = CEC(DefWaitLine);
        goldBackground = CEC(DefGoldBackground);
        goldPosition = CEC(DefGoldPosition);
        regExp = /^(SE|\$|ME|IM)(\[.*?\])?$/i;
        arr = regExp.exec(code);

        if (arr) {
            if(arr[2]) {
                arr[2] = arr[2].replace(/[\[\]]/g, "");
            }
            switch(arr[1].toUpperCase()) {
                case "SE":
                    se = {};
                    seVolume = CEC(DefSeVolume);
                    sePitch = CEC(DefSePitch);
                    sePan = CEC(DefSePan);
                    if(arr[2]) {
                        res = arr[2].split(",");
                    }
                    se["name"] = (res[0])? res[0].trim() : "";
                    se["volume"] = (isFinite(res[1]))? parseInt(res[1], 10) : seVolume;
                    se["pitch"] = (isFinite(res[2]))? parseInt(res[2], 10) : sePitch;
                    se["pan"] = (isFinite(res[3]))? parseInt(res[3], 10) : sePan;
                    AudioManager.playSe(se);
                    break;
                case "ME":
                    me = {};
                    meVolume = CEC(DefMeVolume);
                    mePitch = CEC(DefMePitch);
                    mePan = CEC(DefMePan);
                    if(arr[2]) {
                        res = arr[2].split(",");
                    }
                    me["name"] = (res[0])? res[0].trim() : "";
                    me["volume"] = (isFinite(res[1]))? parseInt(res[1], 10) : meVolume;
                    me["pitch"] = (isFinite(res[2]))? parseInt(res[2], 10) : mePitch;
                    me["pan"] = (isFinite(res[3]))? parseInt(res[3], 10) : mePan;
                    AudioManager.playMe(me);
                    break;
                case '$':
                    if(arr[2]) {
                        res = arr[2].split(",");
                        goldBackground = (res[0] && isFinite(res[0]))? parseInt(res[0], 10) : goldBackground;
                        goldPosition = (res[1] && isFinite(res[1]))? parseInt(res[1], 10) : goldPosition;
                    }
                    this._goldWindow.open(goldBackground, goldPosition, $gameMessage.positionType());
                    break;
                case 'IM':
                    console.log("IM");
                    console.log(arr);
                    if(arr[2] != "" && isFinite(arr[2])) {
                        iconMargin = parseInt(arr[2], 10);
                        if(iconMargin >= 0) {
                            $gameMessage.setIconMargin(iconMargin);
                        }
                    }
                    break;
                default:
                    _Window_Message_processEscapeCharacter.call(this, code, textState);
            }
        } else {
            switch(code) {
                case '.':
                    this.startWait(waitPeriod);
                    break;
                case '|':
                    this.startWait(waitLine);
                    break;
                default:
                    _Window_Message_processEscapeCharacter.call(this, code, textState);
            }
        }
    };


    //=========================================================================
    // Window_Gold
    //  所持金表示ウィンドウの背景/位置を変更可能にします。
    //
    //=========================================================================
    var _Window_Gold_open = Window_Gold.prototype.open;
    Window_Gold.prototype.open = function(background, positionType, messagePositionType) {
        var positionTypeX, positionTypeY;
        if(background) {
            this._background = background;
            this.setBackgroundType(this._background);
        }
        if(positionType) {
            this._positionType = positionType;
            this.setPositionType(this._positionType);
            positionTypeX = Math.floor(this._positionType / 3);
            positionTypeY = (this._positionType > 2)? this._positionType - 3 * positionTypeX : this._positionType;
            this.x = positionTypeX * (Graphics.boxWidth - this.width) / 2;
            this.y = positionTypeY * (Graphics.boxHeight - this.height) / 2;
        } else {
            this._positionType = 0;
            this.setPositionType(this._positionType);
            this.x = 0;
            this.y = 0;
        }
        _Window_Gold_open.call(this);
    };

    var _Window_Gold_initialize = Window_Gold.prototype.initialize;
    Window_Gold.prototype.initialize = function(x, y) {
        _Window_Gold_initialize.call(this, x, y);
        this._positionType = 0;
    };

    Window_Gold.prototype.positionType = function() {
        return this._positionType;
    };

    Window_Gold.prototype.setPositionType = function(positionType) {
        this._positionType = positionType;
    };

})();