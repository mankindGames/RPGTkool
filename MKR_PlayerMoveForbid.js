//=============================================================================
// MKR_PlayerMoveForbid.js
//=============================================================================
// Copyright (c) 2016 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.3 2017/05/24 メニュー開閉フラグが正常に動作していなかったため修正
//
// 1.0.2 2017/02/19 移動禁止の間、メニュー開閉を行えるかのフラグを追加
//
// 1.0.1 2016/09/04 未使用のコードを削除しファイル容量を小さくした。
//                  デフォルト値の設定が不適切だったので修正。
//
// 1.0.0 2016/09/04 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.3) 指定された番号のスイッチがONの間、
 * プレイヤー操作によるキャラの移動を禁止します。
 *
 * @author マンカインド
 *
 * @help
 * 指定された番号のスイッチがONの間、
 * プレイヤー操作によるキャラの移動を禁止します。
 *
 *
 * 簡単な使い方説明:
 * プラグインパラメーター[Default_Move_Flag]にスイッチ番号を指定します。
 * 指定された番号のスイッチがONになっている間、
 * プレイヤー操作によるキャラの移動ができなくなります。
 * ([移動ルートの設定]コマンドなどで移動させることは可能です)
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
 * @param Default_Move_Flag
 * @desc プレイヤーの移動を禁止するスイッチの番号を指定します。
 * @default 10
 *
 * @param Default_Menu_Flag
 * @desc プレイヤーの移動を禁止している間、メニューの開閉を許可するか指定します。(許可する:true / 許可しない:false)
 * @default true
 *
 *
 * *
*/
(function () {
    'use strict';

    var PN = "MKR_PlayerMoveForbid";

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

        return [value, type, def, min, max, param];
    }

    var Params = {
        "MoveSwitch" : CheckParam("num", "Default_Move_Flag", 10, 1),
        "MenuFlg" : CheckParam("bool", "Default_Menu_Flag", true),
    };


    //=========================================================================
    // Game_System
    //  ・メニュー開閉許可処理を再定義します。
    //
    //=========================================================================
    var _Game_System_isMenuEnabled = Game_System.prototype.isMenuEnabled;
    Game_System.prototype.isMenuEnabled = function() {
        return _Game_System_isMenuEnabled.call(this)
            && ($gameSwitches.value(Params.MoveSwitch[0]) ? Params.MenuFlg[0] : true);
    };


    //=========================================================================
    // Game_Player
    //  ・プレイヤーの移動処理を再定義します。
    //
    //=========================================================================
    var _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        return _Game_Player_canMove.call(this) && !$gameSwitches.value(Params.MoveSwitch[0]);
    };

})();