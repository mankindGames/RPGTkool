//=============================================================================
// MKR_EventGauge.js
//=============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.6 2017/07/16 ・余計なコードを削除
//                  ・バージョンを変更し忘れていたため修正
//
// 1.1.5 2017/07/16 古いバージョンで作成されたツクールMVプロジェクトにおいて
//                  プラグインが正常に動作しなかったため修正
//
// 1.1.4 2017/05/27 ・イベントゲージを表示するマップで
//                    セーブが出来なかった問題を修正。
//                  ・スクリプトによるコマンド記述方法を一部変更
//                  ・ゲージの色をプラグイン/スクリプトコマンドで変更可能に
//
// 1.1.3 2017/03/11 ・ゲージのoffsetX/Yをプラグイン/スクリプトコマンドで
//                    変更可能に。
//                  ・ゲージをピクチャーの上に描画可能に。
//                    (プラグインパラメーターの追加)
//
// 1.1.2 2017/03/05 ・メモ欄の記述にオプション設定を追加
//                  ・ゲージをメモリキャッシュへと登録するように
//                    (一部のメモリ解放系プラグインへの対応)
//
// 1.1.1 2017/02/17 ・ゲージ設定に変数ではなく数字を使う方式を追加。
//                  ・メモ欄の記述にオプション設定を追加
//
// 1.1.0 2017/02/14 ・プラグインコマンドの対象を実行したイベントのみに変更。
//                  ・スクリプトコマンドの[イベントID]に
//                    実行したイベント自身を表す0を指定可能に。
//                  ・プラグイン/スクリプトコマンドの一部に変数を使用可能に。
//                  ・プラグインパラメーターでゲージの不透明度を指定可能に。
//                  ・上記修正に合わせてプラグイン説明文を修正。
//
// 1.0.2 2017/02/14 メニューの開閉でゲージが非表示になることがある問題を修正。
//
// 1.0.1 2017/02/14 スクリプトによるコマンドが一部動作していなかったため修正。
//
// 1.0.0 2017/02/13 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.1.6) イベントゲージプラグイン
 * @author マンカインド
 *
 * @help = イベントゲージプラグイン (v1.1.6) =
 *
 * 指定したイベントの足元にゲージを表示します。(表示位置は調節が可能)
 * ゲージの最大値はイベント生成(マップ移動)時に
 * イベント_メモ欄で指定した変数の値で設定されます。
 *
 * ゲージ残量は変数の値に対応しており、
 * 変数の値とゲージ残量が同期します。
 * (ただし、ゲージ残量は最大値より上になることは無く、
 *  0より小さくなることもありません)
 *
 * ゲージはイベントの透明化によって非表示になり、
 * 透明化を解除すると再表示されます。
 *
 * イベント画像が設定されていないイベント(ページ)の場合、ゲージは表示されません。
 *
 * ただし、後述するプラグイン/スクリプトコマンドで
 * ゲージを非表示設定にした場合は透明化や画像設定の有無に関わらず、
 * プラグイン/スクリプトコマンドでゲージを表示設定にする必要があります。
 *
 * イベントコマンド[イベントの一時消去]が実行されると、そのイベントに紐づく
 * ゲージも一緒に消去されます。
 *
 *
 * [コピペ用使用例、メモ欄設定・コマンド]
 *   ※各項目の意味は後述しています。
 *     内容は1行毎になっていますので、
 *     必要な行の使用例部分をコピーしてお使いください。
 *
 *   イベント_メモ欄:
 *     <Egauge:vr10>
 *     <Egauge:15>
 *     <Egauge:3 Wh20 Ht6>
 *     <Egauge:vr12 Wh100 Ht10 Fx3 Vs0>
 *     <Egauge:5 Ys-50>
 *     <Egauge:vr5 Xs10 Ys10 Fx1 Fc3 Sc11 Bc7>
 *
 *   プラグインコマンド(実行したイベントが持つゲージに対して効果を発揮):
 *     Egauge show
 *     Egauge hide
 *     Egauge add 3
 *     Egauge set 5
 *     Egauge maxset 5
 *     Egauge setx 20
 *     Egauge sety 40
 *     Egauge backcolor 16
 *     Egauge color1 17
 *     Egauge color2 17
 *     Egauge add \V[10]
 *     Egauge set \V[15]
 *     Egauge maxset \V[20]
 *
 *   スクリプトコマンド(指定したIDのイベントが持つゲージに対して効果を発揮):
 *     $gameMap.showGaugeWindow(1);
 *     $gameMap.hideGaugeWindow(1);
 *     $gameMap.isHideGaugeWindow(1);
 *     $gameMap.addGaugeValue(1, 3);
 *     $gameMap.addGaugeValue(this._eventId, 3);
 *     $gameMap.setGaugeValue(1, 5);
 *     $gameMap.setGaugeValue(this._eventId, 5);
 *     $gameMap.setGaugeMaxValue(1, 5);
 *     $gameMap.setGaugeOffsetX(1, 20);
 *     $gameMap.setGaugeOffsetY(1, 40);
 *     $gameMap.setGaugeBackColor(1, 16);
 *     $gameMap.setGaugeColor1(1, 17);
 *     $gameMap.setGaugeColor2(1, 17);
 *     $gameMap.addGaugeValue(1, $gameVariables.value(10));
 *     $gameMap.addGaugeValue(this._eventId, $gameVariables.value(10));
 *     $gameMap.setGaugeValue(1, $gameVariables.value(15));
 *     $gameMap.setGaugeMaxValue(1, $gameVariables.value(20));
 *
 *
 * ゲージの色について:
 *   このプラグインでは、ゲージの色番号をプラグインパラメーターまたはメモ欄で
 *   指定する必要があります。
 *   (スクリプト/プラグインコマンドによって後からでも変更可能です)
 *
 *   色番号はsystem/Window.pngの右下側にある
 *   色とりどりの四角い枠群に対応しています。
 *
 *   四角い枠群の左上(デフォルトだと白く塗られている四角い枠)を0番として
 *   右に向かって数えていきます。一番右下が31です。
 *
 *   プラグインパラメーター
 *     Gauge_Color_1
 *     Gauge_Color_2
 *   で指定されているデフォルト値である色番号20と21は、
 *   メニュー等で表示されるHPゲージの色と同じものです。
 *   (デフォルトだと赤みがかった黄色で塗られている四角い枠)
 *
 *   同じく、プラグインパラメーター
 *     Gauge_Back_Color
 *   で指定されているデフォルト値である色番号19は、
 *   メニュー等で表示されるゲージの背景色と同じものです。
 *   (デフォルトだと紺色で塗られている四角い枠)
 *
 *
 * イベント_メモ欄_基本設定:
 *   <Egauge:vr[変数番号]>
 *     ・イベントにゲージを表示します。ゲージの値は変数を使用します。
 *       [変数番号]の部分に変数の番号を指定してください。
 *
 *     ・ゲージ残量に使用する変数は0より大きい値を入れてください。
 *
 *   <Egauge:[数字]>
 *     ・イベントにゲージを表示します。[数字]がゲージの最大値・残量になります。
 *       ゲージ残量の設定、最大値の設定は後述するコマンドでも可能です。
 *       変数を利用したくない場合はこちらをご使用ください。
 *
 *     ・ゲージ最大値に使用する[数字]は0より大きい値を入れてください。
 *
 *   ※ ゲージの値指定に変数と数字を使う2パターンを用意しましたが、
 *      両方指定した場合は変数設定が優先されます。
 *
 *      イベント毎に値指定方法を変えることは可能ですので、
 *      どちらか片方を使い設定を行ってください。
 *
 *
 * メモ欄_オプション(各オプションはスペースで区切る):
 *   Wh[数字]
 *     ・ゲージの長さを数字で指定します。
 *
 *   Ht[数字]
 *     ・ゲージの高さを数字で指定します。
 *
 *   Xs[数字]
 *     ・ゲージX座標を[数字]分、ズラして表示します。
 *       (プラス値で右へ、マイナス値で左に)
 *
 *   Ys[数字]
 *     ・ゲージY座標を[数字]分、ズラして表示します。
 *       (プラス値で下へ、マイナス値で上に)
 *
 *   Vs[0～1の数字]
 *     ・ゲージの初期表示状態を指定します。
 *         0 : イベント生成時、ゲージは非表示設定です。
 *         1 : イベント生成時、ゲージは表示設定です。
 *
 *   Fx[1～3の数字]
 *     ・ゲージを画面下側に固定表示します。
 *       (デフォルト設定でゲージ底辺と画面との余白が20pxになります)
 *
 *     ・ゲージのX座標は[1～3の数字]によって変わり、
 *         1 : 画面左側とゲージ左辺の余白が20pxになるよう配置されます。
 *         2 : ゲージの長さを考慮して画面中央に表示されます。
 *         3 : 画面右側とゲージ右辺の余白が20pxになるよう配置されます。
 *       ゲージオフセットによって余白の数値は変化します。
 *
 *   Fc[数字]
 *     ・ゲージカラー1を数字で指定します。
 *       (プラグインパラメーターのGauge_Color_1設定より優先されます)
 *
 *   Sc[数字]
 *     ・ゲージカラー2を数字で指定します。
 *
 *     ・ゲージのグラデーションが必要ない場合は
 *       ゲージカラー1と同じ数字を指定します。
 *       (プラグインパラメーターのGauge_Color_2設定より優先されます)
 *
 *   Bc[数字]
 *     ・ゲージ背景カラーを数字で指定します。
 *       (プラグインパラメーターのGauge_Back_Color設定より優先されます)
 *
 *
 * イベント_メモ欄の設定例:
 *   <Egauge:vr10>
 *     ・イベントにゲージを表示します。
 *       ゲージの表示は変数10番の値が反映されます。
 *
 *   <Egauge:15>
 *     ・イベントにゲージを表示します。
 *       ゲージの表示は最大値15、残量15で設定されます。
 *
 *   <Egauge:3 Wh20 Ht6>
 *     ・イベントにゲージを表示します。
 *       ゲージの表示は最大値3、残量3で設定されます。
 *     ・ゲージの長さを20px、高さを6pxで表示します。
 *
 *   <Egauge:vr20 Xs30 Ys-40>
 *     ・イベントにゲージを表示します。
 *       ゲージの表示は変数20番の値が反映されます。
 *     ・ゲージのX座標をデフォルト+30px、Y座標をデフォルト-40pxで表示します。
 *
 *   <Egauge:200 Wh300 Ht10 Xs-10 Ys-10 Fx1>
 *     ・画面下、左側固定でゲージを表示します。
 *       ゲージの表示は最大値200、残量200で設定されます。
 *     ・ゲージの長さを300px、高さを10px、
 *       X座標をデフォルト-10px、Y座標をデフォルト-10pxで表示します。
 *
 *   <Egauge:vr5 Xs10 Ys10 Fx1 Fc3 Sc11 Bc7>
 *     ・画面下、右側固定でゲージを表示します。
 *       ゲージの表示は変数5番の値が反映されます。
 *     ・ゲージの長さ、高さはデフォルト、
 *       X座標をデフォルト+10px、Y座標をデフォルト+10pxで表示します。
 *     ・ゲージのカラー1を3番、カラー2を11番、ゲージ背景を7番の色で描画します。
 *
 *
 * プラグインコマンド:　※使用する際は、[]を実際の値に置き換えてください。
 *   Egauge show
 *     ・実行したイベントのゲージを表示設定にします。
 *
 *     ・イベントが透明、イベント画像が未設定のとき、コマンドを実行しても
 *       ゲージは表示されません。
 *
 *     ・ゲージが非表示設定になっている場合、
 *       このコマンドで表示設定にすることが可能です。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、何も変化しません。
 *
 *   Egauge hide
 *     ・実行したイベントのゲージを非表示設定にします。
 *
 *     ・イベントが透明ではない、イベント画像が設定されているとき、
 *       コマンドの実行によりゲージが非表示になります。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、何も変化しません。
 *
 *   Egauge add [数字]
 *     ・実行したイベントのゲージ残量を指定した[数字]分、
 *       増加/減少させます。([数字]がマイナス値だと減少します)
 *
 *     ・[数字]の代わりに制御文字\V[n]を使うことで、変数n番の値を
 *       増加/減少させることができます。
 *
 *     ・変数によってゲージ残量が決められている場合、このコマンドによって
 *       変数の値が変化します。
 *
 *     ・ゲージ残量は最大値より多くなることはなく、
 *       0より小さくなることもありません。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、何も変化しません。
 *
 *   Egauge set [数字]
 *     ・実行したイベントのゲージ残量を指定した[数字]に設定します。
 *       ([数字]は0以上の値を指定してください。
 *        また、ゲージ最大値より残量が多くなることはありません)
 *
 *     ・[数字]の代わりに制御文字\V[n]を使うことで、変数n番の値を
 *       ゲージ残量に設定することができます。
 *
 *     ・変数によってゲージ残量が決められている場合、このコマンドによって
 *       変数の値が変化する場合があります。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、何も変化しません。
 *
 *   Egauge maxset [数字]
 *     ・実行したイベントのゲージ最大値を指定した[数字]に設定します。
 *       ([数字]は0より大きい値を指定してください)
 *
 *     ・[数字]の代わりに制御文字\V[n]を使うことで、変数n番の値を
 *       ゲージ最大値に設定することができます。
 *
 *     ・ゲージ最大値がゲージ残量を下回る場合、このコマンドによって
 *       ゲージ残量がゲージ最大値と同じになります。
 *
 *     ・変数によってゲージ残量が決められている場合、このコマンドによって
 *       変数の値が変化する場合があります。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、何も変化しません。
 *
 *   Egauge setx [数字]
 *     ・実行したイベントのゲージX座標オフセットを指定した[数字]に設定します。
 *       オフセットが指定されたゲージは指定された[数字]分、
 *       本来の描画位置から横方向にズレて表示されます。
 *
 *     ・[数字]の代わりに制御文字\V[n]を使うことで、変数n番の値を
 *       ゲージオフセットに設定することができます。
 *
 *   Egauge sety [数字]
 *     ・実行したイベントのゲージY座標オフセットを指定した[数字]に設定します。
 *       オフセットが指定されたゲージは指定された[数字]分、
 *       本来の描画位置から縦方向にズレて表示されます。
 *
 *     ・[数字]の代わりに制御文字\V[n]を使うことで、変数n番の値を
 *       ゲージオフセットに設定することができます。
 *
 *   Egauge backcolor [数字]
 *     ・実行したイベントのゲージ背景色番号を指定した[数字]に設定します。
 *
 *     ・[数字]の代わりに制御文字\V[n]を使うことで、変数n番の値を
 *       ゲージ背景色番号に設定することができます。
 *
 *   Egauge color1 [数字]
 *     ・実行したイベントのゲージ表示色番号を指定した[数字]に設定します。
 *
 *     ・[数字]の代わりに制御文字\V[n]を使うことで、変数n番の値を
 *       ゲージ表示色番号に設定することができます。
 *
 *   Egauge color2 [数字]
 *     ・実行したイベントのゲージ表示色番号を指定した[数字]に設定します。
 *       (ゲージのグラデーションが必要ない場合はcolor1と同じ数字を指定します)
 *
 *     ・[数字]の代わりに制御文字\V[n]を使うことで、変数n番の値を
 *       ゲージ表示色番号に設定することができます。
 *
 *
 * スクリプトコマンド:
 *     ※使用する際は、[]を実際の値やスクリプトに置き換えてください。
 *   $gameMap.showGaugeWindow([イベントID]);
 *     ・指定した[イベントID]のゲージを表示設定にします。
 *
 *     ・[イベントID]をthis._eventIdにすることで、
 *       コマンドを実行したイベントを対象にします。
 *
 *     ・イベントが透明、イベント画像が未設定のとき、コマンドを実行しても
 *       ゲージは表示されません。
 *
 *     ・ゲージが非表示設定になっている場合、
 *       このコマンドで表示設定にすることが可能です。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、何も変化しません。
 *
 *   $gameMap.hideGaugeWindow([イベントID]);
 *     ・指定した[イベントID]のゲージを非表示設定にします。
 *
 *     ・[イベントID]をthis._eventIdにすることで、
 *       コマンドを実行したイベントを対象にします。
 *
 *     ・イベントが透明ではない、イベント画像が設定されているとき、
 *       コマンドの実行によりゲージが非表示になります。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、何も変化しません。
 *
 *   $gameMap.isHideGaugeWindow([イベントID]);
 *     ・指定した[イベントID]のゲージが非表示設定であればtrue、
 *       表示設定であればfalseを返します。
 *
 *     ・[イベントID]をthis._eventIdにすることで、
 *       コマンドを実行したイベントを対象にします。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、falseが返ります。
 *
 *   $gameMap.addGaugeValue([イベントID], [数字]);
 *     ・指定した[イベントID]のゲージ残量を指定した[数字]分、
 *       増加/減少させます。([数字]がマイナス値だと減少します)
 *
 *     ・[イベントID]をthis._eventIdにすることで、
 *       コマンドを実行したイベントを対象にします。
 *
 *     ・[数字]の代わりにスクリプト$gameVariables.value(n)を使うことで、
 *       変数n番の値を増加/減少させることができます。
 *
 *     ・変数によってゲージ残量が決められている場合、このコマンドによって
 *       変数の値が変化します。
 *
 *     ・ゲージ残量は最大値より多くなることはなく、
 *       0より小さくなることもありません。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、何も変化しません。
 *
 *   $gameMap.setGaugeValue([イベントID], [数字]);
 *     ・指定した[イベントID]のゲージ残量を指定した[数字]に設定します。
 *       ([数字]は0以上の値を指定してください。
 *        また、ゲージ最大値より残量が多くなることはありません)
 *
 *     ・[イベントID]をthis._eventIdにすることで、
 *       コマンドを実行したイベントを対象にします。
 *
 *     ・[数字]の代わりにスクリプト$gameVariables.value(n)を使うことで、
 *       変数n番の値をゲージ残量に設定することができます。
 *
 *     ・変数によってゲージ残量が決められている場合、このコマンドによって
 *       変数の値が変化する場合があります。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、何も変化しません。
 *
 *   $gameMap.setGaugeMaxValue([イベントID], [数字]);
 *     ・指定した[イベントID]のゲージ最大値を指定した[数字]に設定します。
 *       ([数字]は0より大きい値を指定してください)
 *
 *     ・[イベントID]をthis._eventIdにすることで、
 *       コマンドを実行したイベントを対象にします。
 *
 *     ・[数字]の代わりにスクリプト$gameVariables.value(n)を使うことで、
 *       変数n番の値をゲージ最大値に設定することができます。
 *
 *     ・ゲージ最大値がゲージ残量を下回る場合、このコマンドによって
 *       ゲージ残量がゲージ最大値と同じになります。
 *
 *     ・変数によってゲージ残量が決められている場合、このコマンドによって
 *       変数の値が変化する場合があります。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、何も変化しません。
 *
 *   $gameMap.getGaugeValue([イベントID]);
 *     ・指定した[イベントID]のゲージ残量を返します。
 *
 *     ・[イベントID]をthis._eventIdにすることで、
 *       コマンドを実行したイベントを対象にします。
 *
 *     ・変数によってゲージ残量が決められている場合、
 *       返ってくる値は変数の値と同じです。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、-1を返します。
 *
 *   $gameMap.getGaugeMaxValue([イベントID]);
 *     ・指定した[イベントID]のゲージ最大値を返します。
 *
 *     ・[イベントID]を0にすることで、コマンドを実行したイベントを対象にします。
 *
 *     ・イベント_メモ欄にゲージ表示が設定されていない場合、-1を返します。
 *
 *   $gameMap.setGaugeOffsetX([イベントID], [数字]);
 *     ・指定した[イベントID]のゲージX座標オフセットを
 *       指定した[数字]に設定します。
 *
 *     ・オフセットが指定されたゲージは指定された[数字]分、
 *       本来の描画位置から横方向にズレて表示されます。
 *
 *     ・[イベントID]をthis._eventIdにすることで、
 *       コマンドを実行したイベントを対象にします。
 *
 *     ・[数字]の代わりにスクリプト$gameVariables.value(n)を使うことで、
 *       変数n番の値をゲージオフセットに設定することができます。
 *
 *   $gameMap.setGaugeOffsetY([イベントID], [数字]);
 *     ・指定した[イベントID]のゲージY座標オフセットを
 *       指定した[数字]に設定します。
 *
 *     ・オフセットが指定されたゲージは指定された[数字]分、
 *       本来の描画位置から縦方向にズレて表示されます。
 *
 *     ・[イベントID]をthis._eventIdにすることで、
 *       コマンドを実行したイベントを対象にします。
 *
 *     ・[数字]の代わりにスクリプト$gameVariables.value(n)を使うことで、
 *       変数n番の値をゲージオフセットに設定することができます。
 *
 *   $gameMap.setGaugeBackColor([イベントID], [数字]);
 *     ・指定した[イベントID]のゲージ背景色番号を指定した[数字]に設定します。
 *
 *     ・[イベントID]をthis._eventIdにすることで、
 *       コマンドを実行したイベントを対象にします。
 *
 *     ・[数字]の代わりにスクリプト$gameVariables.value(n)を使うことで、
 *       変数n番の値をゲージ背景色番号に設定することができます。
 *
 *   $gameMap.setGaugeColor1([イベントID], [数字]);
 *     ・指定した[イベントID]のゲージ表示色番号を指定した[数字]に設定します。
 *
 *     ・[イベントID]をthis._eventIdにすることで、
 *       コマンドを実行したイベントを対象にします。
 *
 *     ・[数字]の代わりにスクリプト$gameVariables.value(n)を使うことで、
 *       変数n番の値をゲージ表示色番号に設定することができます。
 *
 *   $gameMap.setGaugeColor2([イベントID], [数字]);
 *     ・指定した[イベントID]のゲージ表示色番号を指定した[数字]に設定します。
 *
 *     ・ゲージのグラデーションが必要ない場合は
 *       ゲージカラー1と同じ数字を指定します。
 *
 *     ・[イベントID]をthis._eventIdにすることで、
 *       コマンドを実行したイベントを対象にします。
 *
 *     ・[数字]の代わりにスクリプト$gameVariables.value(n)を使うことで、
 *       変数n番の値をゲージ表示色番号に設定することができます。
 *
 *
 * 補足：
 *   ・このプラグインに関するメモ欄の設定、プラグインコマンドは
 *     大文字/小文字を区別していません。
 *
 *   ・プラグインパラメーターの説明に、[初期値]と書かれているものは
 *     イベントのメモ欄で個別に設定が可能です。
 *     設定した場合、[初期値]よりメモ欄の設定が
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
 *     可能性がありますが、バージョンアップにより本プラグインの仕様が
 *     変更される可能性があります。
 *     ご了承ください。
 *
 *
 * @param Gauge_Width
 * @desc [初期値] ゲージの長さを数値で指定してください。(デフォルト:40)
 * @default 40
 *
 * @param Gauge_Height
 * @desc [初期値] ゲージの高さを数値で指定してください。(デフォルト:40)
 * @default 10
 *
 * @param Gauge_Offset_X
 * @desc [初期値] ゲージX座標をズラして表示する場合は指定してください。(プラス値で右へ、マイナス値で左に)(デフォルト:0)
 * @default 0
 *
 * @param Gauge_Offset_Y
 * @desc [初期値] ゲージY座標をズラして表示する場合は指定してください。(プラス値で下へ、マイナス値で上に)(デフォルト:0)
 * @default 0
 *
 * @param Gauge_Visible
 * @desc [初期値] 初めからゲージを表示しておく場合はON、後から表示させる場合はOFFを指定してください。(デフォルト:ON)
 * @default ON
 *
 * @param Gauge_Color_1
 * @desc [初期値] ゲージの表示色番号を指定してください。(実際に表示される色はsystem/Window.pngを参照してください)(デフォルト:20)
 * @default 20
 *
 * @param Gauge_Color_2
 * @desc [初期値] ゲージの表示色番号を指定してください。(この項目はグラデーション用です)(デフォルト:21)
 * @default 21
 *
 * @param Gauge_Back_Color
 * @desc ゲージ背景の表示色番号を指定してください。(ゲージ全体が背景色で塗られ、残量分がゲージ表示色で塗られます)(デフォルト:19)
 * @default 19
 *
 * @param Gauge_Opacity
 * @desc ゲージの不透明度(0～255)を指定してください。(0でゲージが透明になります)(デフォルト:255)
 * @default 255
 *
 * @param Gauge_In_Picture
 * @desc 指定した番号のピクチャーよりゲージを上に表示します。(0の場合、ゲージは全ピクチャーの下に表示)(デフォルト:0)
 * @default 0
 *
*/

var Imported = Imported || {};
Imported.MKR_EventGauge = true;

(function () {
    'use strict';
    var PN, Params;
    PN = "MKR_EventGauge";

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

        value = value.replace(/\\/g, '\x1b');
        value = value.replace(/\x1b\x1b/g, '\\');

        regExp = /^\x1bV\[\d+\]$/i;
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
                default:
                    throw new Error("[CheckParam] " + param + "のタイプが不正です: " + type);
                    break;
            }
        }

        return [value, type, def, min, max, param];
    };

    var convertEscapeCharacters = function(text) {
        var windowChild;

        if(typeof text == "string") {
            if(SceneManager._scene) {
                windowChild = SceneManager._scene._windowLayer.children[0];
                text = windowChild ? windowChild.convertEscapeCharacters(text) : ConvVb(text);
            } else {
                text = ConvVb(text);
            }
        }

        return text;
    };

    var ConvVb = function(text) {
        var num;

        if(typeof text == "string") {
            text = text.replace(/\x1bV\[(\d+)\]/i, function() {
                num = parseInt(arguments[1]);
                return $gameVariables.value(num);
            }.bind(this));
            text = text.replace(/\x1bV\[(\d+)\]/i, function() {
                num = parseInt(arguments[1]);
                return $gameVariables.value(num);
            }.bind(this));
        }

        return text;
    }

    var GetMeta = function(meta, name, sep) {
        var value, values, i, count;
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

    Params = {
        "GaugeW" : CheckParam("num", "Gauge_Width", 40, 0),
        "GaugeH" : CheckParam("num", "Gauge_Height", 10, 0),
        "GaugeOX" : CheckParam("num", "Gauge_Offset_X", 0),
        "GaugeOY" : CheckParam("num", "Gauge_Offset_Y", 0),
        "GaugeVisible" : CheckParam("bool", "Gauge_Visible", true),
        "GaugeColor1" : CheckParam("num", "Gauge_Color_1", 20, 0,31),
        "GaugeColor2" : CheckParam("num", "Gauge_Color_2", 21, 0, 31),
        "GaugeBackColor" : CheckParam("num", "Gauge_Back_Color", 19, 0, 31),
        "GaugeOpacity" : CheckParam("num", "Gauge_Opacity", 255, 0, 255),
        "GaugeInPict" : CheckParam("num", "Gauge_In_Picture", 0, 0),
    };


    //=========================================================================
    // Game_Interpreter
    //  ・プラグイン用コマンドを定義します。
    //
    //=========================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        var eventId, value;
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === "egauge") {
            eventId = this.eventId();
            value = args[1];
            switch (args[0].toLowerCase()) {
                case "show":
                    $gameMap.showGaugeWindow(eventId);
                    break;
                case "hide":
                    $gameMap.hideGaugeWindow(eventId);
                    break;
                case "add":
                    $gameMap.addGaugeValue(eventId, value);
                    break;
                case "set":
                    $gameMap.setGaugeValue(eventId, value);
                    break;
                case "maxset":
                    $gameMap.setGaugeMaxValue(eventId, value);
                    break;
                case "setx":
                    $gameMap.setGaugeOffsetX(eventId, value);
                    break;
                case "sety":
                    $gameMap.setGaugeOffsetY(eventId, value);
                    break;
                case "backcolor":
                    $gameMap.setGaugeBackColor(eventId, value);
                    break;
                case "color1":
                    $gameMap.setGaugeColor1(eventId, value);
                    break;
                case "color2":
                    $gameMap.setGaugeColor2(eventId, value);
                    break;
            }
        }
    };


    //=========================================================================
    // Window_Gauge
    //  ・ゲージウィンドウを定義します。
    //
    //=========================================================================
    function Window_Gauge() {
        this.initialize.apply(this, arguments);
    }

    Window_Gauge.prototype = Object.create(Window_Base.prototype);
    Window_Gauge.prototype.constructor = Window_Gauge;

    Window_Gauge.prototype.initialize = function(num) {
        var x, y, width, height, option, bitmap, key, ver;

        this._gaugeNum = num;
        width = this.windowWidth();
        height = this.windowHeight();
        x = this.windowX();
        y = this.windowY();
        option = null;
        bitmap = null;

        Window_Base.prototype.initialize.call(this, x, y, width, height);

        try {
            ver = Utils.RPGMAKER_VERSION;
            key = String.randomStr(12);
            ver = ver.replace(/\./g, "");
            if(isFinite(ver)) {
                ver = parseInt(ver);
                console.log(ver);
                if(ver >= 150) {
                    bitmap = ImageManager._imageCache.get(key);
                    if (!bitmap) {
                        bitmap = new Bitmap(width - this.standardPadding() * 2, height - this.standardPadding() * 2);
                        ImageManager._imageCache.add(key, bitmap);
                        console.log(ImageManager._imageCache.get(key));
                    }
                    this.contents = bitmap;
                } else if(ver >= 131) {
                    bitmap = ImageManager.cache.getItem(key);
                    if (!bitmap) {
                        bitmap = new Bitmap(width - this.standardPadding() * 2, height - this.standardPadding() * 2);
                        ImageManager.cache.setItem(key, bitmap);
                    }
                    this.contents = bitmap;
                }
            }
        } catch(e) {
            // console.log(e);
        }

        this.opacity = 0;

        option = $gameMap.event(num).getGaugeOption();

        if(option["Visible"] == 0) {
            this.hide();
        }
        if(option["PaintO"] >= 0) {
            this.contents.paintOpacity = option["PaintO"];
        }
    };

    Window_Gauge.prototype.windowWidth = function() {
        var option;
        option = $gameMap.event(this._gaugeNum).getGaugeOption();

        return option["Width"] + this.standardPadding() * 2;
    };

    Window_Gauge.prototype.windowHeight = function() {
        var option;
        option = $gameMap.event(this._gaugeNum).getGaugeOption();

        return option["Height"] + this.standardPadding() * 2;
    };

    Window_Gauge.prototype.windowX = function() {
        var option, value;

        value = 0;
        option = $gameMap.event(this._gaugeNum).getGaugeOption();
        switch(option["Fix"]) {
            case 1:
                break;
            case 2:
                value = Graphics.boxWidth / 2 - this.width / 2;
                break;
            case 3:
                value = Graphics.boxWidth - this.width;
                break;
            default:
                value = $gameMap.event(this._gaugeNum).screenX() - this.width / 2;
                break;
        }
        value += option["OffsetX"];

        return value;
    };

    Window_Gauge.prototype.windowY = function() {
        var option, value;

        value = 0;
        option = $gameMap.event(this._gaugeNum).getGaugeOption();
        if(option["Fix"] != null) {
            value = Graphics.boxHeight - this.height;
        } else {
            value = $gameMap.event(this._gaugeNum).screenY();
        }
        value += option["OffsetY"];

        return value;
    };

    Window_Gauge.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this.updateGauge();
        this.updatePosition();
        this.updateVisibility();
    };

    Window_Gauge.prototype.updateVisibility = function() {
        var chara;
        chara = $gameMap.event(this._gaugeNum);

        if(chara) {
            if (chara.isHideGauge() || chara.isTransparent() || chara.characterName() == "" || $gameMap.getGaugeInfo(this._gaugeNum) < 0) {
                this.hide();
            } else if(!chara.isHideGauge()) {
                this.show();
            }

            if(chara._erased) {
                $gameMap.delGaugeInfo(this._gaugeNum);
                this.parent.removeChild(this);
            }
        }
    };

    Window_Gauge.prototype.updateGauge = function() {
        var color1, color2, backColor, width, height, fillW, option;
        width = this.contents.width;
        height = this.contents.height;

        option = $gameMap.event(this._gaugeNum).getGaugeOption();
        color1 = this.textColor(option["Color1"]);
        color2 = this.textColor(option["Color2"]);
        backColor = this.textColor(option["BackC"]);

        fillW = Math.floor(width * $gameMap.event(this._gaugeNum).gaugeRate());

        this.contents.clear();
        this.contents.fillRect(0, 0, width, height, backColor);
        this.contents.gradientFillRect(0, 0, fillW, height, color1, color2);
    };

    Window_Gauge.prototype.updatePosition = function() {
        this.x = this.windowX();
        this.y = this.windowY();
        this.z = $gameMap.event(this._gaugeNum).screenZ();
    };


    //=========================================================================
    // Spriteset_Map
    //  ・イベントにゲージウィンドウを追加する処理を定義します。
    //
    //=========================================================================
    var _Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
    Spriteset_Map.prototype.createUpperLayer = function() {
        if(Params.GaugeInPict[0] > 0) {
            _Spriteset_Map_createUpperLayer.call(this);
            this.createGaugeWindow();
        } else {
            this.createGaugeWindow();
            _Spriteset_Map_createUpperLayer.call(this);
        }
    };

    Spriteset_Map.prototype.createGaugeWindow = function() {
        var gaugeIdx, gaugeNum, gaugeWindow, gaugeWindows, i, j;
        i = 0;
        j = 1;
        gaugeWindows = [];

        $gameMap.events().forEach(function(event) {
            if(event && GetMeta(event.event().meta, "egauge") != "") {
                gaugeWindows[j] = new Window_Gauge(event.eventId());
                $gameMap.addGaugeInfo(event.eventId());
                if(gaugeWindows[j] != null) {
                    if(Params.GaugeInPict[0] > 0) {
                        this._pictureContainer.addChildAt(gaugeWindows[j], Params.GaugeInPict[0] + i);
                        i++;
                    } else {
                        this.addChild(gaugeWindows[j]);
                    }
                }
                j++;
            }
        }, this);
    };


    //=========================================================================
    // Game_Map
    //  ・ウィンドウゲージ群を保持する処理を定義します。
    //  ・プラグイン用コマンドを定義します。
    //
    //=========================================================================
    var _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);

        this._gaugeInfos = [];
    }

    Game_Map.prototype.getGaugeInfo = function(id) {
        if(id < 1) {
            return -1;
        }
        return this._gaugeInfos.indexOf(id);
    }

    Game_Map.prototype.addGaugeInfo = function(id) {
        this._gaugeInfos.push(id);
    }

    Game_Map.prototype.delGaugeInfo = function(id) {
        var num;

        if(id > 0) {
            this.event(id).delMember();
            num = this._gaugeInfos.indexOf(id);
            if(num > -1) {
                this._gaugeInfos.splice(num, 1);
            }
        }
    }

    Game_Map.prototype.showGaugeWindow = function(eventId) {
        if(eventId == 0) {
            eventId = this._interpreter.eventId();
        }

        if(eventId > 0 && eventId < this._events.length) {
            this.event(eventId).showGauge();
        }
    }

    Game_Map.prototype.hideGaugeWindow = function(eventId) {
        if(eventId == 0) {
            eventId = this._interpreter.eventId();
        }

        if(eventId > 0 && eventId < this._events.length) {
            this.event(eventId).hideGauge();
        }
    }

    Game_Map.prototype.isHideGaugeWindow = function(eventId) {
        var gaugeNum, gaugeWindow, result;
        result = false;

        if(eventId == 0) {
            eventId = this._interpreter.eventId();
        }

        if(eventId > 0 && eventId < this._events.length) {
            result = this.event(eventId).isHideGauge();
        }

        return result;
    }

    Game_Map.prototype.addGaugeValue = function(eventId, value) {
        value = String(value).replace(/\\/g, '\x1b');
        value = value.replace(/\x1b\x1b/g, '\\');
        if(/\x1bV\[\d+\]/i.test(value)) {
            value = ConvVb(value);
        }

        if(eventId == 0) {
            eventId = this._interpreter.eventId();
        }

        if(eventId > 0 && eventId < this._events.length) {
            this.event(eventId).addGaugeValue(value);
        }
    }

    Game_Map.prototype.setGaugeValue = function(eventId, value) {
        value = String(value).replace(/\\/g, '\x1b');
        value = value.replace(/\x1b\x1b/g, '\\');
        if(/\x1bV\[\d+\]/i.test(value)) {
            value = ConvVb(value);
        }

        if(eventId == 0) {
            eventId = this._interpreter.eventId();
        }

        if(eventId > 0 && eventId < this._events.length) {
            this.event(eventId).setGaugeValue(value);
        }
    }

    Game_Map.prototype.getGaugeValue = function(eventId) {
        var value;
        value = -1;

        if(eventId == 0) {
            eventId = this._interpreter.eventId();
        }

        if(eventId > 0 && eventId < this._events.length) {
            value = this.event(eventId).getGaugeValue();
        }

        return value;
    }

    Game_Map.prototype.setGaugeMaxValue = function(eventId, value) {
        value = String(value).replace(/\\/g, '\x1b');
        value = value.replace(/\x1b\x1b/g, '\\');
        if(/\x1bV\[\d+\]/i.test(value)) {
            value = ConvVb(value);
        }

        if(eventId == 0) {
            eventId = this._interpreter.eventId();
        }

        if(eventId > 0 && eventId < this._events.length) {
            this.event(eventId).setGaugeMaxValue(value);
        }
    }

    Game_Map.prototype.getGaugeMaxValue = function(eventId) {
        var value;
        value = -1;

        if(eventId == 0) {
            eventId = this._interpreter.eventId();
        }

        if(eventId > 0 && eventId < this._events.length) {
            value = this.event(eventId).getGaugeMaxValue();
        }

        return value;
    }

    Game_Map.prototype.setGaugeOffsetX = function(eventId, value) {
        value = String(value).replace(/\\/g, '\x1b');
        value = value.replace(/\x1b\x1b/g, '\\');
        if(/\x1bV\[\d+\]/i.test(value)) {
            value = ConvVb(value);
        }

        if(eventId == 0) {
            eventId = this._interpreter.eventId();
        }

        if(eventId > 0 && eventId < this._events.length) {
            this.event(eventId).setGaugeOffsetX(value);
        }
    }

    Game_Map.prototype.setGaugeOffsetY = function(eventId, value) {
        value = String(value).replace(/\\/g, '\x1b');
        value = value.replace(/\x1b\x1b/g, '\\');
        if(/\x1bV\[\d+\]/i.test(value)) {
            value = ConvVb(value);
        }

        if(eventId == 0) {
            eventId = this._interpreter.eventId();
        }

        if(eventId > 0 && eventId < this._events.length) {
            this.event(eventId).setGaugeOffsetY(value);
        }
    }

    Game_Map.prototype.setGaugeBackColor = function(eventId, value) {
        value = String(value).replace(/\\/g, '\x1b');
        value = value.replace(/\x1b\x1b/g, '\\');
        if(/\x1bV\[\d+\]/i.test(value)) {
            value = ConvVb(value);
        }

        if(eventId == 0) {
            eventId = this._interpreter.eventId();
        }

        if(eventId > 0 && eventId < this._events.length) {
            this.event(eventId).setGaugeBackColor(value);
        }
    }

    Game_Map.prototype.setGaugeColor1 = function(eventId, value) {
        value = String(value).replace(/\\/g, '\x1b');
        value = value.replace(/\x1b\x1b/g, '\\');
        if(/\x1bV\[\d+\]/i.test(value)) {
            value = ConvVb(value);
        }

        if(eventId == 0) {
            eventId = this._interpreter.eventId();
        }

        if(eventId > 0 && eventId < this._events.length) {
            this.event(eventId).setGaugeColor1(value);
        }
    }

    Game_Map.prototype.setGaugeColor2 = function(eventId, value) {
        value = String(value).replace(/\\/g, '\x1b');
        value = value.replace(/\x1b\x1b/g, '\\');
        if(/\x1bV\[\d+\]/i.test(value)) {
            value = ConvVb(value);
        }

        if(eventId == 0) {
            eventId = this._interpreter.eventId();
        }

        if(eventId > 0 && eventId < this._events.length) {
            this.event(eventId).setGaugeColor2(value);
        }
    }


    //=========================================================================
    // Game_Event
    //  ・イベントの追加メンバーと関連メソッドを定義します。
    //
    //=========================================================================
    var _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);

        if(GetMeta(this.event().meta, "egauge") != "") {
            this.addMembers();
        }
    };

    Game_Event.prototype.addMembers = function() {
        var vr, value, metas;

        this._gauge = 0;
        this._gaugeMax = 0;
        this._gaugeNum = -1;
        this._gaugeVr = 0;
        this._gaugeType = "num";
        this._gaugeOption = {
            "Width"   : Params.GaugeW[0],
            "Height"  : Params.GaugeH[0],
            "OffsetX" : Params.GaugeOX[0],
            "OffsetY" : Params.GaugeOY[0],
            "Fix"     : null,
            "Visible" : Params.GaugeVisible[0],
            "Color1"  : Params.GaugeColor1[0],
            "Color2"  : Params.GaugeColor2[0],
            "BackC"   : Params.GaugeBackColor[0],
            "PaintO"  : Params.GaugeOpacity[0],
        };

        metas = GetMeta(this.event().meta, "egauge", " ");

        if(metas && metas.length) {
            metas.forEach(function(meta) {
                meta = meta.trim().toLowerCase();
                if(/^vr(\d+)$/.test(meta)) {
                    vr = isFinite(RegExp.$1) ? parseInt(RegExp.$1, 10) : 0;
                    if(vr > 0) {
                        this._gaugeVr = vr;
                        this._gauge = 0;
                        this._gaugeType = "vr";
                        value = $gameVariables.value(vr);
                        if(isFinite(value)) {
                            this._gaugeMax = parseInt(value, 10);
                        }
                    }
                }
                if(/^(\d+)$/.test(meta)) {
                    value = isFinite(RegExp.$1) ? parseInt(RegExp.$1, 10) : 0;
                    if(value > 0 && this._gaugeType == "num") {
                        this._gauge = value;
                        this._gaugeMax = value;
                    }
                }
                if(/^wh(\d+)$/.test(meta)) {
                    value = isFinite(RegExp.$1) ? parseInt(RegExp.$1, 10) : 0;
                    if(value > 0) {
                        this._gaugeOption["Width"] = value;
                    }
                }
                if(/^ht(\d+)$/.test(meta)) {
                    value = isFinite(RegExp.$1) ? parseInt(RegExp.$1, 10) : 0;
                    if(value > 0) {
                        this._gaugeOption["Height"] = value;
                    }
                }
                if(/^xs(-?\d+)$/.test(meta)) {
                    value = isFinite(RegExp.$1) ? parseInt(RegExp.$1, 10) : null;
                    if(value != null) {
                        this._gaugeOption["OffsetX"] = value;
                    }
                }
                if(/^ys(-?\d+)$/.test(meta)) {
                    value = isFinite(RegExp.$1) ? parseInt(RegExp.$1, 10) : null;
                    if(value != null) {
                        this._gaugeOption["OffsetY"] = value;
                    }
                }
                if(/^fx([1-3])$/.test(meta)) {
                    value = isFinite(RegExp.$1) ? parseInt(RegExp.$1, 10) : null;
                    if(value != null) {
                        this._gaugeOption["Fix"] = value;
                    }
                }
                if(/^vs([0-1])$/.test(meta)) {
                    value = isFinite(RegExp.$1) ? parseInt(RegExp.$1, 10) : null;
                    if(value != null) {
                        this._gaugeOption["Visible"] = value;
                    }
                }
                if(/^fc(\d+)$/.test(meta)) {
                    value = isFinite(RegExp.$1) ? parseInt(RegExp.$1, 10) : -1;
                    if(value >= 0 && value <= 31) {
                        this._gaugeOption["Color1"] = value;
                    }
                }
                if(/^sc(\d+)$/.test(meta)) {
                    value = isFinite(RegExp.$1) ? parseInt(RegExp.$1, 10) : -1;
                    if(value >= 0 && value <= 31) {
                        this._gaugeOption["Color2"] = value;
                    }
                }
                if(/^bc(\d+)$/.test(meta)) {
                    value = isFinite(RegExp.$1) ? parseInt(RegExp.$1, 10) : -1;
                    if(value >= 0 && value <= 31) {
                        this._gaugeOption["BackC"] = value;
                    }
                }
            }, this);
        }
    };

    Game_Event.prototype.gaugeEnable = function() {
        return this._gaugeType !== undefined;
    }

    Game_Event.prototype.gaugeRate = function() {
        var value, maxValue;

        if(this.gaugeEnable()) {
            value = this.getGaugeValue();
            maxValue = this.getGaugeMaxValue();
            if(maxValue == 0) {
                return 0;
            }
            return value / maxValue;
        } else {
            return 0;
        }
    };

    Game_Event.prototype.setGaugeNum = function(index) {
        if(this.gaugeEnable()) {
            this._gaugeNum = index;
        }
    }

    Game_Event.prototype.getGaugeNum = function() {
        var value;
        value = -1;

        if(this.gaugeEnable()) {
            value = this._gaugeNum;
        }
        return value;
    }

    Game_Event.prototype.addGaugeValue = function(value) {
        var gameValue, result;
        value = isFinite(value) ? parseInt(value, 10) : 0;

        if(this.gaugeEnable()) {
            gameValue = this.getGaugeValue();

            if(value != 0) {
                result = gameValue + value;
                gameValue = this.getGaugeMaxValue();
                if(result < 0) {
                    result = 0;
                } else if(result > gameValue) {
                    result = gameValue;
                }
                this.setGaugeValue(result);
            }
        }
    }

    Game_Event.prototype.setGaugeValue = function(value) {
        var maxValue;
        value = isFinite(value) ? parseInt(value, 10) : -1;

        if(this.gaugeEnable()) {
            maxValue = this.getGaugeMaxValue();

            if(value >= 0 && maxValue >= value) {
                if(this._gaugeType == "vr") {
                    $gameVariables.setValue(this._gaugeVr, value);
                } else if(this._gaugeType == "num") {
                    this._gauge = value;
                }
            }
        }
    }

    Game_Event.prototype.getGaugeValue = function() {
        var value;
        value = -1;

        if(this.gaugeEnable()) {
            if(this._gaugeType == "vr") {
                value = $gameVariables.value(this._gaugeVr);
            } else if(this._gaugeType == "num") {
                value = this._gauge;
            }
        }

        return value;
    }

    Game_Event.prototype.setGaugeMaxValue = function(value) {
        var gameValue;
        value = isFinite(value) ? parseInt(value, 10) : 0;

        if(this.gaugeEnable()) {
            if(value > 0) {
                if(this._gaugeType == "vr") {
                    gameValue = $gameVariables.value(this._gaugeVr);
                    if(value < gameValue) {
                        $gameVariables.setValue(this._gaugeVr, value);
                    }
                } else if(this._gaugeType == "num") {
                    gameValue = this._gauge;
                    if(value < gameValue) {
                        this._gauge = value;
                    }
                }
                this._gaugeMax = value;
            }
        }
    }

    Game_Event.prototype.getGaugeMaxValue = function() {
        var value;
        value = -1;

        if(this.gaugeEnable()) {
            value = this._gaugeMax;
        }

        return value;
    }

    Game_Event.prototype.setGaugeOffsetX = function(value) {
        value = isFinite(value) ? parseInt(value, 10) : null;

        if(this.gaugeEnable() && value !== null) {
            this._gaugeOption["OffsetX"] = value;
        }
    }

    Game_Event.prototype.setGaugeOffsetY = function(value) {
        value = isFinite(value) ? parseInt(value, 10) : null;

        if(this.gaugeEnable() && value !== null) {
            this._gaugeOption["OffsetY"] = value;
        }
    }

    Game_Event.prototype.getGaugeOption = function() {
        return this._gaugeOption;
    }

    Game_Event.prototype.hideGauge = function() {
        if(this.gaugeEnable()) {
            this._gaugeOption["Visible"] = false;
        }
    };

    Game_Event.prototype.showGauge = function() {
        if(this.gaugeEnable()) {
            this._gaugeOption["Visible"] = true;
        }
    };

    Game_Event.prototype.isHideGauge = function() {
        if(this.gaugeEnable()) {
            return !this._gaugeOption["Visible"];
        } else {
            return false;
        }
    };

    Game_Event.prototype.setGaugeBackColor = function(value) {
        value = isFinite(value) ? parseInt(value, 10) : null;

        if(this.gaugeEnable() && value !== null) {
            this._gaugeOption["BackC"] = value;
        }
    }

    Game_Event.prototype.setGaugeColor1 = function(value) {
        value = isFinite(value) ? parseInt(value, 10) : null;

        if(this.gaugeEnable() && value !== null) {
            this._gaugeOption["Color1"] = value;
        }
    }

    Game_Event.prototype.setGaugeColor2 = function(value) {
        value = isFinite(value) ? parseInt(value, 10) : null;

        if(this.gaugeEnable() && value !== null) {
            this._gaugeOption["Color2"] = value;
        }
    }

    Game_Event.prototype.delMember = function() {
        if(this._gauge !== undefined) {
            delete this._gauge;
        }
        if(this._gaugeMax !== undefined) {
            delete this._gaugeMax;
        }
        if(this._gaugeNum !== undefined) {
            delete this._gaugeNum;
        }
        if(this._gaugeVr !== undefined) {
            delete this._gaugeVr;
        }
        if(this._gaugeType !== undefined) {
            delete this._gaugeType;
        }
        if(this._gaugeOption !== undefined) {
            delete this._gaugeOption;
        }
    }


    //=========================================================================
    // String
    //  ・ランダムな文字列を生成する処理を定義します。
    //
    //=========================================================================
    String.randomStr = function(length) {
        var str, random, i;
        str = "";
        length = length || 32;

        for (i = 0; i < length; i++) {
            random = Math.random() * 16 | 0;
            str += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
        }

        return str;
    }


})();