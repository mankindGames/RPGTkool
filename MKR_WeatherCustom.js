//=============================================================================
// MKR_WeatherCustom.js
//=============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/06/16 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.0) 天候カスタマイズプラグイン
 * @author マンカインド
 *
 * @help = 天候カスタマイズプラグイン ver1.0.0 =
 *
 * 天候(雨、嵐、雪)に関して、プラグインコマンドを使用して以下の操作を行えます。
 *   ・天候速度の変更
 *
 *
 * プラグインコマンド:
 *   weather rainSpeed [数字]
 *     ・雨の降る速度を変更します。
 *       [数字]には1以上の整数を入れてください。デフォルト:6
 *
 *   weather stormSpeed [数字]
 *     ・嵐の速度を変更します。
 *       [数字]には1以上の整数を入れてください。デフォルト:8
 *
 *   weather snowSpeed [数字]
 *     ・雪の降る速度を変更します。
 *       [数字]には1以上の整数を入れてください。デフォルト:3
 *
 *
 * スクリプトコマンド:
 *   ありません。
 *
 *
 * 補足：
 *   ・このプラグインに関するプラグインコマンドは
 *     大文字/小文字を区別していません。
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
*/

var Imported = Imported || {};
Imported.MKR_WeatherCustom = true;

(function () {
    'use strict';

    var PN = "MKR_WeatherCustom";


    //=========================================================================
    // Game_Interpreter
    //  ・天候操作用プラグインコマンドを定義します。
    //
    //=========================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === "weather") {
            switch (args[0].toLowerCase()) {
                case "rainspeed":
                    $gameScreen.setRainSpeed(args[1]);
                    break;
                case "stormspeed":
                    $gameScreen.setStormSpeed(args[1]);
                    break;
                case "snowspeed":
                    $gameScreen.setSnowSpeed(args[1]);
                    break;
            }
        }
    };


    //=========================================================================
    // Game_Screen
    //  ・天候操作保持用変数を定義します。
    //
    //=========================================================================
    var _Game_Screen_initialize = Game_Screen.prototype.initialize;
    Game_Screen.prototype.initialize = function(){
        _Game_Screen_initialize.call(this);
        this.initWeather();
    };

    Game_Screen.prototype.initWeather = function(){
        this._rainSpeed = 6;
        this._stormSpeed = 8;
        this._snowSpeed = 3;
    };

    Game_Screen.prototype.setRainSpeed = function(speed){
        if(speed && isFinite(speed) && speed > 0) {
            this._rainSpeed = speed;
        }
    };

    Game_Screen.prototype.getRainSpeed = function(){
        return this._rainSpeed;
    };

    Game_Screen.prototype.setStormSpeed = function(speed){
        if(speed && isFinite(speed) && speed > 0) {
            this._stormSpeed = speed;
        }
    };

    Game_Screen.prototype.getStormSpeed = function(){
        return this._stormSpeed;
    };

    Game_Screen.prototype.setSnowSpeed = function(speed){
        if(speed && isFinite(speed) && speed > 0) {
            this._snowSpeed = speed;
        }
    };

    Game_Screen.prototype.getSnowSpeed = function(){
        return this._snowSpeed;
    };


    //=========================================================================
    // Weather
    //  ・天候処理を再定義します。
    //
    //=========================================================================
    var _Weather_updateRainSprite = Weather.prototype._updateRainSprite;
    Weather.prototype._updateRainSprite = function(sprite) {
        _Weather_updateRainSprite.call(this, sprite);

        var speed;
        speed = $gameScreen.getRainSpeed();

        sprite.ax -= speed * Math.sin(sprite.rotation);
        sprite.ay += speed * Math.cos(sprite.rotation);
    };

    var _Weather_updateStormSprite = Weather.prototype._updateStormSprite;
    Weather.prototype._updateStormSprite = function(sprite) {
        _Weather_updateStormSprite.call(this, sprite);

        var speed;
        speed = $gameScreen.getStormSpeed();

        sprite.ax -= speed * Math.sin(sprite.rotation);
        sprite.ay += speed * Math.cos(sprite.rotation);
    };

    var _Weather_updateSnowSprite = Weather.prototype._updateSnowSprite;
    Weather.prototype._updateSnowSprite = function(sprite) {
        _Weather_updateSnowSprite.call(this, sprite);

        var speed;
        speed = $gameScreen.getSnowSpeed();

        sprite.ax -= speed * Math.sin(sprite.rotation);
        sprite.ay += speed * Math.cos(sprite.rotation);
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
        if($gameScreen._rainSpeed == undefined) {
            $gameScreen.initWeather();
        }
    };


})();