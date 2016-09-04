//=============================================================================
// MKR_PlayerMoveForbid.js
//=============================================================================
// Copyright (c) 2016 mankind
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
 * @plugindesc (v1.0.1) 指定された番号のスイッチがONの間、
 * プレイヤー操作によるキャラの移動を禁止します。
 *
 * @author mankind
 *
 * @help
 * 指定された番号のスイッチがONの間、
 * プレイヤー操作によるキャラの移動を禁止します。
 *
 *
 * 簡単な使い方説明:
 * プラグインパラメーター[Default_Move_Flag]にスイッチ番号を指定します。
 * ゲーム中、指定された番号のスイッチがONになっている間
 * プレイヤー操作によるキャラの移動ができなくなります。
 * ([移動ルートの設定]などで移動させることは可能です)
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
 *
 * *
*/
(function () {
    'use strict';

    var CheckParam = function(type, param, def, min, max) {
        var Parameters, regExp, value;
        Parameters = PluginManager.parameters("MKR_PlayerMoveForbid");

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
        value = value.replace(/\x1b\x1b/g, '\\');


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
                default:
                    throw new Error('Plugin parameter type is illegal: '+type);
                    break;
            }
        }

        return [value, type, def, min, max];
    }

    var DefMoveFlag;
    DefMoveFlag = CheckParam("num", "Default_Move_Flag", 10);


    //=========================================================================
    // Game_Player
    //  ・プレイヤーの移動実行処理を再定義します。
    //
    //=========================================================================
    var _Game_Player_executeMove = Game_Player.prototype.executeMove;
    Game_Player.prototype.executeMove = function(direction) {
        var moveFlag;
        moveFlag = DefMoveFlag[0];

        if(!$gameSwitches.value(moveFlag)) {
            _Game_Player_executeMove.call(this, direction);
        }
    };

})();