//=============================================================================
// MKR_PlayerSensor.js
//=============================================================================
// Copyright (c) 2016 mankind
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.2.7 2016.01.03 ・探索者がプレイヤー発見時に条件を満たすイベントページに
//                    設定された画像の向きにより、
//                    探索者がプレイヤーの方を向いていない
//                    状態で有効になったイベントが実行されていた問題を修正。
//
// 2.2.6 2016/11/12 ・メモ欄にEvとRgを一緒に指定した場合、Rgが正常に機能しない
//                    問題を修正。
//
// 2.2.5 2016/11/12 ・探索者の視界範囲がマップ上イベントオブジェクトの影響を
//                    受けるかどうか設定可能に。
//                  ・探索者の視界範囲がマップ上リージョンタイルの影響を
//                    受けるかどうか設定可能に。
//
// 2.2.4 2016/10/10 ・マップ描画時に自動的にプラグインコマンド[PSS start]を
//                    実行させるためのプラグインパラメーターを追加。
//
// 2.2.3 2016/10/09 ・同じマップに、同じスイッチをONにする探索者が複数存在した
//                    場合、イベントIDの一番大きな探索者でしかスイッチをOnに
//                    できなかった問題を修正。
//
// 2.2.2 2016/09/09 ・メモ欄の視界範囲マス数に変数を指定した場合に、
//                    正常に機能していなかった問題を修正。
//                  ・メモ欄に設定した(スイッチの使用可能な)オプションが
//                    正常に機能していなかった問題を修正。
//                  ・メモ欄のオプション値にセルフスイッチを指定した場合に
//                    正常に機能していなかった問題を修正。
//
// 2.2.1 2016/08/23 ・プラグインパラメーター/メモ欄に変数/スイッチを
//                    指定した場合、正しく値を取得できていなかった問題を修正。
//
// 2.2.0 2016/08/21 ・探索者の視界範囲を変数で指定する場合の記述方法を変更。
//                            変更前    :     変更後
//                        <PsensorL:&5> : <PsensorL:\v[5]>
//                      意味 : 視界範囲のマス数に変数5番の数値を使用する。
//                  ・メモ欄に指定するオプション文字列を変更。
//                      変更前 : 変更後 : 意味
//                        S    :  Sw    : 視界範囲内外で操作するスイッチ。
//                        B    :  Bo    : 両サイドを視界範囲とするか。
//                        R    :  Rv    : 視界範囲を描画するか。
//                        T    :  Td    : 視界範囲の生成に地形を考慮するか。
//                        D    :  Di    : 視界範囲の方向を指定する。
//                  ・メモ欄の設定に変数、スイッチを使えるように。
//                  ・プラグインパラメーターの設定にスイッチを使用可能に。
//
// 2.1.0 2016/07/24 ・視覚範囲の種類として、ひし形、四角形を追加。
//                    (ただし、地形考慮には非対応)
//                  ・探索者の視界範囲外に移動した場合に、
//                    設定されたスイッチの状態をONからOFFへ切り替えるように
//                    仕様を変更。
//                  ・探索者のセルフスイッチをOFFにできるコマンドを追加。
//                  ・探索方向を固定化できるDオプションを追加。
//                  ・Bオプションの不具合を修正。
//                  ・イベントページが切り替わると、センサーの状態が
//                    メモ欄の値で上書きされていた不具合を修正。
//                  ・プラグインの名前を変更。
//
// 1.0.0 2016/07/11 ・初版公開
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v2.2.7) プレイヤー探索プラグイン
 * @author マンカインド
 *
 * @help
 * 対象イベント(以下、探索者)の視界の範囲を描画し、
 * 範囲マス内にプレイヤーが存在した場合、指定されたスイッチをONにします。
 * 探索中のイベントは、話しかけられた方向に振り向かないようになります。
 *
 *
 * 簡単な使い方説明:
 *   探索者にさせたいイベントのメモ欄を設定し、プラグインコマンド
 *   PSS startで全て(一部例外あり)探索者が探索を開始します。
 *
 *   プラグインコマンド PSS t_start で探索者が探索を開始します。
 *   (探索一時無効状態となっている探索者に対しても探索を開始させます。)
 *
 *   プラグインコマンド PSS t_stop で探索者が探索を停止します。
 *
 *   プラグインコマンド PSS stop で全探索者が探索を停止します。
 *
 *
 * メモ欄_基本設定(Xは正の整数):
 *   <PsensorL:X>
 *     ・探索者の前方Xマスを探索します。
 *
 *   <PsensorF:X>
 *     ・探索者を頂点として前方にXマス、
 *       左右にXマス進んだ地点の点をそれぞれ結んで形成される
 *       三角形の図形の範囲内を探索します。
 *
 *   <PsensorD:X>
 *     ・探索者から上下左右にXマス進んだ点を結んで形成される、
 *       ひし形の図形の範囲内を探索します。
 *
 *     ・この形状の場合、地形の通行可能状態を無視します。
 *       (常にTdオプションが1の状態となります。)
 *
 *   <PsensorS:X>
 *     ・探索者から上下にXマス、
 *       左右にXマス進んだ地点の点をそれぞれ結んで形成される
 *       四角形の図形の範囲内を探索します。
 *
 *     ・この形状の場合、地形の通行可能状態を無視します。
 *       (常にTdオプションが1の状態となります)
 *
 *   <PsensorL:\V[n]>
 *     ・視界範囲マス数を指定する部分には、
 *       変数を表す制御文字である \V[n] が使用可能です。
 *       変数番号N番の変数に格納されている値を
 *       範囲値として使用します。
 *       (変数の変更はリアルタイムに反映されます)
 *
 *   <!PsensorL:X>
 *     ・探索者の前方Xマスが範囲ですが、
 *       先頭に ! を付けると探索一時無効状態となります。
 *
 *     ・この状態の場合、後述するプラグインコマンド:PSS start実行時点では
 *       探索が開始されず、
 *         プラグインコマンド:PSS t_start か
 *         スクリプトコマンド:$gameSystem.onSensor(eventId) で
 *       個別に探索を開始させる必要があります。
 *
 *
 * メモ欄_オプション(各オプションはスペースで区切る):
 *   Sw[数字またはA～D]
 *     ・探索者がプレイヤーを発見した際に
 *       ONにするスイッチ番号またはセルフスイッチを
 *       探索者毎に指定します。
 *
 *     ・指定しない場合は初期値の設定を使用します。
 *
 *     例)
 *       Sw10 : スイッチ番号10番のスイッチをONにします。
 *       SwC  : 探索者のセルフスイッチCをONにします。
 *
 *   Bo[0～1の数字、または\S[n]]
 *     ・探索者の両隣を探索範囲としない(0)/する(1)。
 *       1 の場合、探索者の左右マスが探索範囲となります。
 *
 *     ・\S[n]はスイッチの状態を取得する制御文字です。
 *       Nには数値かA～Dのアルファベットが入ります。(A～Dはセルフスイッチです)
 *       スイッチNの状態がON = 1を指定したことと同じです。
 *
 *     ・指定しない場合は初期値の設定を使用します。
 *
 *   Rv[0～1の数字、または\S[n]]
 *     ・探索者の視界範囲を描画しない(0)/する(1)。
 *       0 の場合、探索者の視界範囲が画面に描画されません。
 *       (視覚的に見えなくなるだけで探索は行われます)
 *
 *     ・\S[n]はスイッチの状態を取得する制御文字です。
 *       Nには数値かA～Dのアルファベットが入ります。(A～Dはセルフスイッチです)
 *       スイッチNの状態がON = 1を指定したことと同じです。
 *
 *     ・指定しない場合は初期値の設定を使用します。
 *
 *   Td[0または1、または\S[n]]
 *     ・視界範囲の算出に視界範囲内の地形/イベントに対する
 *       通行可能状態を考慮しない(0)/する(1)。
 *       1 の場合、視界範囲内に通行不可マスがあると視界範囲が変化します。
 *
 *     ・地形の通行可能状態を考慮する場合、
 *       通行不可マスが視界範囲の対象にならず、
 *       探索者から見て通行不可マスがあることによって
 *       死角になるマスも視覚範囲の対象になりません。
 *
 *     ・\S[n]はスイッチの状態を取得する制御文字です。
 *       Nには数値かA～Dのアルファベットが入ります。(A～Dはセルフスイッチです)
 *       スイッチNの状態がON = 1を指定したことと同じです。
 *
 *     ・指定しない場合は初期値の設定を使用します。
 *
 *   Di[U,R,L,Dどれか1文字]
 *     ・探索者の向きを考慮せず、探索方向を固定します。
 *       Uは上、Rは右、Lは左、Dは下を表します。
 *
 *   Ev[0または1、または\S[n]]
 *     ・探索者の視界範囲がマップ上の通行不可能なイベント
 *       (プライオリティが「通常キャラと同じ」)の
 *       影響を受ける(1)/受けない(0)。
 *       1 の場合、視界範囲内に通行不可能なマップイベントがあると
 *       視界範囲が変化します。
 *
 *     ・[タイルセット B]以降のタイルをイベントの画像として指定し
 *       イベントのプライオリティが「通常キャラの下」の場合、
 *       タイルセットの通行可能設定が視界範囲に影響し、
 *       タイルセットの設定が通行不可の場合、視界範囲外となります。
 *
 *     ・視界範囲内の通行可能状態を考慮しない設定になっている場合、
 *       この設定は無視されます。
 *
 *     ・指定しない場合は初期値の設定を使用します。
 *
 *   Rg[リージョン番号、または\V[n]]
 *     ・指定した場合探索者の視界範囲がマップ上のリージョンタイルの
 *       影響を受けます。
 *       例えば 1 を指定すると、リージョン番号1番のタイルが置かれたマスが
 *       壁扱いとなり、視界範囲外となります。
 *
 *     ・視界範囲内の通行可能状態を考慮しない設定になっている場合、
 *       この設定は無視されます。
 *
 *     ・指定しない場合は初期値の設定を使用します。
 *
 *
 * メモ欄の設定例:
 *   <PsensorL:7>
 *     ・探索者の前方7マスの範囲を探索します。
 *
 *   <PsensorF:3>
 *     ・探索者を頂点に、前方3マス左右に3マス進んだ地点を
 *       結んでできる三角形の図形の範囲内を探索します。
 *
 *   <PsensorL:\V[100]>
 *     ・探索者の前方[変数番号100番]マスの範囲を探索します。
 *
 *   <PsensorL:4 SwC>
 *     ・探索者の前方4マスの範囲を探索します。
 *       プレイヤー発見時に探索者のセルフスイッチCをONにします。
 *
 *   <PsensorF:5 Bo1>
 *     ・探索者を頂点に、前方3マス左右に3マスの点を
 *       結んでできる三角形の図形の範囲内を探索します。
 *
 *     ・さらに探索者の両隣を探索範囲とします。
 *
 *   <PsensorL:10 Rv0>
 *     ・探索者の前方10マスの範囲を探索しますが、
 *       視界範囲の描画をしません。
 *
 *   <PsensorL:10 Rv\s[20]>
 *     ・探索者の前方10マスの範囲を探索します。
 *
 *     ・スイッチ20番の状態がOFFの場合は
 *       視界範囲の描画をしません。
 *
 *   <PsensorL:10 Td0>
 *     ・探索者の前方10マスの範囲を探索しますが、
 *       視界範囲内の通行可能マス状態を考慮しません。
 *
 *   <PsensorL:10 Td\s[A]>
 *     ・探索者の前方10マスの範囲を探索します。
 *
 *     ・セルフスイッチAの状態がOFFの場合は
 *       視界範囲内の通行可能マス状態を考慮しません。
 *
 *   <PsensorF:&2 Bo0 Sw1>
 *     ・探索者を頂点に、前方[変数番号2番]マス
 *       左右に[変数番号2番]マス進んだ地点の点を結んでできる
 *       三角形の図形の範囲内を探索しますが、
 *       探索者の両隣を範囲としません。
 *
 *     ・プレイヤー発見時にスイッチ番号1番のスイッチをONにします。
 *
 *   <PsensorL:7 DiR>
 *     ・探索者の右隣7マスの範囲を探索します。
 *
 *   <PsensorF:7 DiU>
 *     ・探索者を頂点に、上3マス左右に3マスの点を
 *       結んでできる三角形の図形の範囲内を探索します。
 *
 *   <PsensorL:10 Ev1 Rg10>
 *     ・探索者の前方10マスの範囲を探索しますが、
 *       視界範囲内のマップイベントの存在を考慮します。
 *       さらにリージョン番号10番のタイルを壁として認識します。
 *
 *
 * プラグインコマンド:
 *   PSS start
 *     ・探索処理を開始します。
 *       (探索一時無効状態の探索者は対象外です)
 *
 *   PSS stop
 *     ・探索処理を終了します。
 *
 *   PSS reset X Y ...
 *     ・このコマンドを実行したマップ上に存在する全ての探索者を対象に、
 *       プラグインパラメーター[Default_Sensor_Switch]で
 *       指定したセルフスイッチ、
 *       またはSオプションで指定したセルフスイッチの
 *       どちらかをOFFにします。(メモ欄の設定が優先されます)
 *
 *     ・また、引数として指定したセルフスイッチも
 *       同様にOFFにします。まとめてOFFにしたい場合に指定してください。
 *       (X,Y は引数。引数はスペース区切りで記載してください)
 *
 *   PSS t_start
 *     ・このコマンドを実行した探索者を
 *       探索開始状態にします。
 *
 *     ・実際に探索を行わせるためには事前にPSS startコマンドの
 *       実行が必要です。
 *
 *   PSS t_stop
 *     ・このコマンドを実行した探索者に対して探索を終了させます。
 *
 *   PSS t_reset X Y ...
 *     ・このコマンドを実行した探索者を対象に、
 *       プラグインパラメーター[Default_Sensor_Switch]で
 *       指定した(セルフ)スイッチ、
 *       またはメモ欄のSwオプションで指定した(セルフ)スイッチの
 *       どちらかをOFFにします。(メモ欄の設定が優先されます)
 *
 *     ・"X", "Y" はセルフスイッチを表し、ここに記載したセルフスイッチも
 *       同様にOFFにします。まとめてOFFにしたい場合に指定してください。
 *       (セルフスイッチはカンマ区切りで記載してください)
 *
 *   PSS t_move X
 *     ・このコマンドを実行した時点のプレイヤー位置に隣接する位置まで、
 *       このコマンドを実行したイベントを移動させます。
 *
 *     ・Xは移動速度。1～6まで対応し、
 *       未指定の場合はイベントに設定されている速度を使用します。
 *
 *     ・プラグインパラメーター[Default_Terrain_Decision]がOFFまたは
 *       メモ欄のTオプションが0の場合は
 *       正しく移動できない可能性があります。
 *       (イベントのすり抜けを有効にすることで移動可能です)
 *
 *
 * スクリプトコマンド:
 *   $gameSystem.getEventSensorStatus(eventId)
 *     ・指定したイベントIDを持つ探索者に対して探索状態を取得します。
 *       [戻り値] | [意味]
 *          -1    | 探索一時無効
 *           0    | 探索停止中
 *           1    | 探索実行中
 *
 *   $gameSystem.onSensor(eventId)
 *     ・指定したイベントIDを持つ探索者を探索開始状態にします。
 *       探索停止/無効状態の探索者に対し探索を再開させる場合に使用します。
 *
 *     ・探索を開始させるためには事前にPSS startコマンドの実行が必要です。
 *
 *   $gameSystem.offSensor(eventId)
 *     ・指定したイベントIDを持つ探索者に対し探索を停止させます。
 *
 *   $gameSystem.neutralSensor(eventId, ["X","Y",...])
 *     ・現在のマップに存在する、指定したイベントIDを持つ探索者に対し、
 *       [Default_Sensor_Switch]で指定した(セルフ)スイッチか、
 *       またはSwオプションで指定したセルフスイッチの
 *       どちらかをOFFにします。(メモ欄の設定が優先されます)
 *
 *     ・"X", "Y" は(セルフ)スイッチを表し、ここに記載した(セルフ)スイッチも
 *       同様にOFFにします。まとめてOFFにしたい場合に指定してください。
 *       (カンマ区切りで指定してください)
 *
 *
 * 補足：
 *   ・このプラグインに関するメモ欄の設定、プラグインコマンド、
 *     は大文字/小文字を区別していません。
 *
 *   ・プラグインパラメーターの説明に、[初期値]と書かれているものは
 *     メモ欄にて個別設定が可能です。
 *     設定した場合、[初期値]よりメモ欄の設定が
 *     優先されますのでご注意ください。
 *
 *   ・プラグインパラメーターの説明に、[変数可]と書かれているものは
 *     設定値に変数を表す制御文字である\V[n]を使用可能です。
 *     変数を設定した場合、そのパラメーターの利用時に変数の値を
 *     参照するため、パラメーターの設定をゲーム中に変更できます。
 *
 *   ・プラグインパラメーターの説明に、[スイッチ可]と書かれているものは
 *     設定値にスイッチを表す制御文字の\S[n]を使用可能です。(Nは数値)
 *     指定したスイッチがONの場合はプラグインパラメーターに
 *     ONまたは1,trueを指定したことと同じとなります。
 *     スイッチを設定した場合、そのパラメーターの利用時にスイッチの値を
 *     参照するため、パラメーターの設定をゲーム中に変更できます。
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
 * @param Default_Sensor_Switch
 * @desc [初期値] プレイヤー発見時にONにするスイッチ番号またはセルフスイッチを指定。
 * @default D
 *
 * @param Default_Both_Sensor
 * @desc [初期値:スイッチ可] 探索者の両隣を探索範囲とする場合はON、しない場合はOFFを指定してください。
 * @default OFF
 *
 * @param Default_Range_Visible
 * @desc [初期値:スイッチ可] 探索者の視界範囲を描画する場合はON、しない場合はOFFを指定してください。
 * @default ON
 *
 * @param Default_Terrain_Decision
 * @desc [初期値:スイッチ可] 視界範囲に通行不可マスの存在を考慮させる場合はON、しない場合はOFFを指定してください。
 * @default ON
 *
 * @param Default_Range_Color
 * @desc 視界範囲を描画する際の色を英語で指定してください。デフォルト:white(白)
 * @default white
 *
 * @param Default_Range_Opacity
 * @desc 視界範囲を描画する際の不透明度を数字で指定してください。デフォルト:80(0-255)
 * @default 80
 *
 * @param Default_Auto_Sensor
 * @desc マップ描画時に探索処理を自動的に有効にする場合はON、しない場合はOFFを指定してください。
 * @default OFF
 *
 * @param Default_Event_Decision
 * @desc [初期値:スイッチ可] 視界範囲にマップイベントの存在を考慮させる場合はON、しない場合はOFFを指定してください。
 * @default OFF
 *
 * @param Default_Region_Decision01
 * @desc [初期値:変数可] 視界範囲外(壁扱い)とするリージョン番号を指定してください。(0でリージョンを考慮しません)
 * @default 0
 *
*/
(function () {
    'use strict';

    var CheckParam = function(type, param, def, min, max) {
        var Parameters, regExp, value;
        Parameters = PluginManager.parameters("MKR_PlayerSensor");

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

        regExp = /^\x1bV\[\d+\]|\x1bS\[\d+\]$/i;
        value = value.replace(/\\/g, '\x1b');
        value = value.replace(/\x1b\x1b/g, '\\');

        if(!regExp.test(value)) {
            switch(type) {
                case "bool":
                    if(value == "") {
                        value = (def)? true : false;
                    } else {
                        value = value.toUpperCase() === "ON" || value.toUpperCase() === "TRUE" || value.toUpperCase() === "1";
                    }
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
                    if(value == "") {
                        value = (def != "")? def : value;
                    }
                    break;
                case "switch":
                    if(value == "") {
                        value = (def != "")? def : value;
                    }
                    if(!value.match(/^([A-D]|\d+)$/i)) {
                        throw new Error('Plugin parameter value is not switch : '+param+' : '+value);
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

        text = text.replace(/\x1bV\[\d+\]/i, function() {
            return String(ConvVb(text));
        }.bind(this));
        text = text.replace(/\x1bS\[(\d+|[A-D])\]/i, function() {
            return String(ConvSw(text));
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
            case "switch":
                if(value == "") {
                    value = (def != "")? def : value;
                }
                if(!value.match(/^([A-D]|\d+)$/)) {
                    throw new Error('Plugin parameter value is not switch : '+param+' : '+value);
                }
                break;
            default:
                throw new Error('[CEC] Plugin parameter type is illegal: '+type);
                break;
        }

        return value;
    };

    var ConvVb = function(text) {
        var num, regExp;
        regExp = /^\x1bV\[(\d+)\]$/i;

        if(typeof text == "string") {
            text = text.replace(/\\/g, '\x1b');
            text = text.replace(/\x1b\x1b/g, '\\');

            text = text.replace(regExp, function() {
                num = parseInt(arguments[1]);
                return $gameVariables.value(num);
            }.bind(this));
            text = text.replace(regExp, function() {
                num = parseInt(arguments[1]);
                return $gameVariables.value(num);
            }.bind(this));
        }

        return text;
    }

    var ConvSw = function(text, target) {
        var num, key, regExp;
        regExp = /^\x1bV\[\d+\]$|^\x1bS\[\d+\]$/i;

        if(typeof text == "string") {
            text = text.replace(/\\/g, '\x1b');
            text = text.replace(/\x1b\x1b/g, '\\');

            text = text.replace(/\x1bS\[(\d+)\]/i, function() {
                num = parseInt(arguments[1]);
                return $gameSwitches.value(num);
            }.bind(this));
            text = text.replace(/\x1bS\[([A-D])\]/i, function() {
                if(target) {
                    key = [target._mapId, target._eventId, arguments[1].toUpperCase()];
                    return $gameSelfSwitches.value(key);
                }
                return false;
            }.bind(this));

            if(text === true || text.toLowerCase() === "true" || text == "1") {
                text = 1;
            } else {
                text = 0;
            }
        }

        return text;
    }

    var DIR_UP, DIR_DOWN, DIR_RIGHT, DIR_LEFT,
        DefSensorSwitch, DefBothSensor, DefRangeVisible,
        DefTerrainDecision, DefRangeColor, DefRangeOpacity,
        DefAutoSensor, DefEventDecision, DefRegionDecisions;
    DefSensorSwitch = CheckParam("switch", "Default_Sensor_Switch", "D");
    DefBothSensor = CheckParam("bool", "Default_Both_Sensor", false);
    DefRangeVisible = CheckParam("bool", "Default_Range_Visible", true);
    DefTerrainDecision = CheckParam("bool", "Default_Terrain_Decision", false);
    DefRangeColor = CheckParam("string", "Default_Range_Color", "white");
    DefRangeOpacity = CheckParam("num", "Default_Range_Opacity", 80, 0, 255);
    DefAutoSensor = CheckParam("bool", "Default_Auto_Sensor", false);
    DefEventDecision = CheckParam("bool", "Default_Event_Decision", false);
    DefRegionDecisions = [];
    DefRegionDecisions.push(CheckParam("num", "Default_Region_Decision01", 0));
    DIR_UP = 8;
    DIR_DOWN = 2;
    DIR_RIGHT = 6;
    DIR_LEFT = 4;


    //=========================================================================
    // Game_Interpreter
    //  ・プレイヤー探索制御プラグインコマンド
    //  ・イベントをプレイヤー近くまで移動させるコマンド
    //  を定義
    //=========================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === "pss") {
            switch (args[0].toLowerCase()) {
                case "start":// 探索開始
                    $gameSystem.startSensor();
                    break;
                case "stop":// 探索停止
                    $gameSystem.stopSensor();
                    break;
                case "reset":// 全探索者のセルフスイッチ初期化
                    $gameSystem.resetSensor(args);
                    break;
                case "t_start":// 対象探索者を探索開始状態にする
                    $gameSystem.onSensor(this.eventId());
                    break;
                case "t_stop":// 対象探索者を探索停止状態にする
                    $gameSystem.offSensor(this.eventId());
                    break;
                case "t_reset":// 対象探索者のセルフスイッチ初期化
                    $gameSystem.neutralSensor(this.eventId(), args);
                    break;
                case "t_move":// 対象探索者をプレイヤーの位置付近まで移動
                    this.moveNearPlayer(args[1]);
                    break;
            }
        }
    };

    Game_Interpreter.prototype.moveNearPlayer = function(speed) {
        var event, oldSpeed, newSpeed, list, sx, sy, i, direction;
        event = $gameMap.event(this._eventId);
        oldSpeed = event.moveSpeed();
        newSpeed = oldSpeed;
        sx = Math.abs(event.deltaXFrom($gamePlayer.x));
        sy = Math.abs(event.deltaYFrom($gamePlayer.y));
        list = [];

        // 移動スピード設定
        if(speed && isFinite(speed) && speed > 0) {
            newSpeed = parseInt(speed, 10);
        }

        // 移動ルート設定
        list.push({"code":29,"parameters":[newSpeed]}, {"code":25})
        for(i = 1; i < sx + sy; i++) {
            list.push({"code":10});
        }
        list.push({"code":25}, {"code":29,"parameters":[oldSpeed]}, {"code":0});

        // 移動開始
        this.setWaitMode('route');
        event.forceMoveRoute({
            "list":list,
            "repeat":false,
            "skippable":true,
            "wait":true
        });
    };


    //=========================================================================
    // Game_System
    //  プレイヤー探索制御を定義
    //=========================================================================
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function(){
        _Game_System_initialize.call(this);
        this._sensorStart = false
        this._foundPlayer = 0;
        this._switchStatuses  = {};
    };

    Game_System.prototype.startSensor = function() {
        this.setSensorStart(true);
        this.setSensorStatusAll(1);
        this.setViewRangeStatusAll(2);
    };

    Game_System.prototype.stopSensor = function() {
        this.setSensorStart(false);
        this.setSensorStatusAll(0);
        this.setViewRangeStatusAll(0);
    };

    Game_System.prototype.resetSensor = function(args) {
        $gameMap.events().forEach(function(event) {
            if(event.getSensorType() != null) {
                $gameSystem.neutralSensor(event.eventId(), args)
            }
        }, this);
    };

    Game_System.prototype.onSensor = function(eventId) {
        var event = $gameMap.event(eventId);
        event.setSensorStatus(1);
    };

    Game_System.prototype.offSensor = function(eventId) {
        var event = $gameMap.event(eventId);
        event.setSensorStatus(0);
    };

    Game_System.prototype.neutralSensor = function(eventId, args) {
        var mapId, event, sw, switches, sensorSwitch;
        mapId = $gameMap.mapId();
        event = $gameMap.event(eventId);
        switches = [];
        if(args && args.length >= 2) {
            switches = args.slice(1);
        }
        sensorSwitch = DefSensorSwitch[0];

        if(event) {
            if(event.getSensorType() != null) {
                sw = (event.getSensorSwitch() != null)? event.getSensorSwitch() : sensorSwitch;
                switches.push(sw);

                switches.forEach(function(sw) {
                    if(isFinite(sw)) {
                        $gameSwitches.setValue(sw, false);
                    } else if(sw.match(/[a-dA-D]/)) {
                        $gameSelfSwitches.setValue([mapId, eventId, sw.toUpperCase()], false);
                    }
                }, this)
            }
        }
    };

    Game_System.prototype.isSensorStart = function() {
        return this._sensorStart;
    };

    Game_System.prototype.isFoundPlayer = function() {
        return this._foundPlayer;
    };

    Game_System.prototype.setSensorStart = function(sensorStart) {
        this._sensorStart = sensorStart || false;
    };

    Game_System.prototype.getSensorStart = function() {
        return this._sensorStart;
    };

    Game_System.prototype.setFoundPlayer = function(foundPlayer) {
        this._foundPlayer = foundPlayer || 0;
    };

    Game_System.prototype.setSensorStatusAll = function(status) {
        $gameMap.events().forEach(function(event) {
            if(event.getSensorType() != null && event.getSensorStatus() != -1) {
                event.setSensorStatus(status);
            }
        }, this);
    }

    Game_System.prototype.setViewRangeStatusAll = function(status) {
        $gameMap.events().forEach(function(event) {
            if(event.getSensorType() != null) event.setViewRangeStatus(status);
        }, this);
    }

    Game_System.prototype.getEventSensorStatus = function(eventId) {
        var event;
        if(eventId && isFinite(eventId) && $gameMap.event(eventId)) {
            event = $gameMap.event(eventId);
            return event.getSensorStatus();
        } else {
            return null;
        }
    };

    Game_System.prototype.getSwitchStatuses = function() {
        return this._switchStatuses;
    };

    Game_System.prototype.setSwitchStatuses = function(sw, eventId) {
        if(this._switchStatuses[sw]) {
            if(this._switchStatuses[sw] instanceof Array && this._switchStatuses[sw].length > 0) {
                if(!this._switchStatuses[sw].contains(eventId)) {
                    this._switchStatuses[sw].push(eventId);
                }
            } else {
                this._switchStatuses[sw] = [eventId];
            }
        } else {
            this._switchStatuses[sw] = [eventId];
        }
    };

    Game_System.prototype.isSwitchStatuses = function(sw, eventId) {
        if(!sw || !isFinite(sw)) {
            return false;
        }
        if(this._switchStatuses[sw]) {
            if(eventId == null) {
                return true;
            } else {
                if(this._switchStatuses[sw] instanceof Array && this._switchStatuses[sw].length > 0) {
                    if(this._switchStatuses[sw].contains(eventId)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    Game_System.prototype.removeSwitchStatuses = function(sw, eventId) {
        if(this._switchStatuses[sw]) {
            if(!eventId) {
                delete this._switchStatuses[sw];
            } else {
                if(this._switchStatuses[sw] instanceof Array && this._switchStatuses[sw].length > 0) {
                    if(this._switchStatuses[sw].contains(eventId)) {
                        this._switchStatuses[sw].some(function(v, i){
                            if (v == eventId) {
                                this._switchStatuses[sw].splice(i, 1);
                            }
                        }, this);
                    }
                }
                if(this._switchStatuses[sw].length == 0) {
                    delete this._switchStatuses[sw];
                }
            }
        }
    };


    //=========================================================================
    // Game_CharacterBase
    //  プレイヤー探索制御用メンバーを追加定義し、
    //  センサー状態を変更する処理を再定義します。
    //
    //  センサー状態：
    //   -2 = センサー初期化前
    //   -1 = 探索停止(setSensorStatusAllの対象外)
    //    0 = 探索停止
    //    1 = 探索中
    //  視界描画状態：
    //    0 = 描画停止
    //    1 = 描画更新
    //    2 = 描画新規
    //  発見状態：
    //    0 = 未発見
    //    1 = 発見済み
    //=========================================================================
    var _Game_CharacterBaseInitMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBaseInitMembers.call(this);
        this._foundStatus = 0;
        this._sensorStatus = -2;
        this._sensorType = null;
        this._sensorRange = 0;
        this._sensorRangeC = 0;
        this._bothSensorR = false;
        this._bothSensorL = false;
        this._viewRangeStatus = 0;
        this._coordinate = [];
        this._sensorSwitch = null;
        this._sideSensor = -1;
        this._rangeVisible = -1;
        this._terrainDecision = -1;
        this._directionFixed = -1;
        this._eventDecision = -1;
        this._regionDecision = "";
    };

    var _Game_CharacterBaseMoveStraight = Game_CharacterBase.prototype.moveStraight;
    Game_CharacterBase.prototype.moveStraight = function(d) {
        var status = (this.direction() == d) ? 1 : 2;
        _Game_CharacterBaseMoveStraight.call(this,d);
        if (this.isMovementSucceeded() && d && this.getSensorStatus() == 1) {
            this.setViewRangeStatus(status);
        }
    };

    var _Game_CharacterBaseMoveDiagonally = Game_CharacterBase.prototype.moveDiagonally;
    Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
        _Game_CharacterBaseMoveDiagonally.call(this,horz, vert);
        if (this.isMovementSucceeded() && this.getSensorStatus() == 1) {
            this.setViewRangeStatus(2);
        }
    };

    var _Game_CharacterBaseSetDirection = Game_CharacterBase.prototype.setDirection;
    Game_CharacterBase.prototype.setDirection = function(d) {
        var status = (this.direction() == d) ? 1 : 2;
        if (!this.isDirectionFixed() && d && this.getSensorStatus() == 1) {
            this.setViewRangeStatus(status);
        }
        _Game_CharacterBaseSetDirection.call(this,d);
    }
    Game_CharacterBase.prototype.startViewRange = function() {
        this.setViewRangeStatus(1);
    };

    Game_CharacterBase.prototype.setSensorStatus = function(sensorStatus) {
        this._sensorStatus = sensorStatus;
    };

    Game_CharacterBase.prototype.getSensorStatus = function() {
        return this._sensorStatus;
    };

    Game_CharacterBase.prototype.setFoundStatus = function(foundStatus) {
        this._foundStatus = foundStatus;
    };

    Game_CharacterBase.prototype.getFoundStatus = function() {
        return this._foundStatus;
    };

    Game_CharacterBase.prototype.setSensorType = function(sensorType) {
        this._sensorType = sensorType;
    };

    Game_CharacterBase.prototype.getSensorType = function() {
        return this._sensorType;
    };

    Game_CharacterBase.prototype.setSensorRange = function(sensorRange) {
        this._sensorRange = sensorRange;
    };

    Game_CharacterBase.prototype.getSensorRange = function() {
        return parseInt(ConvVb(this._sensorRange), 10);
    };

    Game_CharacterBase.prototype.setSensorRangeC = function(sensorRangeC) {
        this._sensorRangeC = sensorRangeC;
    };

    Game_CharacterBase.prototype.getSensorRangeC = function() {
        return parseInt(ConvVb(this._sensorRangeC), 10);
    };

    Game_CharacterBase.prototype.setViewRangeStatus = function(viewRangeStatus) {
        this._viewRangeStatus = viewRangeStatus;
    };

    Game_CharacterBase.prototype.getViewRangeStatus = function() {
        return this._viewRangeStatus;
    };

    Game_CharacterBase.prototype.setCoordinate = function(x, y, status) {
        this._coordinate.push([x, y, status, -1]);
    };

    Game_CharacterBase.prototype.getCoordinate = function() {
        return this._coordinate;
    };

    Game_CharacterBase.prototype.clearCoordinate = function() {
        this._coordinate = [];
    };

    Game_CharacterBase.prototype.setBothSensorRight = function(bothSensor) {
        this._bothSensorR = bothSensor;
    };

    Game_CharacterBase.prototype.getBothSensorRight = function() {
        return this._bothSensorR;
    };

    Game_CharacterBase.prototype.setBothSensorLeft = function(bothSensor) {
        this._bothSensorL = bothSensor;
    };

    Game_CharacterBase.prototype.getBothSensorLeft = function() {
        return this._bothSensorL;
    };

    Game_CharacterBase.prototype.setBothSensor = function(bothSensor) {
        this._sideSensor = bothSensor;
    };

    Game_CharacterBase.prototype.getBothSensor = function() {
        return parseInt(ConvSw(this._sideSensor, this), 10);
    };

    Game_CharacterBase.prototype.setSensorSwitch = function(sensorSwitch) {
        if(isFinite(sensorSwitch)) {
            this._sensorSwitch = parseInt(sensorSwitch, 10);
        } else if(sensorSwitch.toLowerCase().match(/[a-d]/)) {
            this._sensorSwitch = sensorSwitch.toUpperCase();
        }
    };

    Game_CharacterBase.prototype.getSensorSwitch = function() {
        return this._sensorSwitch;
    };

    Game_CharacterBase.prototype.setRangeVisible = function(rangeVisible) {
        this._rangeVisible = rangeVisible;
    };

    Game_CharacterBase.prototype.getRangeVisible = function() {
        return parseInt(ConvSw(this._rangeVisible, this), 10);
    };

    Game_CharacterBase.prototype.setTerrainDecision = function(terrainDecision) {
        this._terrainDecision = terrainDecision;
    };

    Game_CharacterBase.prototype.getTerrainDecision = function() {
        return parseInt(ConvSw(this._terrainDecision, this), 10);
    };

    Game_CharacterBase.prototype.setEventDecision = function(eventDecision) {
        this._eventDecision = eventDecision;
    };

    Game_CharacterBase.prototype.getEventDecision = function() {
        return parseInt(ConvSw(this._eventDecision, this), 10);
    };

    Game_CharacterBase.prototype.setRegionDecision = function(regionDecision) {
        this._regionDecision = String(regionDecision);
    };

    Game_CharacterBase.prototype.getRegionDecision = function() {
        return this._regionDecision;
    };

    Game_CharacterBase.prototype.setDirectionFixed = function(directionFixed) {
        var direction;

        switch(directionFixed) {
            case "u":
                direction = DIR_UP;
                break;
            case "r":
                direction = DIR_RIGHT;
                break;
            case "l":
                direction = DIR_LEFT;
                break;
            case "d":
                direction = DIR_DOWN;
                break;
            default:
                direction = -1;
        }
        this._directionFixed = parseInt(direction, 10);
    };

    Game_CharacterBase.prototype.getDirectionFixed = function() {
        return this._directionFixed;
    };

    Game_CharacterBase.prototype.isMapPassableEx = function(x, y, d) {
        var x2, y2, d2, passableFlag, events, eventDecision, regionDecisions;
        x2 = $gameMap.roundXWithDirection(x, d);
        y2 = $gameMap.roundYWithDirection(y, d);
        d2 = this.reverseDir(d);
        eventDecision = CEC(DefEventDecision);
        regionDecisions = getRegionIds(DefRegionDecisions, this.getRegionDecision());
        passableFlag = true;


        if($gameMap.isPassable(x, y, d) && $gameMap.isPassable(x2, y2, d2)) {
            if(this.getEventDecision() == 1
                    || (this.getEventDecision() == -1 && eventDecision)) {
                events = $gameMap.eventsXyNt(x2, y2);
                passableFlag = !events.some(function(event) {
                    return event.isNormalPriority();
                });
            }
            if(regionDecisions.length > 0 && passableFlag == true) {
                passableFlag = !regionDecisions.contains($gameMap.regionId(x2, y2));
            }
        } else {
            passableFlag = false;
        }

        return passableFlag;
    };


    //=========================================================================
    // Game_Map
    //  探索開始処理の自動実行を定義します。
    //=========================================================================
    if(DefAutoSensor[0]) {
        var _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
        Game_Map.prototype.setupEvents = function() {
            _Game_Map_setupEvents.call(this);
            $gameSystem.startSensor();
        };
    }


    //=========================================================================
    // Game_Event
    //  プレイヤーとの距離を測り
    //  指定範囲内にプレイヤーがいる場合に指定されたスイッチをONにします。
    //=========================================================================
    var _Game_EventSetupPageSettings = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function() {
        _Game_EventSetupPageSettings.call(this);
        if(this.getSensorStatus() == -2) {
            this.setupSensor();
        }
        if($gameSystem.isFoundPlayer() == this.eventId()) {
            this.turnTowardPlayer();
        }
    };

    Game_Event.prototype.setupSensor = function() {
        var event, pattern, match, note, cnt, i, n, m,
            options, op, value;
        event = this.event();
        pattern = /<(.?)(?:psensor)(l|f|s|d)?(?:\:)(\\v\[\d+\]|\d+)([ 0-9a-z\[\]\\]*)?>/i

        if(event.note) {
            note = event.note.toLowerCase();
            note = note.split(/ (?=<)/);
            cnt = note.length;

            for(i = 0;i < cnt;i++) {
                n = note[i].trim();

                if(n.match(pattern)) {
                    match = n.match(pattern);
                    if(match[1] && match[1] == "!") { // 探索一時無効
                        this.setSensorStatus(-1);
                    }
                    switch(match[2]) { // 探索種別
                        case "l":
                        case "f":
                        case "s":
                        case "d":
                            this.setSensorType(match[2]);
                            break;
                        default:
                            continue;
                            break;
                    }
                    if(match[3]) { // 探索対象マス数
                        value = match[3];
                        value = value.replace(/\\/g, '\x1b');
                        value = value.replace(/\x1b\x1b/g, '\\');
                        this.setSensorRange(match[3]);
                        this.setSensorRangeC(match[3]);
                    }
                    if(match[4]) { // オプション
                        options = match[4].trim().split(" ");
                        options.forEach(function(op){
                            op = op.replace(/\\/g, '\x1b');
                            op = op.replace(/\x1b\x1b/g, '\\');
                            if(op.match(/^sw([a-d]|\d+)$/)) { // スイッチ指定
                                m = op.match(/^sw([a-d]|\d+)$/);
                                this.setSensorSwitch(m[1]);
                            } else if(op.match(/^bo([0-1]|\x1bs\[(\d+|[a-d])\])$/)) { // 両隣探索指定
                                m = op.match(/^bo([0-1]|\x1bs\[(\d+|[a-d])\])$/);
                                this.setBothSensor(m[1]);
                            } else if(op.match(/^rv([0-1]|\x1bs\[(\d+|[a-d])\])$/)) { // 描画指定
                                m = op.match(/^rv([0-1]|\x1bs\[(\d+|[a-d])\])$/);
                                this.setRangeVisible(m[1]);
                            } else if(op.match(/^td([0-1]|\x1bs\[(\d+|[a-d])\])$/)) { // 地形考慮指定
                                m = op.match(/^td([0-1]|\x1bs\[(\d+|[a-d])\])$/);
                                this.setTerrainDecision(m[1]);
                            } else if(op.match(/^di([urld])$/)) { // 探索方向固定
                                m = op.match(/^di([urld])$/);
                                this.setDirectionFixed(m[1]);
                            } else if(op.match(/^ev([0-1]|\x1bs\[(\d+|[a-d])\])$/)) { // イベント考慮指定
                                m = op.match(/^ev([0-1]|\x1bs\[(\d+|[a-d])\])$/);
                                this.setEventDecision(m[1]);
                            } else if(op.match(/^rg(\d+|\x1bv\[(\d+)\])$/)) { // リージョン考慮指定
                                m = op.match(/^rg(\d+|\x1bv\[(\d+)\])$/);
                                this.setRegionDecision(m[1]);
                            }
                        }, this);
                    }
                }
            }
        }
    };

    var _Game_EventUpdate = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {
        _Game_EventUpdate.call(this);
        if($gameSystem.isSensorStart()) this.sensorTarget();
    };

    Game_Event.prototype.sensorTarget = function() {
        var mapId, eventId, sw, key, st, sensorSwitch;
        sensorSwitch = DefSensorSwitch[0];
        // 探索中のイベントであること
        if(this.getSensorStatus() == 1){
            // マップイベント実行中でないこと
            if(!this.isStarting()) {
                mapId = $gameMap.mapId();
                eventId = this.eventId();
                sw = (this.getSensorSwitch() != null)? this.getSensorSwitch() : sensorSwitch;
                if(this.isFoundPlayer()) {
                    if(isFinite(sw)) {
                        if(!$gameSwitches.value(sw)) {
                            $gameSwitches.setValue(sw, true);
                        }
                        $gameSystem.setSwitchStatuses(sw, eventId);
                    } else if(sw.match(/[a-dA-D]/)) {
                        key = [mapId, eventId, sw.toUpperCase()];
                        if(!$gameSelfSwitches.value(key)) {
                            $gameSelfSwitches.setValue(key, true);
                        }
                    }
                } else {
                    if(isFinite(sw)) {
                        if($gameSwitches.value(sw) && !$gameSystem.isSwitchStatuses(sw)) {
                            $gameSwitches.setValue(sw, false);
                        }
                        $gameSystem.removeSwitchStatuses(sw, eventId);
                    } else if(sw.match(/[a-dA-D]/)) {
                        key = [mapId, eventId, sw.toUpperCase()];
                        if($gameSelfSwitches.value(key)) {
                            $gameSelfSwitches.setValue(key, false);
                        }
                    }

/*
                    st = false;
                    if(isFinite(sw)) {
                        st = $gameSwitches.value(sw);
                    } else if(sw.match(/[a-dA-D]/)) {
                        st = $gameSelfSwitches.value([mapId, eventId, sw.toUpperCase()]);
                    }
                    if(st) {
                        if(isFinite(sw)) {
                            $gameSwitches.setValue(sw, false);
                        } else if(sw.match(/[a-dA-D]/)) {
                            $gameSelfSwitches.setValue([mapId, eventId, sw.toUpperCase()], false);
                        }
                    }
*/
                }
            }
        }
    };

    Game_Event.prototype.isFoundPlayer = function() {
        var result = false;
        switch(this.getSensorType()) {
            case "l": // 直線の探索
                result = this.sensorLine();
                break;
            case "f": // 扇範囲の探索
                result = this.sensorFan();
                break;
            case "s": // 四角範囲の探索
                result = this.sensorSquare();
                break;
            case "d": // 菱形範囲の探索
                result = this.sensorDiamond();
                break;
        }
        if(result) {
            $gameSystem.setFoundPlayer(this.eventId());
        }
        return result;
    };

    // 直線の探索
    Game_Event.prototype.sensorLine = function() {
        var sensorRange, sensorRangeC, strDir, diagoDir, dir, dirFixed, sx, sy, ex, ey, i,
        coordinates, px, py, cnt;
        sensorRange = this.getSensorRange();
        dirFixed = this.getDirectionFixed();
        dir = (dirFixed == -1)? this.direction() : dirFixed;
        px = $gamePlayer.x;
        py = $gamePlayer.y;
        sx = this.deltaXFrom($gamePlayer.x);
        sy = this.deltaYFrom($gamePlayer.y);
        ex = this.x;
        ey = this.y;

        // currentRange初期化
        //this.setSensorRangeC(sensorRange);
        sensorRangeC = sensorRange;

        // coordinate初期化
        this.clearCoordinate();

        switch(dir) {
            case 8:// 上向き(y<0)
                strDir = DIR_UP;
                diagoDir = DIR_RIGHT;

                // 正面範囲確定
                this.rangeSearch(strDir, 0, 0, 0, -1, sensorRange);

                // 隣接マス探索
                if(this.isSideSearch(diagoDir, this.reverseDir(diagoDir), -1, 0)) return true;

                // プレイヤー範囲探索
                coordinates = this.getCoordinate();
                cnt = coordinates.length;
                if(cnt == 1) {
                    i = 0;
                    if(coordinates[i][0] == 0 && coordinates[i][1] == 0) {
                    } else {
                        if(px == ex + coordinates[i][0]
                                && py <= ey + Math.abs(coordinates[i][0])
                                && py >= ey + coordinates[i][1]) {
                            return true;
                        }
                    }
                }

                break;
            case 6:// 右向き(x>0)
                strDir = DIR_RIGHT;
                diagoDir = DIR_DOWN;

                // 正面範囲確定
                this.rangeSearch(strDir, 0, 0, 1, 0, sensorRange);

                // 隣接マス探索
                if(this.isSideSearch(diagoDir, this.reverseDir(diagoDir), 0, -1)) return true;

                // プレイヤー範囲探索
                coordinates = this.getCoordinate();
                cnt = coordinates.length;
                if(cnt == 1) {
                    i = 0;
                    if(coordinates[i][0] == 0 && coordinates[i][1] == 0) {
                    } else {
                        if(py == ey + coordinates[i][1]
                                && px >= ex + Math.abs(coordinates[i][1])
                                && px <= ex + coordinates[i][0]) {
                            return true;
                        }
                    }
                }

                break;
            case 4:// 左向き(x<0)
                strDir = DIR_LEFT;
                diagoDir = DIR_UP;

                // 正面範囲確定
                this.rangeSearch(strDir, 0, 0, -1, 0, sensorRange);

                // 隣接マス探索
                if(this.isSideSearch(diagoDir, this.reverseDir(diagoDir), 0, 1)) return true;

                // プレイヤー範囲探索
                coordinates = this.getCoordinate();
                cnt = coordinates.length;
                if(cnt == 1) {
                    i = 0;
                    if(coordinates[i][0] == 0 && coordinates[i][1] == 0) {
                    } else {
                        if(py == ey + coordinates[i][1]
                                && px <= ex + Math.abs(coordinates[i][1])
                                && px >= ex + coordinates[i][0]) {
                            return true;
                        }
                    }
                }

                break;
            case 2:// 下向き(y>0)
                strDir = DIR_DOWN;
                diagoDir = DIR_LEFT;

                // 正面範囲確定
                this.rangeSearch(strDir, 0, 0, 0, 1, sensorRange);

                // 隣接マス探索
                if(this.isSideSearch(diagoDir, this.reverseDir(diagoDir), 1, 0)) return true;

                // プレイヤー範囲探索
                coordinates = this.getCoordinate();
                cnt = coordinates.length;
                if(cnt == 1) {
                    i = 0;
                    if(coordinates[i][0] == 0 && coordinates[i][1] == 0) {
                    } else {
                        if(px == ex + coordinates[i][0]
                                && py >= ey + Math.abs(coordinates[i][0])
                                && py <= ey + coordinates[i][1]) {
                            return true;
                        }
                    }
                }

                break;
        }

        return false;
    };

    // 扇範囲の探索
    Game_Event.prototype.sensorFan = function() {
        var sensorRange, sensorRangeC, dir, dirFixed, sx, sy, ex, ey, px, py,
            noPass, noPassTemp, i, j, coordinates, sign, strDir, diagoDir, cnt,
            terrainDecision;
        sensorRange = this.getSensorRange();
        dirFixed = this.getDirectionFixed();
        dir = (dirFixed == -1)? this.direction() : dirFixed;
        px = $gamePlayer.x;
        py = $gamePlayer.y;
        sx = this.deltaXFrom(px);
        sy = this.deltaYFrom(py);
        ex = this.x;
        ey = this.y;
        noPass = 0;
        terrainDecision = CEC(DefTerrainDecision);

        // currentRange初期化
        this.setSensorRangeC(sensorRange);
        sensorRangeC = sensorRange;

        // coordinate初期化
        this.clearCoordinate();

        switch(dir) {
            case DIR_UP:// 上向き(y<0)
                sign = 1;
                strDir = DIR_UP;
                diagoDir = DIR_RIGHT;

                // 正面範囲確定
                noPass = this.rangeSearch(strDir, 0, 0, 0, -1, sensorRange);
                if(noPass != sensorRange) noPass++;

                // 切り替え用
                this.setCoordinate(0, 0, "C");
                noPassTemp = noPass;

                // 斜め直線上の範囲確定
                for(i = 1;i < 3; i++) {
                    for(j = 0; j <= sensorRange; j++) {
                        if(j > 0) {
                            noPassTemp = this.rangeSearch(strDir, j * sign, -j, 0, -1, noPassTemp);
                            if(j != noPassTemp) {
                                noPassTemp++;
                            } else {
                                noPassTemp = noPassTemp + j;
                            }
                        }
                        if(this.getTerrainDecision() == 1
                                || (this.getTerrainDecision() == -1 && terrainDecision)) {
                            if(!this.isMapPassableEx(ex + j * sign, ey - j, diagoDir)
                                    || !this.isMapPassableEx(ex + j * sign, ey - j, strDir)
                                    || !this.isMapPassableEx(ex + j * sign, ey - j - 1, diagoDir)
                                    || !this.isMapPassableEx(ex + (j + 1) * sign, ey - j, strDir)) {
                                break;
                            }
                        }
                    }

                    // 配列の要素数合わせ
                    this.addCoordinate(sensorRange * i + 1 + i);

                    if(i == 1) {
                        // 切り替え用
                        this.setCoordinate(0, 0, "C");
                        noPassTemp = noPass;
                        sign = signChange(sign);
                        diagoDir = this.reverseDir(diagoDir);
                    }
                }

                // 隣接マス探索
                if(this.isSideSearch(this.reverseDir(diagoDir), diagoDir, -1, 0)) return true;

                // プレイヤー範囲探索
                coordinates = this.getCoordinate();
                cnt = coordinates.length;
                for(i = 0; i < cnt; i++) {
                    if(coordinates[i][2] == "Add") {
                        continue;
                    }else if(coordinates[i][2] == "C") {
                        continue;
                    }else if(coordinates[i][0] == 0 && coordinates[i][1] == 0) {
                        continue;
                    }
                    if(px == ex + coordinates[i][0]
                            && py <= ey - Math.abs(coordinates[i][0])
                            && py >= ey + coordinates[i][1]) {
                        return true;
                    }
                }

                break;
            case DIR_RIGHT:// 右向き(x>0)
                sign = 1;
                strDir = DIR_RIGHT;
                diagoDir = DIR_DOWN;

                // 正面範囲確定
                noPass = this.rangeSearch(strDir, 0, 0, 1, 0, sensorRange);
                if(noPass != sensorRange) noPass++;

                // 切り替え用
                this.setCoordinate(0, 0, "C");
                noPassTemp = noPass;

                // 斜め直線上の範囲確定
                for(i = 1;i < 3; i++) {
                    for(j = 0; j <= sensorRange; j++) {
                        if(j > 0) {
                            noPassTemp = this.rangeSearch(strDir, j, j * sign, 1, 0, noPassTemp);
                            if(j != noPassTemp) {
                                noPassTemp++;
                            } else {
                                noPassTemp = noPassTemp + j;
                            }
                        }
                        if(this.getTerrainDecision() == 1
                                || (this.getTerrainDecision() == -1 && terrainDecision)) {
                            if(!this.isMapPassableEx(ex + j, ey + j * sign, diagoDir)
                                    || !this.isMapPassableEx(ex + j, ey + j * sign, strDir)
                                    || !this.isMapPassableEx(ex + j + 1, ey + j * sign, diagoDir)
                                    || !this.isMapPassableEx(ex + j, ey + (j + 1) * sign, strDir)) {
                                break;
                            }
                        }
                    }

                    // 配列の要素数合わせ
                    this.addCoordinate(sensorRange * i + 1 + i);

                    if(i == 1) {
                        // 切り替え用
                        this.setCoordinate(0, 0, "C");
                        noPassTemp = noPass;
                        sign = signChange(sign);
                        diagoDir = this.reverseDir(diagoDir);
                    }
                }

                // 隣接マス探索
                if(this.isSideSearch(this.reverseDir(diagoDir), diagoDir, 0, -1)) return true;

                // プレイヤー範囲探索
                coordinates = this.getCoordinate();
                cnt = coordinates.length;
                for(i = 0; i < cnt; i++) {
                    if(coordinates[i][2] == "Add") {
                        continue;
                    }else if(coordinates[i][2] == "C") {
                        continue;
                    }else if(coordinates[i][0] == 0 && coordinates[i][1] == 0) {
                        continue;
                    }
                    if(py == ey + coordinates[i][1]
                            && px >= ex + Math.abs(coordinates[i][1])
                            && px <= ex + coordinates[i][0]) {
                        return true;
                    }
                }

                break;
            case DIR_LEFT:// 左向き(x<0)
                sign = -1;
                strDir = DIR_LEFT;
                diagoDir = DIR_UP;

                // 正面範囲確定
                noPass = this.rangeSearch(strDir, 0, 0, -1, 0, sensorRange);
                if(noPass != sensorRange) noPass++;

                // 切り替え用
                this.setCoordinate(0, 0, "C");
                noPassTemp = noPass;

                // 斜め直線上の範囲確定
                for(i = 1;i < 3; i++) {
                    for(j = 0; j <= sensorRange; j++) {
                        if(j > 0) {
                            noPassTemp = this.rangeSearch(strDir, -j, j * sign, -1, 0, noPassTemp);
                            if(j != noPassTemp) {
                                noPassTemp++;
                            } else {
                                noPassTemp = noPassTemp + j;
                            }
                        }
                        if(this.getTerrainDecision() == 1
                                || (this.getTerrainDecision() == -1 && terrainDecision)) {
                            if(!this.isMapPassableEx(ex - j, ey + j * sign, diagoDir)
                                    || !this.isMapPassableEx(ex - j, ey + j * sign, strDir)
                                    || !this.isMapPassableEx(ex - j - 1, ey + j * sign, diagoDir)
                                    || !this.isMapPassableEx(ex - j, ey + (j + 1) * sign, strDir)) {
                                break;
                            }
                        }
                    }

                    // 配列の要素数合わせ
                    this.addCoordinate(sensorRange * i + 1 + i);

                    if(i == 1) {
                        // 切り替え用
                        this.setCoordinate(0, 0, "C");
                        noPassTemp = noPass;
                        sign = signChange(sign);
                        diagoDir = this.reverseDir(diagoDir);
                    }
                }

                // 隣接マス探索
                if(this.isSideSearch(this.reverseDir(diagoDir), diagoDir, 0, 1)) return true;

                // プレイヤー範囲探索
                coordinates = this.getCoordinate();
                cnt = coordinates.length;
                for(i = 0; i < cnt; i++) {
                    if(coordinates[i][2] == "Add") {
                        continue;
                    }else if(coordinates[i][2] == "C") {
                        continue;
                    }else if(coordinates[i][0] == 0 && coordinates[i][1] == 0) {
                        continue;
                    }
                    if(py == ey + coordinates[i][1]
                            && px <= ex - Math.abs(coordinates[i][1])
                            && px >= ex + coordinates[i][0]) {
                        return true;
                    }
                }

                break;
            case DIR_DOWN:// 下向き(y>0)
                sign = -1;
                strDir = DIR_DOWN;
                diagoDir = DIR_LEFT;

                // 正面範囲確定
                noPass = this.rangeSearch(strDir, 0, 0, 0, 1, sensorRange);
                if(noPass != sensorRange) noPass++;

                // 切り替え用
                this.setCoordinate(0, 0, "C");
                noPassTemp = noPass;

                // 斜め直線上の範囲確定
                for(i = 1;i < 3; i++) {
                    for(j = 0; j <= sensorRange; j++) {
                        if(j > 0) {
                            noPassTemp = this.rangeSearch(strDir, j * sign, j, 0, 1, noPassTemp);
                            if(j != noPassTemp) {
                                noPassTemp++;
                            } else {
                                noPassTemp = noPassTemp + j;
                            }
                        }
                        if(this.getTerrainDecision() == 1
                                || (this.getTerrainDecision() == -1 && terrainDecision)) {
                            if(!this.isMapPassableEx(ex + j * sign, ey + j, diagoDir)
                                    || !this.isMapPassableEx(ex + j * sign, ey + j, strDir)
                                    || !this.isMapPassableEx(ex + j * sign, ey + j + 1, diagoDir)
                                    || !this.isMapPassableEx(ex + (j + 1) * sign, ey + j, strDir)) {
                                break;
                            }
                        }
                    }

                    // 配列の要素数合わせ
                    this.addCoordinate(sensorRange * i + 1 + i);

                    if(i == 1) {
                        // 切り替え用
                        this.setCoordinate(0, 0, "C");
                        noPassTemp = noPass;
                        sign = signChange(sign);
                        diagoDir = this.reverseDir(diagoDir);
                    }
                }

                // 隣接マス探索
                if(this.isSideSearch(this.reverseDir(diagoDir), diagoDir, 1, 0)) return true;

                // プレイヤー範囲探索
                coordinates = this.getCoordinate();
                cnt = coordinates.length;
                for(i = 0; i < cnt; i++) {
                    if(coordinates[i][2] == "Add") {
                        continue;
                    }else if(coordinates[i][2] == "C") {
                        continue;
                    }else if(coordinates[i][0] == 0 && coordinates[i][1] == 0) {
                        continue;
                    }
                    if(px == ex + coordinates[i][0]
                            && py >= ey + Math.abs(coordinates[i][0])
                            && py <= ey + coordinates[i][1]) {
                        return true;
                    }
                }

                break;
        }

        return false;
    };

    // 菱形範囲の探索(地形考慮完全無視)
    Game_Event.prototype.sensorDiamond = function() {
        var sensorRange, sx, sy, ex, ey, px, py,
            i, j, coordinates, sign, strDir, diagoDir, cnt;
        sensorRange = this.getSensorRange();
        px = $gamePlayer.x;
        py = $gamePlayer.y;
        sx = this.deltaXFrom(px);
        sy = this.deltaYFrom(py);
        ex = this.x;
        ey = this.y;

        // currentRange初期化
        this.setSensorRangeC(sensorRange);

        // coordinate初期化
        this.clearCoordinate();

        // coordinateセット
        this.setCoordinate(0, -sensorRange, DIR_RIGHT);
        this.setCoordinate(sensorRange, 0, DIR_DOWN);
        this.setCoordinate(0, sensorRange, DIR_LEFT);
        this.setCoordinate(-sensorRange, 0, DIR_UP);

        // プレイヤー範囲探索
        if(Math.abs(sx) + Math.abs(sy) <= sensorRange) {
            return true;
        }
    }

    // 四角範囲の探索(地形考慮完全無視)
    Game_Event.prototype.sensorSquare = function() {
        var sensorRange, sx, sy, ex, ey, px, py,
            i, j, coordinates, sign, strDir, diagoDir, cnt;
        sensorRange = this.getSensorRange();
        px = $gamePlayer.x;
        py = $gamePlayer.y;
        sx = this.deltaXFrom(px);
        sy = this.deltaYFrom(py);
        ex = this.x;
        ey = this.y;

        // currentRange初期化
        this.setSensorRangeC(sensorRange);

        // coordinate初期化
        this.clearCoordinate();

        // プレイヤー範囲探索
        if(Math.abs(sx) <= sensorRange && Math.abs(sy) <= sensorRange) {
            return true;
        }
    }

    Game_Event.prototype.isSideSearch = function(directionR, directionL, vx, vy) {
        var sx, sy, ex, ey, bothSensor, terrainDecision;
        sx = this.deltaXFrom($gamePlayer.x);
        sy = this.deltaYFrom($gamePlayer.y);
        ex = this.x;
        ey = this.y;
        bothSensor = CEC(DefBothSensor);
        terrainDecision = CEC(DefTerrainDecision);

        if(this.getBothSensor() == -1 && bothSensor) {
            if(this.getTerrainDecision() == 1
                    || (this.getTerrainDecision() == -1 && terrainDecision)) {
                this.setBothSensorRight(this.isMapPassableEx(ex, ey, directionR));
                this.setBothSensorLeft(this.isMapPassableEx(ex, ey, directionL));
            } else {
                this.setBothSensorRight(true);
                this.setBothSensorLeft(true);
            }
        } else if(this.getBothSensor() == 1) {
            if(this.getTerrainDecision() == 1
                    || (this.getTerrainDecision() == -1 && terrainDecision)) {
                this.setBothSensorRight(this.isMapPassableEx(ex, ey, directionR));
                this.setBothSensorLeft(this.isMapPassableEx(ex, ey, directionL));
            } else {
                this.setBothSensorRight(true);
                this.setBothSensorLeft(true);
            }
        } else {
            this.setBothSensorRight(false);
            this.setBothSensorLeft(false);
        }

        if(this.getBothSensorRight() && sx == vx && sy == vy) {
            return true;
        }
        vx = (vx == 0)? vx : -vx;
        vy = (vy == 0)? vy : -vy;
        if(this.getBothSensorLeft() && sx == vx && sy == vy) {
            return true;
        }
        return false;
    };

    Game_Event.prototype.rangeSearch = function(strDir, rx, ry, signX, signY, noPass) {
        var sensorRange, ex, ey, cx, cy, sx, sy, j, obstacle ,cnt, status,
            noPassDir, terrainDecision;
        sensorRange = this.getSensorRange();
        cnt = sensorRange - Math.abs(rx);
        ex = this.x;
        ey = this.y;
        obstacle = -1;
        status = "Last";
        noPassDir = (signX != 0)? ry : rx;
        terrainDecision = CEC(DefTerrainDecision);

        // 正面探索
        for(j = 0; j <= cnt; j++) {
            cx = rx + j * signX;
            cy = ry + j * signY;
            if(this.getTerrainDecision() == 1
                    || (this.getTerrainDecision() == -1 && terrainDecision)) {
                if(!this.isMapPassableEx(ex + cx, ey + cy, strDir) && j < sensorRange) {
                    obstacle = j + Math.abs(rx);
                    status = "Line";
                    break;
                }
                if(j + Math.abs(noPassDir) >= noPass && noPass < sensorRange) {
                    status = "Nopass";
                    break;
                }
            }
        }

        // 座標セット
        sx = this.deltaXFrom(ex + cx);
        if(sx != 0) sx *= -1;
        sy = this.deltaYFrom(ey + cy);
        if(sy != 0) sy *= -1;
        this.setCoordinate(sx, sy, status);

        return (obstacle < 0)? noPass : obstacle;
    };

    var _GameEvent_lock = Game_Event.prototype.lock;
    Game_Event.prototype.lock = function() {
        if(this.getSensorStatus() != 1) {
            _GameEvent_lock.call(this);
        } else {
            // 話しかけられた場合振り向かない(探索者が探索中に限る)
            if (!this._locked) {
                this._prelockDirection = this.direction();
                // this.turnTowardPlayer();
                this._locked = true;
            }
        }
    };

    Game_Event.prototype.addCoordinate = function(length) {
        // 左右の配列要素数を指定数に合わせる
        var coordinates, cnt, j;
        coordinates = this.getCoordinate();
        cnt = coordinates.length;
        for(j = cnt; j < length; j++) {
            this.setCoordinate(0, 0, "Add");
        }
    };


    //=========================================================================
    // Spriteset_Map
    //  探索者の視界範囲を表す図形を描画させる処理を追加定義します。
    //=========================================================================
    var _createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        _createLowerLayer.call(this);
        this.createViewRange();
    }

    Spriteset_Map.prototype.createViewRange = function() {
        this._viewRangeSprites = [];
        $gameMap.events().forEach(function(event) {
            if(event._sensorType) {
                this._viewRangeSprites.push(new Sprite_ViewRange(event));
            }
        }, this);
        for (var i = 0; i < this._viewRangeSprites.length; i++) {
            this._tilemap.addChild(this._viewRangeSprites[i]);
        }
    };


    //=========================================================================
    // Sprite_ViewRange
    //  探索者の視界範囲を表す図形を描画させる処理を定義します。
    //=========================================================================
    function Sprite_ViewRange() {
        this.initialize.apply(this, arguments);
    }

    Sprite_ViewRange.prototype = Object.create(Sprite.prototype);
    Sprite_ViewRange.prototype.constructor = Sprite_ViewRange;

    Sprite_ViewRange.prototype.initialize = function(character) {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
        this.setCharacter(character);
        this._frameCount = 0;
        this.z = 6;
    };

    Sprite_ViewRange.prototype.initMembers = function() {
        this._character = null;
        this._coordinates = null;
    };

    Sprite_ViewRange.prototype.setCharacter = function(character) {
        this._character = character;
    };

    Sprite_ViewRange.prototype.update = function() {
        var sensorStatus, rangeStatus, rangeVisible, defVisible;

        Sprite.prototype.update.call(this);

        sensorStatus = this._character.getSensorStatus();
        rangeStatus = this._character.getViewRangeStatus();
        rangeVisible = this._character.getRangeVisible();
        defVisible = CEC(DefRangeVisible);

        if(sensorStatus == 1 && (rangeVisible == 1 || (rangeVisible == -1 && defVisible))) {
            this.updatePosition();
            if(this.bitmap) {
                if(rangeStatus == 1) {
                    // 描画更新
                    if(this._coordinate.length == 0) {
                        this._coordinate = this._character.getCoordinate();
                    }
                    this.updateBitmap();
                } else if(rangeStatus == 2) {
                    // 描画新規
                    this._coordinate = this._character.getCoordinate();
                    this.createBitmap();
                }
            } else {
                // 描画新規
                this._coordinate = this._character.getCoordinate();
                this.createBitmap();
            }
            this.visible = true;
        } else {
            this.visible = false;
        }
    };

    Sprite_ViewRange.prototype.createBitmap = function() {
        var direction, dirFixed, sensorRange, sensorRangeC, sensorType,
            tileWidth, tileHeight, width, height, coordinates,
            sideSensorR, sideSensorL, bs, bias, color, opacity,
            bothSensor;
        direction = this._character.direction();
        dirFixed = this._character.getDirectionFixed();
        direction = (dirFixed == -1)? direction : dirFixed;
        bothSensor = CEC(DefBothSensor);
        coordinates = this._coordinate;
        sensorType = this._character.getSensorType();
        sensorRangeC = this._character.getSensorRangeC();
        sensorRange = this._character.getSensorRange();
        tileWidth = $gameMap.tileWidth();
        tileHeight = $gameMap.tileHeight();
        sideSensorR = this._character.getBothSensorRight();
        sideSensorL = this._character.getBothSensorLeft();
        bias = (bothSensor)? 3
            : (this._character.getBothSensor() > 0)? 3 : 1;
        color = DefRangeColor[0];
        opacity = DefRangeOpacity[0];

        switch(sensorType) {
            case "l":
                if(direction == DIR_UP) {
                    width = tileWidth * bias;
                    height = tileHeight * sensorRange + tileWidth;
                    this.anchor.x = 0.5;
                    this.anchor.y = 1;
                } else if(direction == DIR_RIGHT) {
                    width = tileWidth * sensorRange + tileWidth;
                    height = tileHeight * bias;
                    this.anchor.x = 0;
                    this.anchor.y = 0.5;
                } else if(direction == DIR_LEFT) {
                    width = tileWidth * sensorRange + tileWidth;
                    height = tileHeight * bias;
                    this.anchor.x = 1;
                    this.anchor.y = 0.5;
                } else if(direction == DIR_DOWN) {
                    width = tileWidth * bias;
                    height = tileHeight * sensorRange + tileHeight;
                    this.anchor.x = 0.5;
                    this.anchor.y = 0;
                }
                this.bitmap = new Bitmap(width, height);
                this.bitmap.fillViewRangeLine(color, this._character);
                break;
            case "f":
                if(direction == DIR_UP) {
                    width = tileWidth * sensorRange * 2 + tileWidth;
                    height = tileHeight * sensorRange + tileWidth;
                    this.anchor.x = 0.5;
                    this.anchor.y = 1;
                } else if(direction == DIR_RIGHT) {
                    width = tileWidth * sensorRange + tileWidth;
                    height = tileHeight * sensorRange * 2 + tileHeight;
                    this.anchor.x = 0;
                    this.anchor.y = 0.5;
                } else if(direction == DIR_LEFT) {
                    width = tileWidth * sensorRange + tileWidth;
                    height = tileHeight * sensorRange * 2 + tileHeight;
                    this.anchor.x = 1;
                    this.anchor.y = 0.5;
                } else if(direction == DIR_DOWN) {
                    width = tileWidth * sensorRange * 2 + tileWidth;
                    height = tileHeight * sensorRange + tileHeight;
                    this.anchor.x = 0.5;
                    this.anchor.y = 0;
                }
                this.bitmap = new Bitmap(width, height);
                this.bitmap.fillViewRangeFan(color, this._character);
                break;
            case "d":
                width = tileWidth * sensorRange * 2 + tileWidth;
                height = tileHeight * sensorRange * 2 + tileHeight;
                this.anchor.x = 0.5;
                this.anchor.y = 0.55;
                this.bitmap = new Bitmap(width, height);
                this.bitmap.fillViewRangeDiamond(color, this._character);
                break;
            case "s":
                width = tileWidth * sensorRange * 2 + tileWidth;
                height = tileHeight * sensorRange * 2 + tileHeight;
                this.anchor.x = 0.5;
                this.anchor.y = 0.55;
                this.bitmap = new Bitmap(width, height);
                this.bitmap.fillAll(color);
                break;
        }

        this.opacity = opacity;
        this.blendMode = Graphics.BLEND_ADD;
        this.visible = true;
        this._character.setViewRangeStatus(1);
    };

    Sprite_ViewRange.prototype.updateBitmap = function() {
        var direction, dirFixed, sensorRange, sensorRangeC, sensorType,
            tileWidth, tileHeight, width, height, i, cnt,
            tmpCoordinate, coordinate, bias, color, opacity,
            bothSensor;
        direction = this._character.direction();
        dirFixed = this._character.getDirectionFixed();
        direction = (dirFixed == -1)? direction : dirFixed;
        bothSensor = CEC(DefBothSensor);
        sensorType = this._character.getSensorType();
        sensorRangeC = this._character.getSensorRangeC();
        sensorRange = this._character.getSensorRange();
        tileWidth = $gameMap.tileWidth();
        tileHeight = $gameMap.tileHeight();
        tmpCoordinate =  this._coordinate;
        coordinate = this._character.getCoordinate();
        cnt = (tmpCoordinate.length < coordinate.length)? tmpCoordinate.length : coordinate.length;
        bias = (bothSensor)? 3
            : (this._character.getBothSensor() > 0)? 3 : 1;
        color = DefRangeColor[0];
        opacity = DefRangeOpacity[0];

        for(i = 0; i < cnt; i++) {
            if(coordinate[i][0] != tmpCoordinate[i][0] || coordinate[i][1] != tmpCoordinate[i][1]) {
                if(tmpCoordinate[i][3] == -1) {
                    tmpCoordinate[i][3] = $gameMap.tileWidth();
                } else if(tmpCoordinate[i][3] != 0) {
                    tmpCoordinate[i][3]--;
                }
            } else {
                coordinate[i][3] = 0;
            }
        }

        switch(sensorType) {
            case "l":
                if(direction == DIR_UP) {
                    width = tileWidth * bias;
                    height = tileHeight * sensorRange + tileWidth;
                    this.anchor.x = 0.5;
                    this.anchor.y = 1;
                } else if(direction == DIR_RIGHT) {
                    width = tileWidth * sensorRange + tileWidth;
                    height = tileHeight * bias;
                    this.anchor.x = 0;
                    this.anchor.y = 0.5;
                } else if(direction == DIR_LEFT) {
                    width = tileWidth * sensorRange + tileWidth;
                    height = tileHeight * bias;
                    this.anchor.x = 1;
                    this.anchor.y = 0.5;
                } else if(direction == DIR_DOWN) {
                    width = tileWidth * bias;
                    height = tileHeight * sensorRange + tileHeight;
                    this.anchor.x = 0.5;
                    this.anchor.y = 0;
                }
                if(this.bitmap.width != width || this.bitmap.height != height) {
                    this.bitmap.clear();
                    this.bitmap = new Bitmap(width, height);
                }
                this.bitmap.fillViewRangeLine(color, this._character);
                break;
            case "f":
                if(direction == DIR_UP) {
                    width = tileWidth * sensorRange * 2 + tileWidth;
                    height = tileHeight * sensorRange + tileWidth;
                    this.anchor.x = 0.5;
                    this.anchor.y = 1;
                } else if(direction == DIR_RIGHT) {
                    width = tileWidth * sensorRange + tileWidth;
                    height = tileHeight * sensorRange * 2 + tileHeight;
                    this.anchor.x = 0;
                    this.anchor.y = 0.5;
                } else if(direction == DIR_LEFT) {
                    width = tileWidth * sensorRange + tileWidth;
                    height = tileHeight * sensorRange * 2 + tileHeight;
                    this.anchor.x = 1;
                    this.anchor.y = 0.5;
                } else if(direction == DIR_DOWN) {
                    width = tileWidth * sensorRange * 2 + tileWidth;
                    height = tileHeight * sensorRange + tileHeight;
                    this.anchor.x = 0.5;
                    this.anchor.y = 0;
                }
                if(this.bitmap.width != width || this.bitmap.height != height) {
                    this.bitmap.clear();
                    this.bitmap = new Bitmap(width, height);
                }
                this.bitmap.fillViewRangeFan(color, this._character);
                break;
            case "d":
                width = tileWidth * sensorRange * 2 + tileWidth;
                height = tileHeight * sensorRange * 2 + tileHeight;
                this.anchor.x = 0.5;
                this.anchor.y = 0.55;
                if(this.bitmap.width != width || this.bitmap.height != height) {
                    this.bitmap.clear();
                    this.bitmap = new Bitmap(width, height);
                }
                this.bitmap.fillViewRangeDiamond(color, this._character);
                break;
            case "s":
                width = tileWidth * sensorRange * 2 + tileWidth;
                height = tileHeight * sensorRange * 2 + tileHeight;
                this.anchor.x = 0.5;
                this.anchor.y = 0.55;
                if(this.bitmap.width != width || this.bitmap.height != height) {
                    this.bitmap.clear();
                    this.bitmap = new Bitmap(width, height);
                }
                this.bitmap.fillAll(color);
                break;
        }

        this.opacity = opacity;
        this.blendMode = Graphics.BLEND_ADD;
        this.visible = true;
    };

    Sprite_ViewRange.prototype.updatePosition = function() {
        var direction, dirFixed, sensorRangeC, sensorType, cx, cy, tileWidth, tileHeight, bias;
        direction = this._character.direction();
        dirFixed = this._character.getDirectionFixed();
        direction = (dirFixed == -1)? direction : dirFixed;
        sensorType = this._character.getSensorType();
        sensorRangeC = this._character.getSensorRangeC();
        tileWidth = $gameMap.tileWidth();
        tileHeight = $gameMap.tileHeight();
        cx = this._character.screenX();
        cy = this._character.screenY();
        bias = 6;// 位置微調整

        this.x = cx;
        this.y = cy;
        switch(sensorType) {
            case "l":
                if(direction == DIR_UP) {
                    this.y = cy + bias;
                } else if(direction == DIR_RIGHT) {
                    this.x = cx + tileWidth / 2 - tileWidth;
                    this.y = cy - tileHeight / 2 + bias;
                } else if(direction == DIR_LEFT) {
                    this.x = cx + tileWidth / 2;
                    this.y = cy - tileHeight / 2 + bias;
                } else if(direction == DIR_DOWN) {
                    this.y = cy - tileHeight + bias;
                }
                break;
            case "f":
                if(direction == DIR_UP) {
                    this.y = cy + bias;
                } else if(direction == DIR_RIGHT) {
                    this.x = cx + tileWidth / 2 - tileWidth;
                    this.y = cy - tileHeight / 2 + bias;
                } else if(direction == DIR_LEFT) {
                    this.x = cx + tileWidth / 2;
                    this.y = cy - tileHeight / 2 + bias;
                } else if(direction == DIR_DOWN) {
                    this.y = cy - tileHeight + bias;
                }
                break;
        }
    };


    //=========================================================================
    // Bitmap
    //  探索者の視界範囲を表す図形を描画させる処理を追加定義します。
    //=========================================================================
    Bitmap.prototype.fillViewRangeLine = function(color, character) {
        var context, width, height, tileWidth, tileHeight,
            j, cx, cy, cnt, num, distanceX, distanceY,
            direction, dirFixed, coordinates, sideSensorR, sideSensorL;
        context = this._context;
        direction = character.direction();
        dirFixed = character.getDirectionFixed();
        direction = (dirFixed == -1)? direction : dirFixed;
        width = this.width;
        height = this.height;
        tileWidth = $gameMap.tileWidth();
        tileHeight = $gameMap.tileHeight();
        coordinates = character.getCoordinate();
        cnt = coordinates.length;
        sideSensorR = character.getBothSensorRight();
        sideSensorL = character.getBothSensorLeft();
        j = 0;

        this.clear();
        context.save();
        context.fillStyle = color;
        context.beginPath();
        if(direction == DIR_UP) {
            if(coordinates && cnt == 1) {
                num = 1;
                cx = width / 2 + tileWidth / 2;
                cy = height - tileHeight;
                distanceX = cx - tileWidth;
                distanceY = cy - Math.abs(coordinates[j][num]) * tileHeight;

                this.drawSideLine(context, cx, cy, [sideSensorR, 1, 1, sideSensorL, -1, 1]);
                this.drawLine(context, cx, cy, distanceX, distanceY);
            }
        } else if(direction == DIR_RIGHT) {
            if(coordinates && cnt == 1) {
                num = 0;
                cx = tileWidth;
                cy = height / 2 + tileHeight / 2;
                distanceX = cx + Math.abs(coordinates[j][num]) * tileWidth;
                distanceY = cy - tileHeight;

                this.drawSideLine(context, cx, cy, [sideSensorR, -1, 1, sideSensorL, -1, -1]);
                this.drawLine(context, cx, cy, distanceX, distanceY);
            }
        } else if(direction == DIR_LEFT) {
            if(coordinates && cnt == 1) {
                num = 0;
                cx = width - tileWidth;
                cy = height / 2 - tileHeight / 2;
                distanceX = cx - Math.abs(coordinates[j][num]) * tileWidth;
                distanceY = cy + tileHeight;

                this.drawSideLine(context, cx, cy, [sideSensorR, 1, -1, sideSensorL, 1, 1]);
                this.drawLine(context, cx, cy, distanceX, distanceY);
            }
        } else if(direction == DIR_DOWN) {
            if(coordinates && cnt == 1) {
                num = 1;
                cx = width / 2 - tileWidth / 2;
                cy = tileHeight;
                distanceX = cx + tileWidth;
                distanceY = cy + Math.abs(coordinates[j][num]) * tileHeight;

                this.drawSideLine(context, cx, cy, [sideSensorR, -1, -1, sideSensorL, 1, -1]);
                this.drawLine(context, cx, cy, distanceX, distanceY);
            }
        }
        context.fill();
        context.restore();
        this._setDirty();
    };

    Bitmap.prototype.fillViewRangeFan = function(color, character) {
        var context, width, height, tileWidth, tileHeight, cx, cy,
            coordinates, direction, dirFixed, sideSensorR, sideSensorL,
            i, j, cnt, num, distanceX, distanceY, sign;
        context = this._context;
        width = this.width;
        height = this.height;
        tileWidth = $gameMap.tileWidth();
        tileHeight = $gameMap.tileHeight();
        coordinates = character.getCoordinate();
        cnt = coordinates.length;
        direction = character.direction();
        dirFixed = character.getDirectionFixed();
        direction = (dirFixed == -1)? direction : dirFixed;
        sideSensorR = character.getBothSensorRight();
        sideSensorL = character.getBothSensorLeft();


        this.clear();
        context.save();
        context.fillStyle = color;
        context.beginPath();
        if(direction == DIR_UP) {
            if(coordinates && cnt > 0) {
                sign = 1;
                num = 1;
                cx = width / 2 + tileWidth / 2;
                cy = height - tileHeight;
                distanceX = cx - tileWidth;
                distanceY = height - tileHeight - Math.abs(coordinates[0][num]) * tileHeight;
                this.drawSideLine(context, cx, cy, [sideSensorR, 1, 1, sideSensorL, -1, 1]);
                this.drawLine(context, cx, cy, distanceX, distanceY);

                for(i = 1, j = 2; j < cnt; i++, j++) {
                    if(coordinates[j][2] == "Add") {
                        continue;
                    }else if(coordinates[j][2] == "C") {
                        sign = signChange(sign);
                        i = 1;
                        j++;
                    }else if(coordinates[j][0] == 0 && coordinates[j][1] == 0) {
                        continue;
                    }
                    cx = width / 2 + tileWidth / 2 * sign + tileWidth * i * sign;
                    cy = height - tileHeight * i;
                    distanceX = cx + tileWidth * signChange(sign);
                    distanceY = height - tileHeight - Math.abs(coordinates[j][num]) * tileHeight;

                    this.drawLine(context, cx, cy, distanceX, distanceY);
                }
            }
        } else if(direction == DIR_RIGHT) {
            if(coordinates && cnt > 0) {
                sign = 1;
                num = 0;
                cx = tileWidth;
                cy = height / 2 + tileHeight / 2;
                distanceX = tileWidth + Math.abs(coordinates[0][num]) * tileWidth;
                distanceY = cy - tileHeight;
                this.drawSideLine(context, cx, cy, [sideSensorR, -1, 1, sideSensorL, -1, -1]);
                this.drawLine(context, cx, cy, distanceX, distanceY);

                for(i = 1, j = 2; j < cnt; i++, j++) {
                    if(coordinates[j][2] == "Add") {
                        continue;
                    }else if(coordinates[j][2] == "C") {
                        sign = signChange(sign);
                        i = 1;
                        j++;
                    }else if(coordinates[j][0] == 0 && coordinates[j][1] == 0) {
                        continue;
                    }
                    cx = tileHeight * i;
                    cy = height / 2 + tileHeight / 2 * sign + tileHeight * i * sign;
                    distanceX = tileWidth + Math.abs(coordinates[j][num]) * tileWidth;
                    distanceY = cy + tileHeight * signChange(sign);

                    this.drawLine(context, cx, cy, distanceX, distanceY);
                }
            }
        } else if(direction == DIR_LEFT) {
            if(coordinates && cnt > 0) {
                sign = -1;
                num = 0;
                cx = width - tileWidth;
                cy = height / 2 - tileHeight / 2;
                distanceX = width - tileWidth - Math.abs(coordinates[0][num]) * tileWidth;
                distanceY = cy + tileHeight;
                this.drawSideLine(context, cx, cy, [sideSensorR, 1, -1, sideSensorL, 1, 1]);
                this.drawLine(context, cx, cy, distanceX, distanceY);

                for(i = 1, j = 2; j < cnt; i++, j++) {
                    if(coordinates[j][2] == "Add") {
                        continue;
                    }else if(coordinates[j][2] == "C") {
                        sign = signChange(sign);
                        i = 1;
                        j++;
                    }else if(coordinates[j][0] == 0 && coordinates[j][1] == 0) {
                        continue;
                    }
                    cx = width - tileHeight * i;
                    cy = height / 2 + tileHeight / 2 * sign + tileHeight * i * sign;
                    distanceX = width - tileWidth - Math.abs(coordinates[j][num]) * tileWidth;
                    distanceY = cy + tileHeight * signChange(sign);

                    this.drawLine(context, cx, cy, distanceX, distanceY);
                }
            }
        } else if(direction == DIR_DOWN) {
            if(coordinates && cnt > 0) {
                sign = -1;
                num = 1;
                cx = width / 2 - tileWidth / 2;
                cy = tileHeight;
                distanceX = cx + tileWidth;
                distanceY = tileHeight + Math.abs(coordinates[0][num]) * tileHeight;
                this.drawSideLine(context, cx, cy, [sideSensorR, -1, -1, sideSensorL, 1, -1]);
                this.drawLine(context, cx, cy, distanceX, distanceY);

                for(i = 1, j = 2; j < cnt; i++, j++) {
                    if(coordinates[j][2] == "Add") {
                        continue;
                    }else if(coordinates[j][2] == "C") {
                        sign = signChange(sign);
                        i = 1;
                        j++;
                    }else if(coordinates[j][0] == 0 && coordinates[j][1] == 0) {
                        continue;
                    }
                    cx = width / 2 + tileWidth / 2 * sign + tileWidth * i * sign;
                    cy = tileHeight * i;
                    distanceX = cx + tileWidth * signChange(sign);
                    distanceY = tileHeight + Math.abs(coordinates[j][num]) * tileHeight;

                    this.drawLine(context, cx, cy, distanceX, distanceY);
                }
            }
        }
        context.fill();
        context.restore();
        this._setDirty();
    };

    Bitmap.prototype.fillViewRangeDiamond = function(color, character) {
        var context, width, height, tileWidth, tileHeight, cx, cy,
            coordinates, rx, ry, dir, dx, dy, ndx, ndy,
            i, j, cnt, num, distanceX, distanceY, sign;
        context = this._context;
        width = this.width;
        height = this.height;
        tileWidth = $gameMap.tileWidth();
        tileHeight = $gameMap.tileHeight();
        coordinates = character.getCoordinate();
        cnt = coordinates.length;

        this.clear();
        context.save();
        context.fillStyle = color;
        context.beginPath();

        if(coordinates && cnt > 0) {
            sign = 1;
            num = 1;
            cx = width / 2 - tileWidth / 2;
            cy = 0;
            rx = cx;
            ry = cy;
            context.moveTo(cx, cy);

            for(i = 0; i < cnt; i++) {
                dx = coordinates[i][0];
                dy = coordinates[i][1];
                ndx = (i < cnt - 1)? coordinates[i+1][0] : coordinates[0][0];
                ndy = (i < cnt - 1)? coordinates[i+1][1] : coordinates[0][1];
                dir = coordinates[i][2];
                switch(dir) {
                    case DIR_UP:
                        ry -= tileHeight;
                        break;
                    case DIR_RIGHT:
                        rx += tileWidth;
                        break;
                    case DIR_DOWN:
                        ry += tileHeight;
                        break;
                    case DIR_LEFT:
                        rx -= tileWidth;
                        break;
                }
                context.lineTo(rx, ry);
                while(dx != ndx || dy != ndy) {
                    switch(dir) {
                        case DIR_UP:
                        case DIR_DOWN:
                            if(dx < ndx) {
                                rx += tileWidth;
                                dx++;
                            } else if(dx > ndx) {
                                rx -= tileWidth;
                                dx--;
                            }
                            context.lineTo(rx, ry);
                            if(dy < ndy) {
                                ry += tileHeight;
                                dy++;
                            } else if(dy > ndy) {
                                ry -= tileHeight;
                                dy--;
                            }
                            context.lineTo(rx, ry);
                            break;
                        case DIR_RIGHT:
                        case DIR_LEFT:
                            if(dy < ndy) {
                                ry += tileHeight;
                                dy++;
                            } else if(dy > ndy) {
                                ry -= tileHeight;
                                dy--;
                            }
                            context.lineTo(rx, ry);
                            if(dx < ndx) {
                                rx += tileWidth;
                                dx++;
                            } else if(dx > ndx) {
                                rx -= tileWidth;
                                dx--;
                            }
                            context.lineTo(rx, ry);
                            break;
                    }
                }

            }
        }
        context.fill();
        context.restore();
        this._setDirty();
    };

    Bitmap.prototype.drawLine = function(context, cx, cy, distanceX, distanceY) {
        var width, height, tileWidth, tileHeight, lx, ly;
        width = this.width;
        height = this.height;
        tileWidth = $gameMap.tileWidth();
        tileHeight = $gameMap.tileHeight();
        lx = distanceX;
        ly = distanceY;

        context.moveTo(cx, cy);
        context.lineTo(lx, cy);
        context.lineTo(lx, ly);
        context.lineTo(cx, ly);
        //context.lineTo(cx, cy);
    };

    Bitmap.prototype.drawSideLine = function(context, cx, cy, sideSensors) {
        var tileWidth, tileHeight, rx, ry, signX, signY, signX2, signY2;
        tileWidth = $gameMap.tileWidth();
        tileHeight = $gameMap.tileHeight();
        signX = sideSensors[1];
        signY = sideSensors[2];
        signX2 = sideSensors[4];
        signY2 = sideSensors[5];

        if(sideSensors[0]) {
            rx = cx;
            ry = cy;
            context.moveTo(rx, ry);
            context.lineTo(rx + tileWidth * signX, ry);
            context.lineTo(rx + tileWidth * signX, ry + tileHeight * signY);
            context.lineTo(rx, ry + tileHeight * signY);
            context.lineTo(rx, ry);
        }
        if(sideSensors[3]) {
            rx = cx + ((signX != signX2)? tileWidth * signX2 : 0);
            ry = cy + ((signY != signY2)? tileHeight * signY2 : 0);
            context.moveTo(rx, ry);
            context.lineTo(rx + tileWidth * signX2, ry);
            context.lineTo(rx + tileWidth * signX2, ry + tileHeight * signY2);
            context.lineTo(rx, ry + tileHeight * signY2);
            context.lineTo(rx, ry);
        }
    };


    //=========================================================================
    // ユーティリティ
    //  汎用的な処理を定義します。
    //=========================================================================
    function signChange(sign) {
        return sign * -1;
    }

    function getRegionIds() {
        var ArrayRegionId, results, i, argCount, ary;
        ArrayRegionId = [];

        if(arguments && arguments.length > 0) {
            argCount = arguments.length;
            for(i = 0; i < argCount; i++) {
                if(Array.isArray(arguments[i])) {
                    ArrayRegionId.push(CEC(arguments[i][0]));
                } else if(typeof arguments[i] == "string") {
                    ary = arguments[i].split("_").filter(function(val){
                        return val != "" && val != "0";
                    }).map(function(val) {
                        return parseInt(ConvVb(val), 10);
                    });
                    Array.prototype.push.apply(ArrayRegionId, ary);
                } else if(isFinite(arguments[i])) {
                    ArrayRegionId.push(parseInt(arguments[i], 10));
                }
            }
        }

        return ArrayRegionId.filter(function(val, i, self) {
            return self.indexOf(val) === i && val > 0;
        });
    }

})();