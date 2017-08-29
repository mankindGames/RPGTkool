//=============================================================================
// MKR_RandomBgm.js
//===============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.0 2017/08/30 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.0) ランダムBGMプラグイン
 * @author マンカインド
 *
 * @help = ランダムBGMプラグイン ver 1.0.0 =
 * MKR_RandomBgm.js - マンカインド
 *
 * 以下のシーンで予め指定したbgmを再生します。
 * (複数指定した場合はbgmをランダムに決定し再生します)
 *
 *   ・戦闘シーン
 *
 *
 * 使い方説明:
 *   [BGMリスト]に再生に使用したいbgmを登録します。
 *   (bgmはaudio/bgm以下に格納してください)
 *
 *   [選曲対象]をOFFにすると、
 *   そのbgmはランダム再生の対象に選ばれません。
 *
 *   [ランダム再生機能]をOFFにすると初期状態でbgmのランダム再生が行われません。
 *   (ランダム再生機能のON/OFFはプラグインコマンドで切り替えられます)
 *
 *
 * [選曲対象]が全てOFFになっているなど、
 * そのシーンでランダム再生対象のbgmが1つも存在しない場合は
 * ツクールMVのbgm設定が優先されます。(データベース→システムに該当欄あり)
 *
 *
 * プラグインコマンド:
 *   RandomBgm on
 *     ・ランダム再生機能を有効にします。
 *
 *   RandomBgm on
 *     ・ランダム再生機能を無効にします。
 *
 *
 * スクリプトコマンド:
 *   ありません。
 *
 *
 * 補足：
 *   ・プラグインパラメーターの説明に、[初期値]と書かれているものは
 *     プラグインコマンドで個別に設定が可能です。
 *     設定した場合、[初期値]よりプラグインコマンドによる設定が
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
 * ==============================================================================
 *
 * @param battle_bgm_list
 * @text BGMリスト(戦闘)
 * @desc 戦闘シーンでランダム再生を行うbgmを指定します。
 * @type struct<bgm>[]
 * @default []
 *
 * @param random_enable
 * @text ランダム再生機能
 * @desc [初期値] ON:ランダム再生を有効にする。 OFF:この機能を無効にする。(デフォルト:ON)
 * @type boolean
 * @default true
 *
 * ==============================================================================
*/
/*~struct~bgm:
 *
 * @param bgm
 * @desc bgmを指定します。
 * @type file
 * @require 1
 * @dir audio/bgm
 * @default
 *
 * @param select
 * @text 選曲対象
 * @desc ON:このbgmを選曲対象とする。 OFF:選曲対象に含まない。(デフォルト:ON)
 * @type boolean
 * @default true
 *
*/

var Imported = Imported || {};
Imported.MKR_randomBgm = true;

(function () {
    'use strict';

    var PN ="MKR_RandomBgm";

    var CheckParam = function(type, name, value, def, min, max) {
        var Parameters, regExp;
        Parameters = PluginManager.parameters(PN);

        if(arguments.length < 4) {
            min = -Infinity;
            max = Infinity;
        }
        if(arguments.length < 5) {
            max = Infinity;
        }

        if(value == null) {
            value = "";
        } else {
            value = "" + value;
        }

        switch(type) {
            case "bool":
                if(value == "") {
                    value = (def)? "true" : "false";
                }
                value = value.toUpperCase() === "ON" || value.toUpperCase() === "TRUE" || value.toUpperCase() === "1";
                break;
            case "string":
                value = value;
                break;
            default:
                throw new Error("[CheckParam] " + param + "のタイプが不正です: " + type);
                break;
        }
        return value;
    };

    var paramParse = function(obj) {
        return JSON.parse(JSON.stringify(obj, paramReplace));
    }

    var paramReplace = function(key, value) {
        try {
            return JSON.parse(value || null);
        } catch (e) {
            return value;
        }
    };

    var Parameters = paramParse(PluginManager.parameters(PN));
    var Params = {};

    Params.BattleBgmList = [];
    if(Parameters["battle_bgm_list"] instanceof Array) {
        Parameters["battle_bgm_list"].forEach(function(val, idx) {
            Params.BattleBgmList[idx] = {
                "Bgm" : CheckParam("string", idx+":battle_bgm_list.bgm", val["bgm"], ""),
                "Select" : CheckParam("bool", idx+":battle_bgm_list.select", val["select"], true),
            };
        });
    }
    Params.RandomEnable = CheckParam("bool", "random_enable", Parameters["random_enable"], true);


    //=========================================================================
    // Game_Interpreter
    //  ・bgmのランダム再生に関するプラグインコマンドを定義します。
    //
    //=========================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === "randombgm") {
            switch (args[0].toLowerCase()) {
                case "on":
                    $gameSystem.enableRandomBgm();
                    break;
                case "off":
                    $gameSystem.disableRandomBgm();
                    break;
            }
        }
    };


    //=========================================================================
    // Game_System
    //  ・bgmのランダム再生機能を定義します。
    //
    //=========================================================================
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function(){
        _Game_System_initialize.call(this);
        this.mkrAddMember();
    };

    Game_System.prototype.mkrAddMember = function() {
        this._randomBgmEnable = this._randomBgmEnable != undefined ? this._randomBgmEnable : Params.RandomEnable;
        this._originalBattleBgm = null;
    };

    Game_System.prototype.enableRandomBgm = function() {
        return this._randomBgmEnable = true;
    };

    Game_System.prototype.disableRandomBgm = function() {
        return this._randomBgmEnable = false;
    };

    Game_System.prototype.isRandomBgmEnable = function() {
        return this._randomBgmEnable;
    };

    Game_System.prototype.setOriginalBattleBgm = function(bgm) {
        return this._originalBattleBgm = bgm;
    };

    Game_System.prototype.originalBattleBgm = function() {
        return this._originalBattleBgm;
    };

    var _Game_System_battleBgm = Game_System.prototype.battleBgm;
    Game_System.prototype.battleBgm = function() {
        var bgmList, num, ret;
        ret = _Game_System_battleBgm.call(this);
        bgmList = [];

        console.log("before name:%s", ret.name);
        if(this.isRandomBgmEnable()) {
            if(this.originalBattleBgm() == null) {
                bgmList = Params.BattleBgmList.filter(function(val) {
                    return val["Bgm"] != "" && val["Select"];
                });

                if(bgmList.length > 0) {
                    this.setOriginalBattleBgm(JSON.parse(JSON.stringify(ret)));
                    num = Math.floor(Math.random() * bgmList.length);
                    ret.name = bgmList[num].Bgm;
                }
            }
        }
        console.log("after name:%s", ret.name);
        console.log(this.originalBattleBgm());

        return ret;
    };


    //=========================================================================
    // Scene_Map
    //  ・BGMの設定初期化を定義します。
    //
    //=========================================================================
    var _Scene_Map_initialize = Scene_Map.prototype.initialize;
    Scene_Map.prototype.initialize = function() {
        _Scene_Map_initialize.call(this);
        $gameSystem.setBattleBgm($gameSystem.originalBattleBgm());
        $gameSystem.setOriginalBattleBgm(null);
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
        $gameSystem.mkrAddMember();
    };

})();