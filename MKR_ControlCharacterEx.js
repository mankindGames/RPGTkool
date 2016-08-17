//=============================================================================
// MKR_ControlCharacterEx.js
//=============================================================================
// Copyright (c) 2016 mankind
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2016/08/17 制御文字「\n」「\p」の表示に「\c」の色を自動で付与可能に。
// 1.1.0 2016/07/27 制御文字「\.」「\|」のウェイト時間を指定可能に。
// 1.0.1 2016/07/22 一部制御文字が動作しなくなるバグを修正。
// 1.0.0 2016/07/21 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//=============================================================================

/*:
 *
 * @plugindesc メッセージ内で使用可能な制御文字を追加/拡張します。
 * @author mankind
 *
 * @help
 * メッセージ内で利用可能な制御文字を追加/拡張します。
 *
 *
 * 新規追加した制御文字:
 *   \SE[SE名,SE音量,SEピッチ,SE位相]
 *     ・メッセージ表示中にSEを演奏します。
 *       SE名は必須です。拡張子を抜いたSEファイル名を指定してください。
 *
 *       音量、ピッチ、位相は数値で指定、または
 *       制御文字の\v[n](変数n番の数値)を利用可能です。
 *
 *       なお、ここでの音量、ピッチ、位相設定は
 *       プラグインパラメータで指定できる初期値よりも優先されます。
 *
 *       音量、ピッチ、位相を初期値のまま使用する場合は、
 *       SE名のみ指定してください。
 *       (音量のみを指定して、残りを初期設定値で再生させることも可能です)
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
 *
 * 制御文字の設定例:
 *   \se[Cat,20,100,0]
 *     ・猫の効果音を音量20、ピッチ100、位相0で再生します。
 *
 *   \SE[Bell1]
 *     ・ベル1の効果音を初期値の設定で再生します。
 *
 *   \SE[Coin,\v[20]]
 *     ・コインの効果音を音量[変数20番に格納されている数値]、
 *       他は初期値の設定を使い再生します。
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
 *
 * @param Default_SE_Volume
 * @desc [初期値:変数可] 制御文字 \SE 使用時に再生するSEの音量です。
 * @default 90
 *
 * @param Default_SE_Pitch
 * @desc [初期値:変数可] 制御文字 \SE 使用時に再生するSEのピッチです。
 * @default 100
 *
 * @param Default_SE_Pan
 * @desc [初期値:変数可] 制御文字 \SE 使用時に再生するSEの位相です。
 * @default 0
 *
 * @param Default_Wait_Period
 * @desc [変数可] 制御文字 \. 使用時に待機するフレーム数です。デフォルト15フレーム(15フレーム=1/4秒)
 * @default 15
 *
 * @param Default_Wait_Line
 * @desc [変数可] 制御文字 \| 使用時に待機するフレーム数です。デフォルト60フレーム(60フレーム=1秒)
 * @default 60
 *
 * @param Default_Name_Color
 * @desc [変数可] 制御文字 \n または \p 使用時に名前部分につける色の番号です。番号でつく色は制御文字 \c を参考にしてください。
 * @default 2
 *
 *
 * *
*/
(function () {
    'use strict';

    var CheckParam = function(type, param, def, min, max) {
        var Parameters, regExp, value;
        Parameters = PluginManager.parameters("MKR_ControlCharacterEx");


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
            throw new Error('Plugin parameter not found: '+param);
        }

        regExp = /^\x1bV\[\d+\]$/i;
        value = value.replace(/\\/g, '\x1b');

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
                        value = (def)? def : 0;
                    } else {
                        value = (isFinite(value))? parseInt(value, 10) : (def)? def : 0;
                        value = value.clamp(min, max);
                    }
                    break;
                case "string":
                    if(value == "") {
                        value = (def)? def : value;
                    }
                    break;
                default:
                    throw new Error('Plugin parameter type is illegal: '+type);
                    break;
            }
        }

        return [value, type, def, min, max];
    }

    var CEC = function(params) {
        var text, value, type, def, min, max;
        text = String(params[0]);
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        type = params[1];
        def = params[2];
        min = params[3];
        max = params[4];

        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));

        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));

        switch(type) {
            case "bool":
                if(text == "") {
                    value = (def)? true : false;
                } else {
                    value = text.toUpperCase() === "ON" || text.toUpperCase() === "TRUE" || text.toUpperCase() === "1";
                }
                break;
            case "num":
                value = (isFinite(text))? parseInt(text, 10) : (def)? def : 0;
                value = value.clamp(min, max);
                break;
            case "string":
                if(text == "") {
                    value = (def)? def : value;
                } else {
                    value = text;
                }
                break;
            default:
                throw new Error('[CEC] Plugin parameter type is illegal: '+type);
                break;
        }

        return value;
    };

    var DefSeVolume, DefSePitch, DefSePan, DefWaitPeriod, DefWaitLine, DefNameColor;
    DefSeVolume = CheckParam("num", "Default_SE_Volume", 90, 0);
    DefSePitch = CheckParam("num", "Default_SE_Pitch", 100, 0);
    DefSePan = CheckParam("num", "Default_SE_Pan", 0, 0);
    DefWaitPeriod = CheckParam("num", "Default_Wait_Period", 15, 0);
    DefWaitLine = CheckParam("num", "Default_Wait_Line", 60, 0);
    DefNameColor = CheckParam("num", "Default_Name_Color", 0, 0);


    //=========================================================================
    // Window_Base
    //  制御文字を追加定義します。
    //
    //=========================================================================
    var _Window_Base_obtainEscapeCode = Window_Base.prototype.obtainEscapeCode;
    Window_Base.prototype.obtainEscapeCode = function(textState) {
        var regExp, arr;
        textState.index++;
        regExp = /^SE\[.*?\]/i;
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

    //=========================================================================
    // Window_Messge
    //  制御文字を追加定義します。
    //
    //=========================================================================
    var _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        var regExp, arr, res, se, seVolume, sePitch, sePan, waitPeriod, waitLine;
        se = {};
        seVolume = CEC(DefSeVolume);
        sePitch = CEC(DefSePitch);
        sePan = CEC(DefSePan);
        waitPeriod = CEC(DefWaitPeriod);
        waitLine = CEC(DefWaitLine);
        regExp = /^(SE)\[(.*?)\]$/i;
        arr = regExp.exec(code);

        if (arr) {
            switch(arr[1].toUpperCase()) {
                case "SE":
                    res = arr[2].split(",");
                    se["name"] = (res[0])? res[0].trim() : "";
                    se["volume"] = (isFinite(res[1]))? parseInt(res[1],10) : seVolume;
                    se["pitch"] = (isFinite(res[2]))? parseInt(res[2],10) : sePitch;
                    se["pan"] = (isFinite(res[3]))? parseInt(res[3],10) : sePan;
                    AudioManager.playSe(se);
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

})();