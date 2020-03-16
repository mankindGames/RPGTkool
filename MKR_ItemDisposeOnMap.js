//===============================================================================
// MKR_ItemDisposeOnMap.js
//===============================================================================
// (c) 2016 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 0.1.0 2020/03/17 ・装備していない武器/防具を捨てられる機能を追加。
//                  ・アクションウィンドウを表示したときの選択位置を
//                    常に選択肢1となるように修正。
//
// 0.0.1 2020/03/14 ・初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v0.1.0) マップ上アイテム廃棄プラグイン
 * @author マンカインド
 *
 * @help = マップ上アイテム廃棄プラグイン =
 * MKR_ItemDisposeOnMap.js
 *
 * 所持しているアイテムを捨てることができるようになります。
 * (大事なものは対象外)
 *
 * 次の２つのプラグインを本プラグインより上に導入した場合、
 * 捨てたアイテムをマップ上に表示させることができます。
 *
 *   ・TemplateEvent.js - トリアコンタン様 作
 *       https://triacontane.blogspot.com/2016/06/blog-post_25.html
 *   ・EventReSpawn.js - トリアコンタン様 作
 *       https://triacontane.blogspot.com/2016/08/blog-post.html
 *
 * [捨てたアイテムをマップ上に表示させるための設定]
 * ①必要なプラグインを導入します。
 * ②テンプレートマップを作成し、
 *   [TemplateEvent.js]のプラグイン設定をします。
 * ③テンプレートマップに、捨てたアイテムをマップ配置するための
 *   イベントを作成します。プライオリティは[通常キャラの下]とします。
 * ④本プラグイン設定「アイテムイベントID」に③で作成したイベントのIDを
 *   数字で指定します。(例:EV005→5)
 *
 * ※別マップに移動した、またはマップの再読み込みが行われた場合、
 *   捨てたアイテムのイベントは消滅します。
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
 *   ・本プラグインのバージョンアップを行う可能性がありますが、
 *     バージョンアップにより本プラグインの仕様が変更される可能性があります。
 *     ご了承ください。
 *
 * ==============================================================================
 *
 * @param command
 * @text コマンド名称
 *
 * @param itemUseCommand
 * @text アイテム使用
 * @desc 選択したアイテムを使用するコマンドとして表示する文字列を設定します。
 * @default 使う
 * @parent command
 *
 * @param itemDisposeCommand
 * @text アイテム廃棄
 * @desc 選択したアイテムを廃棄するコマンドとして表示する文字列を設定します。
 * @default 捨てる
 * @parent command
 *
 * @param itemCancelCommand
 * @text アイテムキャンセル
 * @desc アイテム選択をキャンセルするコマンドとして表示する文字列を設定します。
 * @default やめる
 * @parent command
 *
 * @param itemDisposeSe
 * @text アイテム廃棄時SE
 * @desc アイテムを廃棄する際に再生するSEを設定します。(未設定=SEを再生しません)
 * @type struct<se>
 *
 * @param itemEventId
 * @text アイテムイベントID
 * @desc テンプレートマップのアイテムイベントIDを設定します。捨てたアイテムをマップ上に表示しない場合は不要です。
 * @type number
 * @min 0
 * @default 0
 *
 * @param enableWeaponDispose
 * @text 武器を捨てられる？
 * @desc 装備していない武器を捨てられるようにする設定です。
 * @type boolean
 * @on 捨てられる
 * @off 捨てられない
 * @default false
 *
 * @param enableArmorDispose
 * @text 防具を捨てられる？
 * @desc 装備していない防具を捨てられるようにする設定です。
 * @type boolean
 * @on 捨てられる
 * @off 捨てられない
 * @default false
 *
*/
/*~struct~se:
 *
 * @param name
 * @text ファイル名
 * @desc 再生するファイルを指定します。デフォルト:空(再生しない)
 * @type file
 * @require 1
 * @dir audio/se
 *
 * @param volume
 * @text 再生時音量
 * @desc ファイルを再生するときの音量を指定します(0から100までの数値)。デフォルト:90
 * @type number
 * @max 100
 * @min 0
 * @default 90
 *
 * @param pitch
 * @text 再生時ピッチ
 * @desc ファイルを再生するときのピッチを指定します(50から150までの数値)。デフォルト:100
 * @type number
 * @max 150
 * @min 50
 * @default 100
 *
 * @param pan
 * @text 再生時位相
 * @desc ファイルを再生するときの位相を指定します(-100から100までの数値)。デフォルト:0
 * @type number
 * @max 100
 * @min -100
 * @default 0
 *
*/
var Imported = Imported || {};
Imported.MKR_ItemDisposeOnMap = true;

(function () {
    'use strict';

    const PN = "MKR_ItemDisposeOnMap";

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
                    value = (def)? "TRUE" : "FALSE";
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
                throw new Error("[CheckParam] " + param + "のタイプが不正です: " + type);
                break;
        }

        return value;
    };

    const ParamParse = function(obj) {
        return JSON.parse(JSON.stringify(obj, ParamReplace));
    }

    const ParamReplace = function(key, value) {
        try {
            return JSON.parse(value || null);
        } catch (e) {
            return value;
        }
    };

    const Parameters = ParamParse(PluginManager.parameters(PN));
    let Params = {};

    Params = {
        "command" : {
            "itemUse"         : CheckParam("string", "itemUseCommand",       Parameters["itemUseCommand"],      "使う"),
            "itemDispose"     : CheckParam("string", "itemDisposeCommand",   Parameters["itemDisposeCommand"],  "捨てる"),
            "itemCancel"      : CheckParam("string", "itemCancelCommand",    Parameters["itemCancelCommand"],   "使う"),
        },
        "eventId"             : CheckParam("num",    "itemEventId",          Parameters["itemEventId"], 0, 0),
        "enableWeaponDispose" : CheckParam("bool",   "enableWeaponDispose",  Parameters["enableWeaponDispose"], false),
        "enableArmorDispose"  : CheckParam("bool",   "enableArmorDispose",   Parameters["enableArmorDispose"],  false),
    };
    if(Parameters["itemDisposeSe"]) {
        Params["itemDisposeSe"] = {
            "itemDisposeSe" : {
                "name"        : CheckParam("string", "itemDisposeSe.name",   Parameters["itemDisposeSe"]["name"],   ""),
                "volume"      : CheckParam("num",    "itemDisposeSe.volume", Parameters["itemDisposeSe"]["volume"], 90,   0, 100),
                "pitch"       : CheckParam("num",    "itemDisposeSe.pitch",  Parameters["itemDisposeSe"]["pitch"],  100, 50, 150),
                "pan"         : CheckParam("num",    "itemDisposeSe.pan",    Parameters["itemDisposeSe"]["pan"],    0, -100, 100),
            },
        };
    }

    // アクションウィンドウの行数_アイテムの場合
    const visibleRowItem  = 3;
    // アクションウィンドウの行数_武器/防具の場合
    const visibleRowEquip = 2;

    //=========================================================================
    // Scene_Item
    //  ・アイテムアクションウィンドウを表示する機能を定義します。
    //  ・アイテムを捨てる機能を定義します。
    //
    //=========================================================================
    const _Scene_Item_create = Scene_Item.prototype.create;
    Scene_Item.prototype.create = function() {
        _Scene_Item_create.call(this);
        this.createItemActionWindow();
    };

    Scene_Item.prototype.createItemActionWindow = function() {
        this._itemActionWindow = new Window_ItemAction();
        this._itemActionWindow.setHandler('ok',     this.onItemActionOk.bind(this));
        this._itemActionWindow.setHandler('cancel', this.onItemActionCancel.bind(this));
        this.addWindow(this._itemActionWindow);
    };

    const _Scene_Item_onItemOk = Scene_Item.prototype.onItemOk;
    Scene_Item.prototype.onItemOk = function() {
        // 大事なものカテゴリのアイテムは選択ウィンドウを表示しない
        if(DataManager.isItem(this.item()) && this.item().itypeId === 2) {
            _Scene_Item_onItemOk.call(this);
            return;
        }
        this._itemActionWindow.setItem(this.item());
        this._itemActionWindow.show();
        this._itemActionWindow.activate();
    };

    Scene_Item.prototype.onItemActionOk = function() {
        let symbol = this._itemActionWindow.currentSymbol();
        switch(symbol) {
            case "itemUseAction":
                this.onItemActionUse();
                break;
            case "itemDisposeAction":
                this.onItemActionDispose();
                break;
            case "itemCancelAction":
                this.onItemActionCancel();
                break;
        }
    }

    Scene_Item.prototype.onItemActionUse = function() {
        this._itemActionWindow.hide();
        this._itemActionWindow.deactivate();
        _Scene_Item_onItemOk.call(this);
    };

    Scene_Item.prototype.onItemActionDispose = function() {
        this.itemDispose();
        this.hideSubWindow(this._itemActionWindow);
    };

    Scene_Item.prototype.onItemActionCancel = function() {
        this.hideSubWindow(this._itemActionWindow);
    };

    Scene_Item.prototype.itemDispose = function() {
        let item = this.item();
        let num = $gameParty.numItems(item);
        let audio = Params.itemDisposeSe;

        if(canDisposeItem(item)) {
            $gameParty.gainItem(item, -num);
            if(audio && audio.name != "") {
                AudioManager.playSe(Params.itemDisposeSe);
            }
            if(hasPrerequisitePlugin() && hasPluginParamter()) {
                // pluginCommand("コマンド文字列", ["コマンド引数",...])
                $gameMap._interpreter.pluginCommand(
                    "ERS_MAKE_TEMPLATE", [
                        Params.eventId + ""
                        , $gamePlayer.x + ""
                        , $gamePlayer.y + ""
                ]);
            }
        } else {
            SoundManager.playBuzzer();
        }
    };


    //=========================================================================
    // Window_ItemAction
    //  ・アイテムアクションウィンドウを定義します。
    //
    //=========================================================================
    function Window_ItemAction() {
        this.initialize.apply(this, arguments);
    }

    Window_ItemAction.prototype = Object.create(Window_Command.prototype);
    Window_ItemAction.prototype.constructor = Window_ItemAction;

    Window_ItemAction.prototype.initialize = function() {
        this._x = 0;
        this._y = 0;
        Window_Command.prototype.initialize.call(this, this._x, this._y);
        this.hide();
        this.deactivate();
        this._item = null;
    };

    // 選択したアイテム種別によりウィンドウの可視行数を変更する。
    Window_ItemAction.prototype.numVisibleRows = function() {
        let result = Window_Command.prototype.numVisibleRows.call(this);
        let item = this.item();
        return !item ? result : DataManager.isItem(item) ? visibleRowItem : visibleRowEquip;
    };

    Window_ItemAction.prototype.setItem = function(item) {
        this._item = item;
    };

    Window_ItemAction.prototype.item = function() {
        return this._item;
    };

    Window_ItemAction.prototype.makeCommandList = function() {
        let item = this.item();
        if(DataManager.isItem(item)) {
            this.addCommand(Params.command.itemUse, "itemUseAction",     $gameParty.canUse(item));
        }
        this.addCommand(Params.command.itemDispose, "itemDisposeAction", canDisposeItem(item));
        this.addCommand(Params.command.itemCancel,  "itemCancelAction");
    };

    Window_ItemAction.prototype.show = function() {
        this.move(this._x, this._y, this.windowWidth(), this.windowHeight());
        this.refresh();
        this.select(0);
        Window_Base.prototype.show.call(this);
    }


    //=========================================================================
    // Window_ItemList
    //  ・アイテムの有効判定処理を上書きします。
    //
    //=========================================================================
    Window_ItemList.prototype.isEnabled = function(item) {
        // return !!item;
        return !!item
            && (DataManager.isItem(item)
                || (Params.enableWeaponDispose && DataManager.isWeapon(item))
                || (Params.enableArmorDispose && DataManager.isArmor(item))
            );
    };


    //=========================================================================
    // その他
    //
    //=========================================================================
    // 前提プラグインが導入されているか
    function hasPrerequisitePlugin() {
        // EventReSpawn.js
        if(typeof Game_PrefabEvent === "undefined") {
            return false;
        }

        // TemplateEvent.js
        if(typeof $dataTemplateEvents === "undefined") {
            return false;
        }

        return true;
    }

    // パラメータは正しく設定されているか
    function hasPluginParamter() {
        // 本プラグイン
        if(!Params.eventId) {
            return false;
        }

        // TemplateEvent.js
        if(!PluginManager.parameters("TemplateEvent").TemplateMapId) {
            return false;
        }

        return true;
    }

    // アイテムを捨てることが可能か
    function canDisposeItem(item) {
        if(!item) {
            return false;
        }
        // 大事なものは捨てられないようにする
        if(item.itypeId === 2) {
            return false;
        }
        // 前提プラグインを導入時、現在位置にイベントが存在した場合は
        // アイテムを捨てられないようにする
        return !hasPrerequisitePlugin()
            ? true
            : !$gameMap.eventIdXy($gamePlayer.x, $gamePlayer.y);
    }


})();