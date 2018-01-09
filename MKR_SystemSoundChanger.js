//===============================================================================
// MKR_SystemSoundChanger.js
//===============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.1 2018/01/09 サウンド変更時にデフォルトの設定を上書きしていたため修正。
//
// 1.0.0 2018/01/09 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.1) システムサウンド変更プラグイン
 * @author マンカインド
 *
 * @help = MKR_SystemSoundChanger.js =
 *
 * 変数の値によって再生するシステムサウンドを変更することができます。
 * (データベースの[システム]で設定できる効果音)
 *
 * 現状、以下のシステムサウンド再生を変更することができます。
 *
 *   ・戦闘から逃亡
 *
 * ※ 登録した変数の値が0、またはリスト登録数より大きい場合は
 *    デフォルトのサウンドが再生されます。
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
 *
 * @param system sound list
 * @text システムの効果音
 *
 * @param escape manage variable
 * @text [逃げる]再生管理変数
 * @desc 再生リストからサウンドを選択するときに使用する変数を指定します。
 * @type variable
 * @default 0
 * @parent system sound list
 *
 * @param escape sound list
 * @text [逃げる]再生リスト
 * @desc 再生するサウンドをリストに登録します。
 * @type file[]
 * @require 1
 * @dir audio/se
 * @parent system sound list
 *
*/

var Imported = Imported || {};
Imported.MKR_SystemSoundChanger = true;

(function () {
    'use strict';

    const PN = "MKR_SystemSoundChanger";

    const CheckParam = function(type, name, value, def, min, max, options) {
        if(min == undefined || min == null) {
            min = -Infinity;
        }
        if(max == undefined || max == null) {
            max = Infinity;
        }

        if(value == null) {
            value = "";
        } else {
            value = String(value);
        }

        value = value.replace(/\\/g, '\x1b');
        value = value.replace(/\x1b\x1b/g, '\\');

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
            case "float":
                if(value == "") {
                    value = (isFinite(def))? parseFloat(def) : 0.0;
                } else {
                    value = (isFinite(value))? parseFloat(value) : (isFinite(def))? parseFloat(def) : 0.0;
                    value = value.clamp(min, max);
                }
                break;
            case "string":
                value = value.replace(/^\"/, "");
                value = value.replace(/\"$/, "");
                if(value != null && options && options.contains("lower")) {
                    value = value.toLowerCase();
                }
                if(value != null && options && options.contains("upper")) {
                    value = value.toUpperCase();
                }
                break;
            default:
                throw new Error("[CheckParam] " + name + "のタイプが不正です: " + type);
                break;
        }

        return value;
    };

    const paramParse = function(obj) {
        return JSON.parse(JSON.stringify(obj, paramReplace));
    };

    const paramReplace = function(key, value) {
        try {
            return JSON.parse(value || null);
        } catch (e) {
            return value;
        }
    };

    const Parameters = paramParse(PluginManager.parameters(PN));
    let Params = {
        "EscapeVar" : CheckParam("num", "[逃げる]管理用変数", Parameters["escape manage variable"], 0, 0),
        "EscapeList" : Parameters["escape sound list"],
    };


    //=========================================================================
    // SoundManager
    //  ・再生するシステムサウンドを再定義します。
    //
    //=========================================================================
    const _SoundManager_playEscape = SoundManager.playEscape;
    SoundManager.playEscape = function() {
        let val, se;
        val = Params.EscapeVar > 0 ? $gameVariables._data[Params.EscapeVar] : 0;
        if($dataSystem) {
            se = JSON.stringify($dataSystem.sounds[8]);
            se = JSON.parse(se);
        } else {
            se = {
                name:"",
                pan:0,
                pitch:100,
                volume:90,
            };
        }

        if(val > 0 && Params.EscapeList.length >= val) {
            se.name = Params.EscapeList[val - 1];
            if(se.name) {
                AudioManager.playStaticSe(se);
            }
        } else {
            _SoundManager_playEscape.call(this);
        }
    };


})();