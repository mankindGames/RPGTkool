//===============================================================================
// MKR_CombineBattle.js
//===============================================================================
// (c) 2016 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 0.0.1 2018/12/31 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v0.0.1) コンバインバトルプラグイン
 * @author マンカインド
 *
 * @help = コンバインバトルプラグイン =
 * MKR_CombineBattle.js
 *
 * 敵として設定したイベントに接触し一定時間経過後、
 * 隣接している敵イベントとまとめて戦うことができるシンボルエンカウントシステムを
 * 作成することができます。
 * (移動処理はイベント側で作成する必要があります)
 *
 * プレイヤーを未発見時(=非接触)の敵イベントの挙動、
 * プレイヤーを発見時(=接触)の敵イベントの挙動はそれぞれのイベントページにて
 * 作成してください。
 *
 * 敵イベントがプレイヤーを発見時、そのイベントと
 * プレイヤーの周囲にいる敵イベントのセルフスイッチがONになります。
 * (セルフスイッチのONが出現条件のイベントページに、
 * プレイヤー発見時の挙動を設定します)
 *
 *
 * <使い方>
 *
 * 1. ダミーの敵グループを作成し、プラグインパラメータで指定する。
 * 敵の出現位置を決めるため、ダミーの敵グループを作成してください。
 * 敵を4体配置し、位置を指定します。
 * ゲーム中では設定した位置にエネミーが表示されるようになります。
 *
 * 2. 他のプラグインパラメータの設定を行います。
 *
 * 3. 敵として設定するイベントのメモ欄を以下の通り設定します。
 *   <enemy:1>
 * 上記の 1 は敵キャラのIDを表します。
 *
 *
 * ゲームを開始し、敵イベントに接触すると周囲の敵イベントが集まります。
 * イベント集合中、プレイヤーは動くことができません。
 *
 * 戦闘に勝利した場合、隣接していた敵イベントは「イベント一時消去」状態に
 * なります。(=マップを切り替えると復活します)
 *
 * 戦闘から逃走した場合、隣接していた敵イベントの不透明度が変化し、
 * 一時的にすり抜け状態となります。
 * 指定した時間が経過した場合元の状態に戻りますが、
 * 逃走中は他の敵イベントに接触しても何も起こりません。
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
 * @param Approach Distance
 * @text 敵接近範囲
 * @desc バトル開始前、プレイヤーの上下左右○マス範囲内にいる敵イベントのセルフスイッチをONにします。
 * @type number
 * @min 1
 * @default 1
 *
 * @param Approach Self Switch
 * @text 敵接近セルフスイッチ
 * @desc 敵接近ルーチンを作成するイベントページを有効にする(=出現条件を満たす)セルフスイッチを指定します。
 * @type select
 * @option A
 * @option B
 * @option C
 * @option D
 * @default A
 *
 * @param Approach Time
 * @text 敵接近可能時間
 * @desc バトル開始直前、周囲の敵が接近可能な時間をフレーム単位で指定します。(60フレーム=1秒)
 * @type number
 * @min 1
 * @default 1
 *
 * @param Escape Time
 * @text 逃走可能時間
 * @desc バトル逃走時、隣接している敵イベントとの戦闘を回避可能な時間をフレーム単位で指定します。(60フレーム=1秒)
 * @type number
 * @min 1
 * @default 1
 *
 * @param Escape Opacity
 * @text 逃走時の敵イベント不透明度
 * @desc バトル逃走時、隣接している敵イベントの不透明度を一時的に変更します。(0～255、大きいほど不透明)
 * @type number
 * @min 0
 * @max 255
 * @default 120
 *
 * @param Dummy Troop
 * @text ダミー敵グループ
 * @desc 本プラグインで使用する敵グループを指定します。
 * @type troop
 * @default 0
 *
*/

var Imported = Imported || {};
Imported.MKR_CombineBattle = true;

(function () {
    'use strict';

    const PN = "MKR_CombineBattle";

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
            case "num":
                if(value == "") {
                    value = (isFinite(def))? parseInt(def, 10) : 0;
                } else {
                    value = (isFinite(value))? parseInt(value, 10) : (isFinite(def))? parseInt(def, 10) : 0;
                    value = value.clamp(min, max);
                }
                break;
            case "switch":
                if(value == "") {
                    value = (def != "")? def : value;
                }
                if(!value.match(/^([A-D]|\d+)$/i)) {
                    throw new Error("[CheckParam] " + param + "の値がスイッチではありません: " + param + " : " + value);
                }
                break;
            default:
                throw new Error("[CheckParam] " + param + "のタイプが不正です: " + type);
                break;
        }

        return value;
    };

    const GetMeta = function(meta, name, sep) {
        let value, values, i, count;
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

    const Params = {
        "ApproachDistance" : CheckParam("num", "敵接近距離", Parameters["Approach Distance"], 1, 1),
        "ApproachSwitch" : CheckParam("switch", "敵接近セルフスイッチ", Parameters["Approach Self Switch"], "A"),
        "ApproachTime" : CheckParam("num", "敵接近可能時間", Parameters["Approach Time"], 1, 1),
        "EscapeTime" : CheckParam("num", "逃走可能時間", Parameters["Escape Time"], 1, 1),
        "EscapeOpacity" : CheckParam("num", "逃走時の敵イベント不透明度", Parameters["Escape Opacity"], 120, 0, 255),
        "Troop" : CheckParam("num", "ダミー敵グループ", Parameters["Dummy Troop"], 0, 0),
    };


    //=========================================================================
    // CombineBattle
    //  ・コンバインバトル管理用
    //
    //=========================================================================
    function CombineBattle() {
        throw new Error('This is a static class');
    };

    CombineBattle.setup = function() {
        this._troopId = Params.Troop;
        this._eventList = [];
        this._phase = "init";
        this._AproachTime = 0;
        this._EscapeTime = 0;

        if(!this._enemyPositionList) {
            this._enemyPositionList = $dataTroops[this._troopId].members.map(function(enemy) {
                return {"x": enemy.x, "y": enemy.y};
            });
        }

        this._phase = "start";
    };

    CombineBattle.addEventList = function(eventId) {
        if(!Number.isFinite(eventId) || eventId < 1) {
            return;
        }
        this._eventList.push(eventId);
    };


    CombineBattle.clearEventList = function() {
        this._eventList = [];
    };

    CombineBattle.isStart = function() {
        return this._phase === "start";
    };

    CombineBattle.isBattle = function() {
        return this._phase === "battle";
    };

    CombineBattle.isEscape = function() {
        return this._phase === "escape";
    };

    CombineBattle.startEscape = function() {
        this._phase = "escape";
    };

    CombineBattle.isBusy = function() {
        switch(this._phase) {
            case "start":
            case "battle":
                return true;
            default :
                return false;
        }
    };

    CombineBattle.clearPhase = function() {
        return this._phase = "";
    };

    CombineBattle.onSelfSwitch = function() {
        let playerX, playerY, mapId, selfSwitch;
        selfSwitch = Params.ApproachSwitch;
        playerX = $gamePlayer.x;
        playerY = $gamePlayer.y;
        mapId = $gameMap.mapId();

        $gameMap.events().forEach(function(event) {
            let sx, sy, object;
            sx = Math.abs(event.deltaXFrom(playerX));
            sy = Math.abs(event.deltaYFrom(playerY));

            if(sx + sy >= Params.ApproachDistance || !event.event().meta.enemy) {
                return;
            }

            object = [mapId, event.eventId(), selfSwitch];
            $gameSelfSwitches._data[object] = true;
        });

        $gameMap.requestRefresh();
    };

    CombineBattle.offSelfSwitch = function() {
        let mapId, selfSwitch;
        selfSwitch = Params.ApproachSwitch;
        mapId = $gameMap.mapId();

        $gameMap.events().forEach(function(event) {
            let object;

            if(!event.event().meta.enemy) {
                return;
            }

            object = [mapId, event.eventId(), selfSwitch];
            delete $gameSelfSwitches._data[object];
        });

        $gameMap.requestRefresh();
    };

    CombineBattle.update = function() {
        this.approachUpdate();
        this.escapeUpdate();
    };

    CombineBattle.approachUpdate = function() {
        if(!this.isStart()) {
            return;
        }

        this._AproachTime++;
        if(this._AproachTime >= Params.ApproachTime) {
            this._phase = "battle";

            let event;
            event = $gameMap.event(this._eventList[0]);
            if(event) {
                event.unlock();
            }
            this.makeTroop();
            $gameMap._interpreter._params = [0, this._troopId, 1, 1];
            $gameMap._interpreter._indent = 0;
            $gameMap._interpreter.command301();
        }
    };

    CombineBattle.escapeUpdate = function() {
        if(!this.isEscape()) {
            return;
        }

        this._EscapeTime++;
        if(this._EscapeTime >= Params.EscapeTime) {
            this.clearPhase();
            this._eventList.forEach(function(eventId) {
                let event;
                event = $gameMap.event(eventId);
                if(event) {
                    event.setOpacity(255);
                    event.setThrough(false);
                }
            });
            $gameMap.requestRefresh();
            this.clearEventList();
        }
    };

    CombineBattle.makeTroop = function() {
        let troop, i, positionList, sx, sy, eventId, event, enemyId;
        troop = $dataTroops[this._troopId];
        troop.members = [];
        this.clearEventList();
        positionList = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        i = 0;

        for(i = 0; i < 4; i++) {
            sx = $gamePlayer.x + positionList[i][0];
            sy = $gamePlayer.y + positionList[i][1];
            eventId = $gameMap.eventIdXy(sx, sy);
            if(!eventId) {
                continue;
            }
            event = $gameMap.event(eventId);
            enemyId = GetMeta(event.event().meta, "enemy");
            if(event && enemyId) {
                this.addEventList(eventId);
            }
        }

        i = 0;
        this._eventList.forEach(function(eventId) {
            event = $gameMap.event(eventId);
            troop.members.push({
                "enemyId": event.event().meta.enemy,
                "x": this._enemyPositionList[i].x || 0,
                "y": this._enemyPositionList[i].y || 0,
                "hidden": false,
            });
            i++;
        }, this);
    };

    CombineBattle.eraseEvent = function() {
        this._eventList.forEach(function(eventId) {
            let event;
            event = $gameMap.event(eventId);
            if(event) {
                event.erase();
            }
        });

        this.clearEventList();
    };

    CombineBattle.tempEraseEvent = function(eventId) {
        if(!this._eventList.contains(eventId)) {
            return;
        }

        let event;
        event = $gameMap.event(eventId);
        if(event) {
            event.setOpacity(Params.EscapeOpacity);
            event.setThrough(true);
        }
    };


    //=========================================================================
    // BattleManager
    //  ・戦闘終了時、集合した敵イベントの操作(未発見に移行/一時消去)を行います。
    //
    //=========================================================================
    const _Scene_Map_start =  Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        if(CombineBattle.isBattle()) {
            CombineBattle.offSelfSwitch();
            if(!BattleManager.isEscaped()) {
                CombineBattle.eraseEvent();
                CombineBattle.clearPhase();
            } else {
                CombineBattle.startEscape();
                // CombineBattle.tempEraseEvent();
            }
        }
        _Scene_Map_start.call(this);
    };


    //=========================================================================
    // Game_Event
    //  ・敵イベントの場合、敵集合処理を開始します。
    //  ・イベントページセットアップ時、逃走中エネミーのすり抜け状態をONにする
    //
    //=========================================================================
    const _Game_Event_start = Game_Event.prototype.start;
    Game_Event.prototype.start = function() {
        let enemyId, event;
        event = this.event();

        if(event.meta) {
            enemyId = GetMeta(event.meta, "enemy");
            if(enemyId !== "" && !CombineBattle.isBusy() && !CombineBattle.isEscape()) {
                // this._starting = true;
                this.lock();
                CombineBattle.setup();
                CombineBattle.addEventList(this.eventId());
                CombineBattle.onSelfSwitch();
                return ;
            }
        }

        _Game_Event_start.call(this);
    };

    const _Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function() {
        _Game_Event_setupPageSettings.call(this);
        if(CombineBattle.isEscape()) {
            CombineBattle.tempEraseEvent(this.eventId());
        }
    };


    //=========================================================================
    // Game_Player
    //  ・敵集合中はプレイヤーの移動を制限します。
    //
    //=========================================================================
    const _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        return _Game_Player_canMove.call(this) && !CombineBattle.isBusy();
    };


    //=========================================================================
    // Game_Map
    //  ・敵集合中、集合可能時間をカウントします。
    //  ・戦闘逃走時、逃走可能時間をカウントします。
    //
    //=========================================================================
    const _Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function(sceneActive) {
        _Game_Map_update.apply(this, arguments);

        if(CombineBattle.isStart() || CombineBattle.isEscape()) {
            CombineBattle.update();
        }
    };


})();