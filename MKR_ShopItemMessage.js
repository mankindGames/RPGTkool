//===============================================================================
// MKR_ShopItemMessage.js
//===============================================================================
// (c) 2016 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.0 2018/12/03 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.0) ショップアイテムメッセージ
 * @author マンカインド
 *
 * @help = ショップアイテムメッセージ ver 1.0.0 =
 * MKR_ShopItemMessage.js
 *
 * ショップで購入時、アイテム説明文の代わりにメモ欄で指定したテキストを
 * ヘルプウィンドウに表示します。
 *
 *
 * メモ欄_アイテム:
 *   <shop_mes:表示させたいテキスト>
 *     ・shop_mes:の後に続くテキストを、アイテム説明文の代わりに
 *       ヘルプウィンドウに表示させます。
 *
 *
 * プラグインパラメーター:
 *   ありません。
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
*/

var Imported = Imported || {};
Imported.MKR_ShopItemMessage = true;

(function () {
    'use strict';

    const PN = "MKR_ShopItemMessage";

    const GetMeta = function (meta, name, sep) {
        let value, values, i, count;
        value = "";
        values = [];
        name = name.toLowerCase().trim();

        Object.keys(meta).forEach(function (key) {
            if (key.toLowerCase().trim() == name) {
                value = meta[key].trim();
                return false;
            }
        });

        if (sep !== undefined && sep != "" && value != "") {
            values = value.split(sep);
            count = values.length;
            values = values.map(function (elem) {
                return elem.trim();
            });

            return values;
        }

        return value;
    };


    //=========================================================================
    // Window_ShopBuy
    //  ・ヘルプウィンドウの更新処理を再定義します。
    //
    //=========================================================================
    const _Window_ShopBuy_updateHelp = Window_ShopBuy.prototype.updateHelp;
    Window_ShopBuy.prototype.updateHelp = function () {
        let item, text;
        item = this.item();
        text = GetMeta(item.meta, "shop_mes");

        _Window_ShopBuy_updateHelp.call(this);

        if (this._helpWindow && text) {
            this._helpWindow.setText(text);
        }
    };


})();