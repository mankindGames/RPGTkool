//===============================================================================
// MKR_MapItemSlot.js
//===============================================================================
// (c) 2016 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.2.1 2018/11/23 ・アイテムスロットに登録されたアイテムを
//                    判別可能にする関数を追加
//
// 1.2.0 2018/10/19 ・アイテムスロットに登録されたアイテムの
//                    所持数を非表示にするプラグインパラメータを追加
//
// 1.1.9 2018/09/24 ・アイテムスロットに防具を登録できるようにした。
//                  ・防具に関するプラグインパラメータを追加。
//                  ・防具の扱いに関してプラグインヘルプを修正。
//                  ・アイテムスロットメニュー上で、アイテムスロットウィンドウの
//                    背景をマップ上アイテムスロット背景と同じにできる
//                    プラグインパラメータを追加。
//                  ・アイテムスロットメニューのアイテムウィンドウで、
//                    カテゴリウィンドウに寄らないアイテム分類を行える
//                    プラグインパラメータを追加
//
// 1.1.8 2018/08/25 ・アイテムスロットの初回非表示機能が使えなかった問題を修正。
//
// 1.1.7 2018/07/06 ・一部プラグインとの競合を解決。
//
// 1.1.6 2018/01/19 ・アイテムスロットへの武器登録を無効にしたとき、
//                    メニューから戻ると装備武器が外れてしまう問題を修正。
//                  ・アイテムスロットメニューに背景画像を指定しない場合、
//                    背景にマップ画面を表示するように変更。
//
// 1.1.5 2018/01/09 ・イベント中にアイテムが使用可能だったのを修正。
//                  ・イベント発生時、アイテムスロットをフェードアウトさせ
//                    イベント完了後にフェードインさせるように修正。
//
// 1.1.4 2017/10/12 ・アイテムスロットに背景設定時、
//                    ウィンドウ枠が消去されていなかったため修正。
//
// 1.1.3 2017/10/11 ・一部プラグインとの競合問題を修正。
//                  ・メニューアイテムスロット画面の不透明度指定により他画面の
//                    ウィンドウに影響が出ていた問題を修正。
//                  ・プラグインパラメーターの指定方法を変更。
//                  ・一部プラグインパラメータのデフォルト値を変更。
//                  ・アイテムスロットの拡大表示に対応。
//                  ・アイテムスロットの余白を設定可能に。
//                  ・アイテムスロットウィンドウ及び画面について背景画像を
//                    設定できるように修正。
//                  ・スロットからアイテムを使用後、$gameParty.lastItem()で
//                    最後に使用したアイテムを取得できるように。
//                  ・アイテムスロット画面呼び出し用のプラグインコマンドを追加。
//
// 1.1.2 2017/08/30 ・余計なコードを削除。
//
// 1.1.1 2017/08/30 ・プラグインパラメーターの指定方法を変更。
//                  ・プラグインヘルプを修正。
//
// 1.1.0 2017/08/30 ・一部プラグインとの競合問題を修正。
//                  ・ウィンドウ不透明度を指定可能に。
//                  ・スロット選択カーソルを非表示にする機能を追加。
//                  ・アイテムを自動的にスロットに追加する機能を無効化可能に。
//                  ・アイテム選択、アイテム使用のキーアサインを変更可能に。
//                  ・プラグインパラメーターの指定方法を変更。
//
// 1.0.0 2017/08/15 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * @plugindesc (v1.2.1) マップアイテムスロットプラグイン
 * @author マンカインド
 *
 * @help = マップアイテムスロットプラグイン =
 * MKR_MapItemSlot.js
 *
 * マップ画面上に表示したアイテムスロットからアイテムの使用/装備を
 * することができるようになります。
 *
 * アイテムスロットの選択は
 *   ・キーボードの1～9,0キー(デフォルト設定)
 *   ・ゲーム画面上でマウスホイール操作
 * で可能です。
 *
 * スロット数を10としたとき、スロット番号は以下のようになります。
 * (デフォルトでキーボードの数字キーに対応しています。
 *  0キーはスロット番号10として扱います)
 * アイテムスロット:[1] [2] [3] [4] [5] [6] [7] [8] [9] [10]
 * キーボードキー  : 1   2   3   4   5   6   7   8   9   0
 *
 * 選択したスロットにアイテム(道具)が登録されていた場合、
 * 画面上をマウスで左クリック、または指定したキーを押すことで
 * 選択されたアイテムを使用することができます。
 * (範囲が[味方単体]、[使用者]の場合は先頭のアクターに使用。
 *  [味方全体]の場合はパーティ全体に効果を発揮します)
 *
 * アイテムの使用をマウス、またはキーボード、どちらの方法で
 * 行うかは選択可能です。
 *
 * なお、アイテム使用方法にマウスクリックを選択した場合、
 * マップ上を移動するためにマウスクリック/タッチ操作を
 * 使うことはできなくなります。
 *
 * 同じアイテムを複数個所持している場合、
 * その個数がスロット右下に数字として表示されます。
 * (プラグインパラメータで非表示に設定可能)
 *
 * アイテム個数が0になったとき、
 * アイテムスロットからそのアイテムを削除するか、
 * グレーアウトさせた状態で残しておくかはプラグインパラメータから設定可能です。
 *
 * 選択したスロットに装備が登録されていた場合、
 * 装備可能なものであれば選択と同時にパーティ先頭のアクターに装備されます。
 * なお、選択カーソルが装備の登録されたスロットから外れると
 * アクターの装備も外れます。
 *
 * 装備中アイテム(=カーソルが装備の登録されているスロット上にある)の場合、
 * スロット左上に E と表示されます。
 *
 * プラグインパラメータ[武器登録可否]がONのとき、
 * メニューの装備画面から先頭アクターの武器変更をすることができなくなります。
 * (アイテムスロットの選択によって武器の変更を行ってください)
 *
 * プラグインパラメータ[防具登録可否]がONのとき、
 * メニューの装備画面から先頭アクターの防具変更をすることができなくなります。
 * (アイテムスロットの選択によって防具の変更を行ってください)
 *
 * アイテムスロットは先頭から、
 * 既に所持しているアイテム、または入手したアイテムが自動的に
 * 登録されていきます。
 * (スロットが空いている場合のみ。ゲーム開始時にアイテムを装備済みの場合は
 * そのアイテムがスロットの先頭に登録されます)
 * プラグインパラメータ:[アイテム自動使用機能]をOFFにすることで
 * この機能を無効にすることができます。
 *
 * メニュー画面の項目[アイテムスロット]からスロットに
 * 登録するアイテムを変更可能です。
 *
 * [登録]はアイテムスロットにアイテムを登録します。
 * マップ画面で選択されているスロットに
 * 装備アイテムを登録した場合は自動的に装備されます。
 *
 * [削除]は選択したスロットを空にします。
 * 装備していたアイテムをアイテムスロットから削除した場合、
 * アクターからその装備が外れます。
 *
 *
 * カテゴリー並び替え方式について:
 *   プラグインパラメータ[カテゴリー並び替え方式]にて、
 *   アイテムスロットメニュー画面上のカテゴリウィンドウの扱いを
 *   変更することができます。
 *   (アイテムカテゴリウィンドウは、アイテムと武器、といった
 *    2種類以上のアイテムをアイテムスロットへ登録する設定となっているときに
 *    表示されます)
 *
 *   ・カテゴリを表示する
 *       カテゴリウィンドウからアイテムのカテゴリを選択することで、
 *       選択したカテゴリに沿ったアイテムがアイテムリストに表示されます。
 *       デフォルトの設定です。
 *
 *   ・アイテム->武器->防具  (これ以下の設定は、並び替えの順番が違うだけです)
 *       カテゴリウィンドウを非表示にして、アイテムリスト上でアイテムを
 *       カテゴリごとに分類し表示します。
 *       この設定ではアイテム、武器、防具の順にアイテムリスト上のアイテムが
 *       並び替えられます。
 *
 *
 * プラグインパラメータによる動作について:
 *   アイテムスロットに対する操作はプラグインパラメータにより変更できます。
 *
 *     ・マウス使用モード.アイテム使用(Mouse_Mode.Use_Enable)
 *         マウスクリック(画面タッチ)でアイテムの使用が可能になります。
 *
 *     ・マウス使用モード.スロット選択(Mouse_Mode.Select_Enable)
 *         マウスホイールでスロットの選択が可能になります。
 *
 *     ・キーボード使用モード.アイテム使用(Keyboard_Mode.Use_Enable)
 *         キーボードでアイテムの使用が可能になります。
 *
 *     ・キーボード使用モード.スロット選択(Keyboard_Mode.Select_Enable)
 *         キーボードでスロットの選択が可能になります。
 *
 *     ・イベント実行中の動作.スロットの表示(Event_Mode.Slot_Enable)
 *         イベント実行中、スロットの表示/非表示を設定できます。
 *
 *     ・イベント実行中の動作.アイテム使用(Event_Mode.Use_Enable)
 *         イベント実行中、スロットアイテムの使用可/不可を設定できます。
 *
 *     ・イベント実行中の動作.スロット選択(Event_Mode.Select_Enable)
 *         イベント実行中、スロット選択の可/不可を設定できます。
 *
 *   以下のプラグインパラメータによりアイテムスロットの挙動が変化します。
 *
 *     ・アイテム登録モード(Slot_Add_Mode)
 *       ONの場合、入手したアイテムは自動的にスロットへと登録されます。
 *       自動で登録させたくない場合はOFFにするか、後述するメモ欄の設定を
 *       行ってください。
 *
 *     ・アイテム使用モード(Item_Use_Mode)
 *       ONの場合、アイテムが登録されたスロットにカーソルが移動すると、
 *       自動的にそのアイテムが使用されます。
 *       マウスホイールでのカーソル操作でも自動使用されてしまうため、
 *       このモードをONにするときは[マウス使用モード.スロット選択]を
 *       OFFにするのを推奨します。
 *
 *     ・武器登録可否(Slot_Set_Weapon)
 *       ONの場合、スロットに武器が登録可能になります。
 *       また、装備画面から武器の変更が行えなくなります。
 *       アイテムのみ登録させたい、武器は自由に変更したい場合は
 *       OFFにしてください。
 *
 *     ・防具登録可否(Slot_Set_Armor)
 *       ONの場合、スロットに防具が登録可能になります。
 *       また、装備画面から防具の変更が行えなくなります。
 *       アイテムのみ登録させたい、防具は自由に変更したい場合は
 *       OFFにしてください。
 *
 *     ・アイテム削除モード(Item_Remove_Mode)
 *       ONの場合、スロットにセットされたアイテムの個数が0個になると
 *       スロットからアイテムが自動的に削除されます。
 *       OFFにすると、アイテムは個数0の状態でグレー表示になります。
 *       アイテム個数が0のため、使用することはできません。
 *
 *     ・スロット不透明度調整
 *         イベント実行中にスロットがフェードアウト
 *         イベント終了後にスロットがフェードイン
 *       等するときに、1フレーム中に操作するスロットの不透明度を指定します。
 *       ここで指定した数値分、
 *         不透明度を減らしながらフェードアウト
 *         不透明度を増やしながらフェードイン
 *       するようになります。
 *
 *
 * スロットサイズ倍率について:
 *   プラグインパラメータ[スロットサイズ倍率]からスロットの大きさを
 *   変更することができます。(1.0倍～2.0倍まで)
 *
 *   サイズ倍率と最大スロット数によってはスロットが画面外へと
 *   飛び出してしまう可能性があります。
 *   (例えばスロット10個でサイズを2.0倍にすると、
 *    デフォルトのゲーム画面の横サイズである816pxより大きくなってしまいます)
 *
 *   自動的にゲーム画面内に収まるよう超過サイズを調整する機能はありませんので、
 *   ゲーム画面内に収まるよう設定の考慮をお願いします。
 *
 *
 * 武器・アイテムメモ欄:
 *   <itemslot:noadd>
 *     ・このメモを設定された武器、アイテムはアイテムスロットへの登録が
 *       できなくなります。
 *
 *
 * プラグインコマンド:
 *   itemslot hide
 *     ・アイテムスロットを非表示にします。
 *
 *   itemslot show
 *     ・アイテムスロットを表示します。パラメータ:Slot_Visibleが
 *       OFFの場合、このコマンドを使い任意のタイミングでアイテムスロットを
 *       表示させる必要があります。
 *
 *   itemslot set [スロット番号] [アイテムタイプ] [アイテムID] [装備フラグ]
 *     ・指定したアイテムスロットに指定したアイテムを登録します。
 *
 *     ・[スロット番号]は1～スロット最大数までの番号を指定します。
 *       自動的に空きスロットを探してアイテムを登録したい場合は 0 を
 *       指定します。(空きスロットが存在しない場合は登録されません)
 *
 *     ・[アイテムタイプ]は登録したいアイテムの種類を指定します。
 *       (item / weapon / armor のいずれか)
 *       データベース【アイテム】のアイテムを登録したい場合は item を、
 *       データベース【武器】のアイテムを登録したい場合は weapon を
 *       データベース【防具】のアイテムを登録したい場合は armor を
 *       指定してください。
 *
 *     ・[アイテムID]はアイテムのIDを指定します。
 *       例えば、初期登録されている【ポーション】はID:1となります。
 *       初期登録されている【弓】はID:4となります。
 *
 *     ・[装備フラグ]は、登録した武器を
 *       すぐに装備(カーソル選択)させる場合に true を指定します。
 *       アイテムを登録する場合は true を設定しても意味はありません。
 *
 *   itemslot remove [スロット番号]
 *     ・指定した[スロット番号]のスロットに登録されているアイテムを
 *       スロットから削除します。
 *
 *     ・[スロット番号]は1～スロット最大数までの番号を指定します。
 *
 *     ・スロットからは削除されますが、
 *       所持アイテムを失うわけではありません。
 *
 *     ・装備中の武器をスロットから削除した場合、
 *       アクターから装備が外れますのでご注意ください、
 *
 *   itemslot clear
 *     ・アイテムスロットに登録されているアイテムを全て削除します。
 *
 *   itemslot menu [方式番号]
 *     ・メニュー項目[アイテムスロット]の表示方式を変更します。
 *       番号と方式の対応は以下のとおりです。
 *       0 : メニューに追加しない
 *       1 : メニューに追加し選択有効状態
 *       2 : メニューに追加するが選択不能状態
 *
 *   itemslot use [スロット番号]
 *     ・指定したスロットに登録されているアイテムを使用します。
 *
 *     ・[スロット番号]は1～スロット最大数までの番号を指定します。
 *
 *     ・指定したスロットに武器、または使用条件を満たさないアイテムが
 *       登録されている場合は使用することができません。
 *
 *   itemslot select [スロット番号 / left / right]
 *     ・アイテムスロットの選択カーソルを移動します。
 *
 *     ・スロット番号を数値で指定した場合、カーソルは指定した番号の
 *       スロットへと移動します。
 *
 *     ・leftを指定した場合、カーソルは一つ左に移動します。
 *       カーソルがスロット先頭を選択していた場合は末端に移動します。
 *
 *     ・rightを指定した場合、カーソルは一つ右に移動します。
 *       カーソルがスロット末端を選択していた場合は先頭に移動します。
 *
 *   itemslot edit
 *     ・アイテムスロット編集画面を開きます。
 *
 *
 * スクリプトコマンド:
 *   $gameParty.getItemSlotFreeNumber();
 *     ・アイテムが登録されていない(=空いている)スロット番号を返します。
 *       空いているスロットが存在しない場合は-1を返します。
 *       [例]
 *         ～変数1番に空きスロット番号を代入する～
 *         ◆変数の操作：#0001 空きスロット = $gameParty.getItemSlotFreeNumber();
 *
 *   $gameParty.isItemSlotItem([スロット番号], [アイテムID]);
 *     ・指定したスロット番号(1～)に登録されたアイテムが、
 *       指定したID(1～)である場合にtrueを返します。
 *       [例]
 *         ◆条件分岐：スクリプト：$gameParty.isItemSlotItem(1, 10);
 *             ～スロット1番にID10のアイテムが
 *               登録されているときの処理～
 *         ：分岐終了
 *
 *   $gameParty.isItemSlotWeapon([スロット番号], [武器ID]);
 *     ・指定したスロット番号(1～)に登録された武器が、
 *       指定したID(1～)である場合にtrueを返します。
 *       [例]
 *         ◆条件分岐：スクリプト：$gameParty.isItemSlotWeapon(2, 7);
 *             ～スロット2番にID7の武器が
 *               登録されているときの処理～
 *         ：分岐終了
 *
 *   $gameParty.isItemSlotArmor([スロット番号], [防具ID]);
 *     ・指定したスロット番号(1～)に登録された防具が、
 *       指定したID(1～)である場合にtrueを返します。
 *       [例]
 *         ◆条件分岐：スクリプト：$gameParty.isItemSlotItem(3, 23);
 *             ～スロット3番にID23の防具が
 *               登録されているときの処理～
 *         ：分岐終了
 *
 *
 * 補足：
 *   ・このプラグインに関するメモ欄の設定、プラグインコマンド/パラメーター、
 *     制御文字は大文字/小文字を区別していません。
 *
 *   ・プラグインパラメーターの説明に、[初期値]と書かれているものは
 *     プラグインコマンドで個別に設定変更が可能です。
 *     変更した場合、[初期値]より変更後の設定が
 *     優先されますのでご注意ください。
 *
 *   ・プラグインパラメータの説明に、[制御文字可]と書かれているものは
 *     設定値に制御文字を使用可能です。
 *     (例えば、変数を表示する\v[n]や、文章の改行を行う\nなどです)
 *
 *   ・変数を設定した場合、そのパラメータの利用時に変数の値を
 *     参照するため、パラメータの設定をゲーム中に変更できます。
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
 * @param Slot_Number
 * @text 最大スロット数
 * @desc アイテムスロットの最大数を指定してください。(1～10までの数字。デフォルト:10)
 * @type number
 * @min 1
 * @max 10
 * @default 10
 *
 * @param Slot_Set_Weapon
 * @text 武器登録可否
 * @desc アイテムスロットに武器を登録可能にするか選択します。(デフォルト:登録する)
 * @type boolean
 * @on 登録する
 * @off 登録しない
 * @default true
 *
 * @param Slot_Set_Armor
 * @text 防具登録可否
 * @desc アイテムスロットに防具を登録可能にするか選択します。(デフォルト:登録しない)
 * @type boolean
 * @on 登録する
 * @off 登録しない
 * @default false
 *
 * @param Item_Count_Visible
 * @text アイテム個数の表示
 * @desc アイテムスロットに登録されたアイテムの個数を表示するか選択します。(デフォルト:表示する)
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @default true
 *
 * @param Mouse_Mode
 * @text マウスモード
 * @desc マウスでのアイテムスロット操作設定
 * @type struct<Mode>
 * @default {"Use_Enable":"true","Select_Enable":"true"}
 *
 * @param Keyboard_Mode
 * @text キーボードモード
 * @desc キーボードでのアイテムスロット操作設定
 * @type struct<Mode>
 * @default {"Use_Enable":"true","Select_Enable":"true"}
 *
 *
 * @param map_setting
 * @text スロット(マップ)設定
 * @default ====================================
 *
 * @param Slot_Visible
 * @text アイテムスロットの表示
 * @desc [初期値] アイテムスロットを初期状態で表示するか選択します。(デフォルト:表示)
 * @type boolean
 * @default true
 * @on 表示
 * @off 非表示
 * @parent map_setting
 *
 * @param Slot_Opacity_Offset
 * @text スロット不透明度調整
 * @desc アイテムスロットのフェードイン/アウト時、1フレーム中に変更するウィンドウ不透明度を整数で指定します。(デフォルト:16)
 * @type number
 * @min 1
 * @max 255
 * @default 16
 * @parent map_setting
 *
 * @param Slot_Background
 * @text アイテムスロットの背景
 * @desc アイテムスロットの背景画像を指定します。(デフォルト設定での必要画像サイズ:横384px,高さ60px)
 * @type file
 * @require 1
 * @dir img/pictures
 * @parent map_setting
 *
 * @param Slot_X
 * @text アイテムスロットX座標
 * @desc アイテムスロットを画面描画するためのX座標を指定してください。(数字/left/center/rightのいずれか。デフォルト:center)
 * @type combo
 * @option left
 * @option center
 * @option right
 * @default center
 * @parent map_setting
 *
 * @param Slot_Y
 * @text アイテムスロットY座標
 * @desc アイテムスロットを画面描画するためのY座標を指定してください。(数字/top/center/bottomのいずれか。デフォルト:bottom)
 * @type combo
 * @option top
 * @option center
 * @option bottom
 * @default bottom
 * @parent map_setting
 *
 * @param Map_Slot_Window
 * @text ウィンドウ設定(マップ)
 * @desc マップ画面のスロットウィンドウに関する設定です。(デフォルト:1.0 / 12 / 6)
 * @type struct<SlotWindow>
 * @default {"Size_Rate":"1.0","Padding":"12","Spacing":"6"}
 * @parent map_setting
 *
 * @param Slot_Add_Mode
 * @text スロット登録モード
 * @desc 入手したアイテムを自動的にアイテムスロットに登録するか選択します。(デフォルト:登録する)
 * @type boolean
 * @on 登録する
 * @off 登録しない
 * @default true
 * @parent map_setting
 *
 * @param Item_Use_Mode
 * @text アイテム使用モード
 * @desc アイテムの登録されたスロットにカーソルを移動後、自動的にそのアイテムを使用するか選択します。(デフォルト:使用しない)
 * @type boolean
 * @on 使用する
 * @off 使用しない
 * @default false
 * @parent map_setting
 *
 * @param Item_Remove_Mode
 * @text アイテム消去モード
 * @desc スロットに登録されたアイテムが0個になったとき、スロットからそのアイテムを消去するか選択します。(デフォルト:削除する)
 * @type boolean
 * @on 削除する
 * @off 削除しない
 * @default true
 * @parent map_setting
 *
 * @param Slot_Cursor_Visible
 * @text カーソルの表示
 * @desc アイテムスロットの選択カーソルを表示するか選択します。(デフォルト:表示する)
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @default true
 * @parent map_setting
 *
 * @param Map_Slot_Opacity
 * @text 不透明度(マップ)
 * @desc マップ画面に表示されたアイテムスロットの不透明度を数値で指定します。0で完全に透明になります。(デフォルト:255)
 * @type number
 * @max 255
 * @min 0
 * @default 255
 * @parent map_setting
 *
 * @param Event_Mode
 * @text イベント実行中の動作
 * @desc マップ上でイベント実行中、アイテムスロットの動作を設定します。
 * @type struct<EventMode>
 * @default {"Slot_Enable":"false","Use_Enable":"false","Select_Enable":"false"}
 * @parent map_setting
 *
 *
 * @param key_config
 * @text キーコンフィグ
 * @default ====================================
 *
 * @param Item_Use_Key
 * @text アイテム使用キー
 * @desc スロットに登録されたアイテムを使用するためのキーを指定してください。(デフォルト:Control) ※括弧内はキー名
 * @type struct<Key>
 * @default {"Key":"control"}
 * @parent key_config
 *
 * @param Slot_1_Key
 * @text スロット1選択キー
 * @desc アイテムスロット１番を選択するキーを指定してください。(デフォルト:1) ※括弧内はキー名
 * @type struct<Key>
 * @default {"Key":"1"}
 * @parent key_config
 *
 * @param Slot_2_Key
 * @text スロット2選択キー
 * @desc アイテムスロット２番を選択するキーを指定してください。(デフォルト:2) ※括弧内はキー名
 * @type struct<Key>
 * @default {"Key":"2"}
 * @parent key_config
 *
 * @param Slot_3_Key
 * @text スロット3選択キー
 * @desc アイテムスロット３番を選択するキーを指定してください。(デフォルト:3) ※括弧内はキー名
 * @type struct<Key>
 * @default {"Key":"3"}
 * @parent key_config
 *
 * @param Slot_4_Key
 * @text スロット4選択キー
 * @desc アイテムスロット４番を選択するキーを指定してください。(デフォルト:4) ※括弧内はキー名
 * @type struct<Key>
 * @default {"Key":"4"}
 * @parent key_config
 *
 * @param Slot_5_Key
 * @text スロット5選択キー
 * @desc アイテムスロット５番を選択するキーを指定してください。(デフォルト:5) ※括弧内はキー名
 * @type struct<Key>
 * @default {"Key":"5"}
 * @parent key_config
 *
 * @param Slot_6_Key
 * @text スロット6選択キー
 * @desc アイテムスロット６番を選択するキーを指定してください。(デフォルト:6) ※括弧内はキー名
 * @type struct<Key>
 * @default {"Key":"6"}
 * @parent key_config
 *
 * @param Slot_7_Key
 * @text スロット7選択キー
 * @desc アイテムスロット７番を選択するキーを指定してください。(デフォルト:7) ※括弧内はキー名
 * @type struct<Key>
 * @default {"Key":"7"}
 * @parent key_config
 *
 * @param Slot_8_Key
 * @text スロット8選択キー
 * @desc アイテムスロット８番を選択するキーを指定してください。(デフォルト:8) ※括弧内はキー名
 * @type struct<Key>
 * @default {"Key":"8"}
 * @parent key_config
 *
 * @param Slot_9_Key
 * @text スロット9選択キー
 * @desc アイテムスロット９番を選択するキーを指定してください。(デフォルト:9) ※括弧内はキー名
 * @type struct<Key>
 * @default {"Key":"9"}
 * @parent key_config
 *
 * @param Slot_10_Key
 * @text スロット10選択キー
 * @desc アイテムスロット１０番を選択するキーを指定してください。(デフォルト:0) ※括弧内はキー名
 * @type struct<Key>
 * @default {"Key":"0"}
 * @parent key_config
 *
 *
 * @param menu_setting
 * @text スロット(メニュー)設定
 * @default ====================================
 *
 * @param Menu_Slot_Mode
 * @text メニュー表示モード
 * @desc [初期値]アイテムスロット画面コマンドをメニューに追加する方式を指定してください。(デフォルト:コマンド有効状態で追加)
 * @type select
 * @option 追加しない
 * @value 0
 * @option コマンド有効状態で追加
 * @value 1
 * @option コマンド無効状態で追加
 * @value 2
 * @default 1
 * @parent menu_setting
 *
 * @param Menu_Background
 * @text スロットメニューの背景
 * @desc スロットメニュー画面の背景画像を指定します。(デフォルトのゲーム画面サイズ:横816px,高さ624px)
 * @type file
 * @require 1
 * @dir img/pictures
 * @parent menu_setting
 *
 * @param Map_Background_Enable
 * @text マップスロット背景切替
 * @desc メニュー画面のアイテムスロット背景に、マップ上で表示している背景画像を表示するか指定します。(デフォルト:表示しない)
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @default false
 * @parent menu_setting
 *
 * @param Menu_Slot_Window
 * @text ウィンドウ設定(メニュー)
 * @desc アイテムスロット画面のスロットウィンドウに関する設定です。(デフォルト:1.3 / 12 / 6)
 * @type struct<SlotWindow>
 * @default {"Size_Rate":"1.3","Padding":"12","Spacing":"6"}
 * @parent menu_setting
 *
 * @param Menu_Slot_Name
 * @text スロットコマンド名
 * @desc メニューに追加する、アイテムスロット画面へ飛ぶためのコマンド名を指定してください。(デフォルト:アイテムスロット)
 * @type text
 * @default アイテムスロット
 * @parent menu_setting
 *
 * @param Slot_Set_Name
 * @text スロット登録コマンド名
 * @desc アイテムスロット画面で、アイテムをスロットへ登録するためのコマンド名を指定してください。(デフォルト:登録)
 * @type text
 * @default 登録
 * @parent menu_setting
 *
 * @param Slot_Remove_Name
 * @text スロット削除コマンド名
 * @desc アイテムスロット画面で、スロットに登録されたアイテムをクリアするためのコマンド名を指定してください。(デフォルト:削除)
 * @type text
 * @default 解除
 * @parent menu_setting
 *
 * @param Slot_Set_Desc
 * @text スロット登録説明文
 * @desc [制御文字可]アイテムスロット画面で、スロットにアイテムを登録する際の説明文を指定してください。
 * @type note
 * @default "アイテムを登録したいスロットを選択し、\n登録するアイテムを選択してください。"
 * @parent menu_setting
 *
 * @param Slot_Remove_Desc
 * @text スロット削除説明文
 * @desc [制御文字可]アイテムスロット画面で、スロットに登録されたアイテムを解除するスロットを選択する際の説明文を指定してください。
 * @type note
 * @default "アイテムの登録を解除するスロットを選択してください。"
 * @parent menu_setting
 *
 * @param Menu_Slot_Opacity
 * @text 不透明度(メニュー)
 * @desc アイテムスロット画面のウィンドウの不透明度を数値で指定します。0で完全に透明になります。(デフォルト:255)
 * @type number
 * @max 255
 * @min 0
 * @default 255
 * @parent menu_setting
 *
 * @param Category_Sort_Type
 * @text カテゴリ並び替え方式
 * @desc スロット画面のカテゴリを表示せず、リスト内でアイテムの並び変えを行う場合変更します。(デフォルト:カテゴリを表示する)
 * @type select
 * @option カテゴリを表示する
 * @value 0
 * @option アイテム->武器->防具
 * @value 1
 * @option アイテム->防具->武器
 * @value 2
 * @option 武器->アイテム->防具
 * @value 3
 * @option 武器->防具->アイテム
 * @value 4
 * @option 防具->アイテム->武器
 * @value 5
 * @option 防具->武器->アイテム
 * @value 6
 * @default 0
 * @parent menu_setting
 *
 */
/*~struct~Key:
 *
 * @param Key
 * @text キーコンフィグ
 * @desc キーを指定してください。※括弧内はキー名など補足
 * @type select
 * @option なし
 * @value null
 * @option ダッシュ(Shift)
 * @value shift
 * @option Control(Ctrl/Alt/Command/Option)
 * @value control
 * @option A
 * @option B
 * @option C
 * @option D
 * @option E
 * @option F
 * @option G
 * @option H
 * @option I
 * @option J
 * @option K
 * @option L
 * @option N
 * @option M
 * @option O
 * @option P
 * @option R
 * @option S
 * @option T
 * @option U
 * @option V
 * @option Y
 * @option 1
 * @option 2
 * @option 3
 * @option 4
 * @option 5
 * @option 6
 * @option 7
 * @option 8
 * @option 9
 * @option 0
 *
 */
/*~struct~Mode:
 *
 * @param Use_Enable
 * @text アイテム使用
 * @desc このモードでスロットに登録されたアイテムの使用が可能か選択します。(デフォルト:使用可能)
 * @type boolean
 * @on 使用可能
 * @off 使用不可
 *
 * @param Select_Enable
 * @text スロット選択
 * @desc このモードでスロットの選択が可能か選択します。(デフォルト:選択可能)
 * @type boolean
 * @on 選択可能
 * @off 選択不可
 *
 */
/*~struct~EventMode:
 *
 * @param Slot_Enable
 * @text スロットの表示
 * @desc イベント実行中、スロットを表示したままにするか非表示にするかを選択します。(デフォルト:非表示)
 * @type boolean
 * @on 表示
 * @off 非表示
 * @default false
 *
 * @param Use_Enable
 * @text アイテム使用
 * @desc イベント実行中にスロットが表示されているとき、スロットアイテムの使用が可能か選択します。(デフォルト:使用不可)
 * @type boolean
 * @on 使用可能
 * @off 使用不可
 * @default false
 *
 * @param Select_Enable
 * @text スロット選択
 * @desc イベント実行中にスロットが表示されているとき、スロットを選択可能か選択します。(デフォルト:選択不可)
 * @type boolean
 * @on 選択可能
 * @off 選択不可
 * @default false
 *
 */
/*~struct~SlotWindow:
 *
 * @param Size_Rate
 * @text スロットサイズ倍率
 * @desc スロットサイズ倍率を指定してください。サイズは1.0で100%(1倍)、2.0で200%(2倍)となります。(1.0～2.0までの数字)
 * @type number
 * @decimals 1
 * @min 1.0
 * @max 2.0
 *
 * @param Padding
 * @text ウィンドウ内余白
 * @desc スロットウィンドウとスロットアイコン間の余白を調整します。(7以上の数字)
 * @type number
 * @min 7
 *
 * @param Spacing
 * @text アイコン間隔
 * @desc スロットアイコンの配置間隔を調整します。(0以上の数字)
 * @type number
 * @min 0
 *
 * */

var Imported = Imported || {};
Imported.MKR_MapItemSlot = true;

(function () {
    'use strict';

    const PN = "MKR_MapItemSlot";

    const CheckParam = function (type, name, value, def, min, max, options) {
        if (min == undefined || min == null) {
            min = -Infinity;
        }
        if (max == undefined || max == null) {
            max = Infinity;
        }

        if (value == null) {
            value = "";
        } else {
            value = String(value);
        }

        value = value.replace(/\\/g, '\x1b');
        value = value.replace(/\x1b\x1b/g, '\\');

        switch (type) {
            case "bool":
                if (value == "") {
                    value = (def) ? true : false;
                }
                value = value.toUpperCase() === "ON" || value.toUpperCase() === "TRUE" || value.toUpperCase() === "1";
                break;
            case "num":
                if (value == "") {
                    value = (isFinite(def)) ? parseInt(def, 10) : 0;
                } else {
                    value = (isFinite(value)) ? parseInt(value, 10) : (isFinite(def)) ? parseInt(def, 10) : 0;
                    value = value.clamp(min, max);
                }
                break;
            case "float":
                if (value == "") {
                    value = (isFinite(def)) ? parseFloat(def) : 0.0;
                } else {
                    value = (isFinite(value)) ? parseFloat(value) : (isFinite(def)) ? parseFloat(def) : 0.0;
                    value = value.clamp(min, max);
                }
                break;
            case "string":
                value = value.replace(/^\"/, "");
                value = value.replace(/\"$/, "");
                if (value != null && options && options.contains("lower")) {
                    value = value.toLowerCase();
                }
                if (value != null && options && options.contains("upper")) {
                    value = value.toUpperCase();
                }
                break;
            default:
                throw new Error("[CheckParam] " + name + "のタイプが不正です: " + type);
                break;
        }

        return [value, type, def, min, max];
    };

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

    const paramParse = function (obj) {
        return JSON.parse(JSON.stringify(obj, paramReplace));
    }

    const paramReplace = function (key, value) {
        try {
            return JSON.parse(value || null);
        } catch (e) {
            return value;
        }
    };

    const Parameters = paramParse(PluginManager.parameters(PN));
    let Params = {};

    Params = {
        "SlotVisible": CheckParam("bool", "Slot_Visible", Parameters["Slot_Visible"], true),
        "SlotOpacityOffset": CheckParam("num", "Slot_Opacity_Offset", Parameters["Slot_Opacity_Offset"], 16, 1, 255),
        "SlotBackground": CheckParam("string", "Slot_Background", Parameters["Slot_Background"], ""),
        "SlotNumber": CheckParam("num", "Slot_Number", Parameters["Slot_Number"], 10, 1, 10),
        "SlotX": CheckParam("string", "Slot_X", Parameters["Slot_X"], "center"),
        "SlotY": CheckParam("string", "Slot_Y", Parameters["Slot_Y"], "bottom"),
        "SlotSetW": CheckParam("bool", "Slot_Set_Weapon", Parameters["Slot_Set_Weapon"], true),
        "SlotSetA": CheckParam("bool", "Slot_Set_Armor", Parameters["Slot_Set_Armor"], true),
        "SlotCursorVisible": CheckParam("bool", "Slot_Cursor_Visible", Parameters["Slot_Cursor_Visible"], true),
        "MapSlotOpacity": CheckParam("num", "Map_Slot_Opacity", Parameters["Map_Slot_Opacity"], 255, 0, 255),
        "SlotAddMode": CheckParam("bool", "Slot_Add_Mode", Parameters["Slot_Add_Mode"], true),
        "ItemRemoveMode": CheckParam("bool", "Item_Remove_Mode", Parameters["Item_Remove_Mode"], true),
        "ItemUseMode": CheckParam("bool", "Item_Use_Mode", Parameters["Item_Use_Mode"], false),
        "ItemCountVisible": CheckParam("bool", "Item_Count_Visible", Parameters["Item_Count_Visible"], true),
        "MenuSlotMode": CheckParam("num", "Menu_Slot_Mode", Parameters["Menu_Slot_Mode"], "コマンド有効状態で追加"),
        "MenuBackground": CheckParam("string", "Menu_Background", Parameters["Menu_Background"], ""),
        "MapBackgroundEnable": CheckParam("bool", "Map_Background_Enable", Parameters["Map_Background_Enable"], false),
        "MenuSlotName": CheckParam("string", "Menu_Slot_Name", Parameters["Menu_Slot_Name"], "アイテムスロット"),
        "SlotSetName": CheckParam("string", "Slot_Set_Name", Parameters["Slot_Set_Name"], "登録"),
        // "SlotChangeName" : CheckParam("string", "Slot_Change_Name", Parameters["Slot_Change_Name"], "入れ替え"),
        "SlotRemoveName": CheckParam("string", "Slot_Remove_Name", Parameters["Slot_Remove_Name"], "削除"),
        "SlotSetDesc": CheckParam("string", "Slot_Set_Desc", Parameters["Slot_Set_Desc"], "アイテムを登録したいスロットを選択し、\n登録するアイテムを選択してください。"),
        "SlotChangeDesc": CheckParam("string", "Slot_Change_Desc", Parameters["Slot_Change_Desc"], "移動元のスロットを選択し、\n交換先のスロットを選択してください。"),
        "SlotRemoveDesc": CheckParam("string", "Slot_Remove_Desc", Parameters["Slot_Remove_Desc"], "アイテムの登録を解除するスロットを選択してください。"),
        "MenuSlotOpacity": CheckParam("num", "Menu_Slot_Opacity", Parameters["Menu_Slot_Opacity"], 255, 0, 255),
        "CateSortType": CheckParam("num", "Category_Sort_Type", Parameters["Category_Sort_Type"], 0),
        "MapSlotWindow": {
            "SizeRate": CheckParam("float", "Map_Slot_Window.Size_Rate", Parameters["Map_Slot_Window"]["Size_Rate"], 1.0, 1.0, 2.0),
            "Padding": CheckParam("num", "Map_Slot_Window.Padding", Parameters["Map_Slot_Window"]["Padding"], 12, 7),
            "Spacing": CheckParam("num", "Map_Slot_Window.Spacing", Parameters["Map_Slot_Window"]["Spacing"], 6, 0),
        },
        "MenuSlotWindow": {
            "SizeRate": CheckParam("float", "Menu_Slot_Window.Size_Rate", Parameters["Menu_Slot_Window"]["Size_Rate"], 1.0, 1.0, 2.0),
            "Padding": CheckParam("num", "Menu_Slot_Window.Padding", Parameters["Menu_Slot_Window"]["Padding"], 12, 7),
            "Spacing": CheckParam("num", "Menu_Slot_Window.Spacing", Parameters["Menu_Slot_Window"]["Spacing"], 6, 0),
        },
        "KeyConfig": {
            "ItemUseKey": CheckParam("string", "Item_Use_Key", Parameters["Item_Use_Key"]["Key"], "control", null, null, ["lower"]),
            "Slot1Key": CheckParam("string", "Slot_1_Key", Parameters["Slot_1_Key"]["Key"], "1", null, null, ["lower"]),
            "Slot2Key": CheckParam("string", "Slot_2_Key", Parameters["Slot_2_Key"]["Key"], "2", null, null, ["lower"]),
            "Slot3Key": CheckParam("string", "Slot_3_Key", Parameters["Slot_3_Key"]["Key"], "3", null, null, ["lower"]),
            "Slot4Key": CheckParam("string", "Slot_4_Key", Parameters["Slot_4_Key"]["Key"], "4", null, null, ["lower"]),
            "Slot5Key": CheckParam("string", "Slot_5_Key", Parameters["Slot_5_Key"]["Key"], "5", null, null, ["lower"]),
            "Slot6Key": CheckParam("string", "Slot_6_Key", Parameters["Slot_6_Key"]["Key"], "6", null, null, ["lower"]),
            "Slot7Key": CheckParam("string", "Slot_7_Key", Parameters["Slot_7_Key"]["Key"], "7", null, null, ["lower"]),
            "Slot8Key": CheckParam("string", "Slot_8_Key", Parameters["Slot_8_Key"]["Key"], "8", null, null, ["lower"]),
            "Slot9Key": CheckParam("string", "Slot_9_Key", Parameters["Slot_9_Key"]["Key"], "9", null, null, ["lower"]),
            "Slot10Key": CheckParam("string", "Slot_10_Key", Parameters["Slot_10_Key"]["Key"], "0", null, null, ["lower"]),
        },
        "KeyboardMode": {
            "UseEnable": CheckParam("bool", "KeyboardMode.Use_Enable", Parameters["Keyboard_Mode"]["Use_Enable"], true),
            "SelectEnable": CheckParam("bool", "KeyboardMode.Select_Enable", Parameters["Keyboard_Mode"]["Select_Enable"], true),
        },
        "MouseMode": {
            "UseEnable": CheckParam("bool", "MouseMode.Use_Enable", Parameters["Mouse_Mode"]["Use_Enable"], true),
            "SelectEnable": CheckParam("bool", "MouseMode.Select_Enable", Parameters["Mouse_Mode"]["Select_Enable"], true),
        },
        "EventMode": {
            "SlotEnable": CheckParam("bool", "EventMode.Slot_Enable", Parameters["Event_Mode"]["Slot_Enable"], false),
            "UseEnable": CheckParam("bool", "EventMode.Use_Enable", Parameters["Event_Mode"]["Use_Enable"], false),
            "SelectEnable": CheckParam("bool", "EventMode.Select_Enable", Parameters["Event_Mode"]["Select_Enable"], false),
        },
    };

    const ITEM = "item";
    const WEAPON = "weapon";
    const ARMOR = "armor";
    const CATEGORYSORT = {
        "DEFAULT": 0,
        "I_W_A": 1,
        "I_A_W": 2,
        "W_I_A": 3,
        "W_A_I": 4,
        "A_I_W": 5,
        "A_W_I": 6,
    };


    //=========================================================================
    // Input
    //  ・キー判定処理を再定義します。
    //
    //=========================================================================
    const _Input_onKeyDown = Input._onKeyDown;
    Input._onKeyDown = function (event) {
        _Input_onKeyDown.call(this, event);

        let name;
        name = codeToName(event);

        // console.log(event);
        if (!Input.keyMapper[event.keyCode]) {
            // console.log("name:"+name);
            if (name) {
                this._currentState[name] = true;
            }
        }
    };

    const _Input_onKeyUp = Input._onKeyUp;
    Input._onKeyUp = function (event) {
        _Input_onKeyUp.call(this, event);

        let name;
        name = codeToName(event);

        if (!Input.keyMapper[event.keyCode]) {
            if (name) {
                this._currentState[name] = false;
            }
        }
    };


    //=========================================================================
    // Game_Interpreter
    //  ・アイテムスロットを操作するプラグインコマンドを定義します。
    //
    //=========================================================================
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        let index, id, type, item, equip, i, cnt, itemSlot, actor, scene;
        index = -1;
        id = 0;
        type = null;
        item = null;
        equip = false;
        itemSlot = [];
        actor = $gameParty.leader();
        scene = SceneManager._scene;

        if (command.toLowerCase() === "itemslot") {
            switch (args[0].toLowerCase()) {
                case "show":
                    $gameParty.setItemSlotVisible(true);
                    break;
                case "hide":
                    $gameParty.setItemSlotVisible(false);
                    break;
                case "edit":
                    SceneManager.push(Scene_ItemSlot);
                    break;
                case "set":
                    if (args[1] != null && isFinite(args[1])) {
                        index = parseInt(args[1], 10) - 1;
                    }
                    if (args[2]) {
                        if ((args[2].toLowerCase() == WEAPON && Params.SlotSetW[0]) || (args[2].toLowerCase() == ARMOR && Params.SlotSetA[0]) || (args[2].toLowerCase() == ITEM)) {
                            type = args[2].toLowerCase();
                        }
                    }
                    if (args[3] != null && isFinite(args[3])) {
                        id = parseInt(args[3], 10);
                    }
                    if (args[4]) {
                        equip = args[4].toLowerCase() === "true" ? true : false;
                        if (type == ITEM) {
                            equip = false;
                        }
                    }

                    if (index < -1 || index >= Params.SlotNumber[0] || !type || id < 1) {
                        break;
                    }

                    item = DataManager.getItemByIdType(id, type);

                    if (type == WEAPON && !actor.isEquipWtypeOk(item.wtypeId)) {
                        equip = false;
                    }

                    if (type == ARMOR && !actor.isEquipAtypeOk(item.atypeId)) {
                        equip = false;
                    }

                    if (item && $gameParty.hasItemType(item)) {
                        $gameParty.setItemSlot(index, item, equip);
                        // if(!equip) {
                        // スロットセット時にアイテムを増やす必要はあるか？
                        // $gameParty.gainItem(item, 1, false);
                        // }
                    }
                    break;
                case "remove":
                    if (args[1] != null && isFinite(args[1])) {
                        index = parseInt(args[1], 10) - 1;
                    }

                    if (index >= 0) {
                        // アイテムスロットのアイテム削除判定
                        $gameParty.removeItemSlot(index);
                        if (scene && scene.constructor == Scene_Map) {
                            scene._mapItemSlotWindow.redrawItem(index);
                        }
                    }
                    break;
                case "clear":
                    itemSlot = $gameParty.getItemSlot(-1);
                    cnt = itemSlot.length;
                    for (i = 0; i < cnt; i++) {
                        // アイテムスロットのアイテム削除判定
                        $gameParty.removeItemSlot(i);
                        if (scene && scene.constructor == Scene_Map) {
                            scene._mapItemSlotWindow.redrawItem(i);
                        }
                    }
                    break;
                case "menu":
                    $gameParty.setMenuSlotStatus(args[1]);
                    break;
                case "use":
                    if (args[1] != null && isFinite(args[1])) {
                        index = parseInt(args[1], 10) - 1;
                    }
                    if (index >= 0) {
                        itemSlot = $gameParty.getItemSlot(index);
                        if (itemSlot && itemSlot.type == ITEM) {
                            item = DataManager.getItemByIdType(itemSlot.id, itemSlot.type);
                            $gameParty.useItemSlot(item);

                            // アイテムスロットのアイテム削除判定
                            if (item && Params.ItemRemoveMode[0] && $gameParty.numItems(item) <= 0) {
                                $gameParty.removeItemSlot(index);
                                if (scene && scene.constructor == Scene_Map) {
                                    scene._mapItemSlotWindow.redrawItem(index);
                                }
                            }
                        }
                    }
                    break;
                case "select":
                    if (args[1] != "") {
                        if (slotToIndex(args[1].toLowerCase()) != -1) {
                            if (scene && scene.constructor == Scene_Map) {
                                scene._mapItemSlotWindow.select(slotToIndex(args[1].toLowerCase()));
                            }
                        }
                    }
                    break;
            }
        }
    };


    //=========================================================================
    // Game_Party
    //  ・アイテムスロットの内容を定義します。
    //
    //=========================================================================
    const _Game_Party_initialize = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function () {
        _Game_Party_initialize.call(this);

        this.initItemSlot();
    };

    Game_Party.prototype.initItemSlot = function () {
        let i, j, items, cnt, actor;
        i = 0;
        j = 0;

        if (this._itemSlot == undefined || this._itemSlot == null) {
            this._itemSlot = [];
            items = this.allItems();
            cnt = Params.SlotNumber[0];
            // アクターがアイテムを装備済みの場合、先にスロットに登録する。
            if ($gameParty && Params.SlotAddMode[0]) {
                actor = $gameParty.leader();
                if (actor.weapons().length > 0) {
                    actor.weapons().forEach(function (item) {
                        this.setItemSlot(i, item);
                        i++;
                    }, this);
                }
                if (actor.armors().length > 0) {
                    actor.armors().forEach(function (item) {
                        this.setItemSlot(i, item);
                        i++;
                    }, this);
                }
            }
            for (; i < cnt; i++) {
                if (items && items[j] && Params.SlotAddMode[0]) {
                    this.setItemSlot(i, items[j]);
                    j++;
                } else {
                    this._itemSlot[i] = null;
                }
            }
        }

        this._itemSlotLastIndex = -1;
        this._itemSlotSetIndex = -1;
        this._itemSlotVisible = true;
        if (this._menuSlotStatus == undefined || this._menuSlotStatus == null) {
            this._menuSlotStatus = Params.MenuSlotMode[0];
        }
        this._slotEquipItem = null;
    };

    Game_Party.prototype.updateItemSlot = function () {
        let i, cnt;

        if (this._itemSlot != undefined && this._itemSlot != null) {
            cnt = Params.SlotNumber[0];
            for (i = this._itemSlot.length; i < cnt; i++) {
                this._itemSlot[i] = null;
            }
        }
    };

    const _Game_Party_gainItem = Game_Party.prototype.gainItem;
    Game_Party.prototype.gainItem = function (item, amount, includeEquip) {
        let type, index, i, cnt, container, actor, meta;

        meta = "";
        if (item && item.meta) {
            meta = GetMeta(item.meta, "itemslot");
        }
        if (Params.SlotAddMode[0] && meta.toLowerCase() != "noadd") {
            container = this.itemContainer(item);
            if (container && this.hasItemType(item) && this.getSlotEquipItem() != item) {
                cnt = this._itemSlot.length;
                type = DataManager.getItemType(item);
                index = this.getItemSlotNumber(type, item.id);

                if (index == -1 && SceneManager._scene.constructor !== Scene_ItemSlot) {
                    this.setItemSlot(index, item);
                }
            }
        }

        _Game_Party_gainItem.apply(this, arguments);
    };

    Game_Party.prototype.setItemSlot = function (index, item, equip) {
        let equipFlg, actor, win, cnt, i;

        if (equip == undefined || equip == null) {
            equip = false;
        }

        if (index == -1) {
            index = this.getItemSlotFreeNumber() - 1;
        }

        // アイテムが登録済みの場合は新たに登録させない
        if (DataManager.isItem(item) && this.getItemSlotNumber(ITEM, item.id) >= 0) {
            index = -1;
        } else if (DataManager.isWeapon(item) && this.getItemSlotNumber(WEAPON, item.id) >= 0) {
            index = -1;
        } else if (DataManager.isArmor(item) && this.getItemSlotNumber(ARMOR, item.id) >= 0) {
            index = -1;
        }

        actor = $gameParty.leader();
        if (item && index >= 0 && index < Params.SlotNumber[0]) {
            if (DataManager.isItem(item)) {
                this._itemSlot[index] = {};
                this._itemSlot[index].id = item.id;
                this._itemSlot[index].type = ITEM;
            } else if ((Params.SlotSetW[0] && DataManager.isWeapon(item) && actor.isEquipWtypeOk(item.wtypeId)) || (Params.SlotSetA[0] && DataManager.isArmor(item) && actor.isEquipAtypeOk(item.atypeId))) {
                equipFlg = actor.isEquipped(item);
                this._itemSlot[index] = {};
                this._itemSlot[index].id = item.id;
                this._itemSlot[index].type = DataManager.isWeapon(item) ? WEAPON : ARMOR;
                this._itemSlot[index].etypeId = item.etypeId;
                this._itemSlot[index].equip = equipFlg;

                if (equip) {
                    $gameParty.setItemSlotLastIndex(index);
                    this._itemSlot[index].equip = true;
                    actor.changeEquipById(item.etypeId, item.id);
                }
            }
        }
    };

    Game_Party.prototype.removeItemSlot = function (index) {
        let cnt, item;
        cnt = this._itemSlot.length;

        if (index >= 0 && index < cnt) {
            if (this._itemSlot[index] && this._itemSlot[index].type == WEAPON) {
                item = $dataWeapons[this._itemSlot[index].id];
                this.leader().changeEquipById(item.etypeId, 0);
            }
            if (this._itemSlot[index] && this._itemSlot[index].type == ARMOR) {
                item = $dataArmors[this._itemSlot[index].id];
                this.leader().changeEquipById(item.etypeId, 0);
            }
            this._itemSlot[index] = null
        }
    };

    Game_Party.prototype.clearItemSlot = function () {
        let cnt;
        cnt = this._itemSlot.length;

        for (i = 0; i < cnt; i++) {
            this._itemSlot[i] = null;
        }
    };

    Game_Party.prototype.swapItemSlot = function (index1, index2) {
        let temp;
        temp = this._itemSlot[index1];

        this._itemSlot[index1] = this._itemSlot[index2];
        this._itemSlot[index2] = temp;
    };

    Game_Party.prototype.hasItemType = function (item) {
        let type;
        type = DataManager.getItemType(item);

        if (type == WEAPON && !Params.SlotSetW[0]) {
            return false;
        } else if (type == ARMOR && !Params.SlotSetA[0]) {
            return false;
        }

        return true;
    };

    Game_Party.prototype.setEquipStatus = function (index, equip) {
        let equipFlg, actor, itemSlot;
        itemSlot = this.getItemSlot(index);

        if (itemSlot && (itemSlot.type == WEAPON || itemSlot.type == ARMOR)) {
            this._itemSlot[index].equip = equip;
        }
    };

    Game_Party.prototype.getItemSlot = function (index) {
        if (this._itemSlot && isFinite(index)) {
            if (index == -1) {
                return this._itemSlot;
            } else if (index >= 0 && index < this._itemSlot.length) {
                return this._itemSlot[index];
            }
        }
        return null;
    };

    Game_Party.prototype.getItemSlotNumber = function (type, id) {
        let cnt, i, ret, itemSlot;
        cnt = this._itemSlot.length;
        ret = -1;

        for (i = 0; i < cnt; i++) {
            itemSlot = this._itemSlot[i];
            if (itemSlot) {
                if (itemSlot.type == type && itemSlot.id == id) {
                    ret = i;
                    break;
                }
            }
        }
        return ret;
    };

    Game_Party.prototype.getItemSlotFreeNumber = function () {
        let cnt, i, ret;
        cnt = this._itemSlot.length;
        ret = -1;

        cnt = this._itemSlot.length;
        for (i = 0; i < cnt; i++) {
            if (this._itemSlot[i] == null) {
                ret = i;
                break;
            }
        }

        return ++ret;
    };

    Game_Party.prototype.getItemSlotLastIndex = function () {
        return this._itemSlotLastIndex;
    };

    Game_Party.prototype.setItemSlotLastIndex = function (index) {
        this._itemSlotLastIndex = index;
    };

    Game_Party.prototype.getItemSlotForceIndex = function () {
        return this._itemSlotForceIndex;
    };

    Game_Party.prototype.setItemSlotForceIndex = function (index) {
        this._itemSlotForceIndex = index;
    };

    Game_Party.prototype.isItemSlotHide = function () {
        return !this._itemSlotVisible;
    };

    Game_Party.prototype.setItemSlotVisible = function (visible) {
        this._itemSlotVisible = visible;
    };

    Game_Party.prototype.getMenuSlotStatus = function () {
        return this._menuSlotStatus;
    };

    Game_Party.prototype.setMenuSlotStatus = function (status) {
        if (status != null && isFinite(status)) {
            status = parseInt(status, 10);
            if (status >= 0 && status <= 2) {
                this._menuSlotStatus = status;
            }
        }
    };

    Game_Party.prototype.getSlotEquipItem = function () {
        return this._slotEquipItem;
    };

    Game_Party.prototype.setSlotEquipItem = function (item) {
        if (item) {
            if (DataManager.getItemType(item) == WEAPON || DataManager.getItemType(item) == ARMOR) {
                this._slotEquipItem = item;
            } else {
                this._slotEquipItem = null;
            }
        }
    };

    Game_Party.prototype.useItemSlot = function (item) {
        let actor, action, i;
        actor = this.leader();

        if (item && actor.canUse(item) && (item.scope === 0 || this.isItemEffectsValid(item))) {
            $gameParty.setLastItem(item);
            actor.useItem(item);
            action = new Game_Action(actor);
            action.setItemObject(item);
            this.itemTargetActors(item).forEach(function (target) {
                for (i = 0; i < action.numRepeats(); i++) {
                    action.apply(target);
                }
            }, this);
            $gamePlayer.requestAnimation(item.animationId);
            action.applyGlobal();
            // this._mapItemSlotWindow.redrawCurrentItem();
            return true;
        } else if (item && DataManager.getItemType(item) == ITEM) {
            SoundManager.playBuzzer();
        }

        return false;
    };

    Game_Party.prototype.isItemEffectsValid = function (item) {
        let actor, action;
        actor = $gameParty.leader();
        action = new Game_Action(actor);
        action.setItemObject(item);

        return this.itemTargetActors(item).some(function (target) {
            return action.testApply(target);
        }, this);
    };

    Game_Party.prototype.itemTargetActors = function (item) {
        let actor, action;
        actor = $gameParty.leader();
        action = new Game_Action(actor);
        action.setItemObject(item);

        if (!action.isForFriend()) {
            return [];
        } else if (action.isForAll()) {
            return $gameParty.members();
        } else {
            return [actor];
        }
    };

    Game_Party.prototype.isItemSlotType = function (index, itemId, type) {
        let slot;

        if (!this._itemSlot) {
            return false;
        }

        slot = this._itemSlot[index];
        if (!slot || slot.id != itemId || slot.type != type) {
            return false;
        }

        return true;
    };

    Game_Party.prototype.isItemSlotItem = function (slotId, id) {
        let index;

        if (!isFinite(slotId) || !isFinite(id)) {
            return false;
        }
        index = parseInt(slotId, 10) - 1;
        id = parseInt(id, 10);

        if (index < 0 || id < 1) {
            return false;
        }

        return this.isItemSlotType(index, id, ITEM);
    };

    Game_Party.prototype.isItemSlotWeapon = function (slotId, id) {
        let index;


        if (!isFinite(slotId) || !isFinite(id)) {
            return false;
        }
        index = parseInt(slotId, 10) - 1;
        id = parseInt(id, 10);

        if (index < 0 || id < 1) {
            return false;
        }

        return this.isItemSlotType(index, id, WEAPON);
    };

    Game_Party.prototype.isItemSlotArmor = function (slotId, id) {
        let index;

        if (!isFinite(slotId) || !isFinite(id)) {
            return false;
        }
        index = parseInt(slotId, 10) - 1;
        id = parseInt(id, 10);

        if (index < 0 || id < 1) {
            return false;
        }

        return this.isItemSlotType(index, id, ARMOR);
    };


    //=========================================================================
    // Game_Actor
    //  ・リーダーアクターの武器変更処理を再定義します。
    //
    //=========================================================================
    const _Game_Actor_isEquipChangeOk = Game_Actor.prototype.isEquipChangeOk;
    Game_Actor.prototype.isEquipChangeOk = function (slotId) {
        let ret = _Game_Actor_isEquipChangeOk.call(this, slotId);

        if (Params.SlotSetW[0] && this == $gameParty.leader() && slotId == 0 && ret) {
            ret = false;
        }

        if (Params.SlotSetA[0] && this == $gameParty.leader() && slotId > 0 && ret) {
            ret = false;
        }

        return ret;
    };

    const _Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
    Game_Actor.prototype.changeEquip = function (slotId, item) {
        let index, type;

        if (this == $gameParty.leader() && ((Params.SlotSetW[0] && DataManager.isWeapon(item)) || (Params.SlotSetA[0] && DataManager.isArmor(item)))) {
            type = DataManager.isWeapon(item) ? WEAPON : ARMOR;
            index = $gameParty.getItemSlotNumber(type, item.id);
            if (index == -1) {
                index = $gameParty.getItemSlotFreeNumber() - 1;
                if (index >= 0) {
                    $gameParty.setItemSlotForceIndex(index);
                    _Game_Actor_changeEquip.apply(this, arguments);
                }
            } else {
                $gameParty.setItemSlotForceIndex(index);
                _Game_Actor_changeEquip.apply(this, arguments);
            }
        } else {
            _Game_Actor_changeEquip.apply(this, arguments);
        }
    };


    //=========================================================================
    // Window_ItemSlotBase
    //  ・アイテムスロットウィンドウを定義します。
    //
    //=========================================================================
    function Window_ItemSlotBase() {
        this.initialize.apply(this, arguments);
    }

    Window_ItemSlotBase.prototype = Object.create(Window_Selectable.prototype);
    Window_ItemSlotBase.prototype.constructor = Window_ItemSlotBase;


    Window_ItemSlotBase.prototype.initialize = function (x, y, kind) {
        x = this.stringToPoint(x, "x");
        y = this.stringToPoint(y, "y");

        Window_Selectable.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
        this._type = [];
        this._num = [];
        this._kind = kind;
        this._lastIndex = $gameParty.getItemSlotLastIndex();

        // GALV_GursorImage.jsへの対応
        if (Imported.Galv_CursorImage) {
            this.removeChild(this._galvCursor);
        }

        this.refresh();
        this.show();
    };

    // Window_ItemSlotBase.prototype.standardPadding = function() {
    //     return 12;
    // };

    // Window_ItemSlotBase.prototype.spacing = function() {
    //     return 0;
    // };

    Window_ItemSlotBase.prototype.maxCols = function () {
        return Params.SlotNumber[0];
    };

    Window_ItemSlotBase.prototype.maxItems = function () {
        return Params.SlotNumber[0];
    };

    Window_ItemSlotBase.prototype.windowWidth = function () {
        // return this.maxCols() * (this.lineHeight() + this.standardPadding() * 2);
        return this.maxCols() * this.lineHeight() + this.standardPadding() * 2;
    };

    Window_ItemSlotBase.prototype.windowHeight = function () {
        return this.fittingHeight(1);
    };

    Window_ItemSlotBase.prototype.itemHeight = function () {
        let val = this.contentsHeight();
        val = val > this.contentsWidth() ? this.contentsWidth() : val;
        return val;
    };

    Window_ItemSlotBase.prototype.lastIndex = function () {
        return this._lastIndex;
    };

    Window_ItemSlotBase.prototype.item = function (index) {
        let itemSlot;

        if (index == undefined || index == null || index < 0) {
            index = this.index();
        }

        itemSlot = $gameParty.getItemSlot(index);

        if (itemSlot) {
            if (itemSlot.type == ITEM) {
                return $dataItems[itemSlot.id];
            } else if (itemSlot.type == WEAPON) {
                return $dataWeapons[itemSlot.id];
            } else if (itemSlot.type == ARMOR) {
                return $dataArmors[itemSlot.id];
            }
        }

        return null;
    };

    Window_ItemSlotBase.prototype.update = function () {
        Window_Selectable.prototype.update.call(this);
    };

    Window_ItemSlotBase.prototype.drawItem = function (index) {
        Window_Selectable.prototype.drawItem.call(this, index);

        let item, rect, num, type, id, itemSlot, equipFlg, actor, fontSize, x, y,
            sizeRate;
        itemSlot = $gameParty.getItemSlot(index);
        actor = $gameParty.leader();
        sizeRate = this._kind ? Params.MapSlotWindow.SizeRate[0] : Params.MenuSlotWindow.SizeRate[0];

        if (itemSlot) {
            type = itemSlot.type;
            id = itemSlot.id;
            item = this.item(index);
            if (item) {
                rect = this.itemRect(index);
                num = $gameParty.numItems(item);

                if ((type == WEAPON || type == ARMOR) && actor.isEquipped(item)) {
                    this.changePaintOpacity(true);
                } else {
                    this.changePaintOpacity(num > 0);
                }

                x = rect.x + rect.width / 2 - Window_Base._iconWidth * sizeRate / 2;
                y = rect.y + rect.height / 2 - Window_Base._iconHeight * sizeRate / 2;
                this.drawIconEx(item.iconIndex, x, y, sizeRate);

                if (type == ITEM && Params.ItemCountVisible[0]) {
                    fontSize = this.contents.fontSize;
                    this.contents.fontSize = 20;
                    this.contents.drawText("" + num, rect.x, rect.height - 20, rect.width - 2, 24, 'right');
                    this.contents.fontSize = fontSize;
                    this._type[index] = ITEM;
                } else if (type == WEAPON) {
                    this._type[index] = WEAPON;
                } else if (type == ARMOR) {
                    this._type[index] = ARMOR;
                }
                this._num[index] = num;
            } else {
                this._type[index] = "";
                this._num[index] = 0;
            }
        }
    };

    Window_ItemSlotBase.prototype.drawIconEx = function (iconIndex, x, y, sizeRate) {
        let bitmap, pw, ph, sx, sy, dw, dh;
        if (sizeRate == "" || sizeRate <= 1) {
            sizeRate = 1.0;
        }
        bitmap = ImageManager.loadSystem('IconSet');
        pw = Window_Base._iconWidth;
        ph = Window_Base._iconHeight;
        sx = iconIndex % 16 * pw;
        sy = Math.floor(iconIndex / 16) * ph;
        dw = pw * sizeRate;
        dh = ph * sizeRate;

        this.contents.blt(bitmap, sx, sy, pw, ph, x, y, dw, dh);
    };

    Window_ItemSlotBase.prototype.stringToPoint = function (text, type) {
        let val = 0;

        if (isFinite(text)) {
            val = parseInt(text, 10);
        } else {
            switch (text.toLowerCase()) {
                case "right":
                    if (type == "x") {
                        val = Graphics.boxWidth - this.windowWidth();
                    }
                    break;
                case "left":
                    if (type == "x") {
                        val = 0;
                    }
                    break;
                case "top":
                    if (type == "y") {
                        val = 0;
                    }
                    break;
                case "bottom":
                    if (type == "y") {
                        val = Graphics.boxHeight - this.windowHeight();
                    }
                    break;
                case "center":
                    if (type == "x") {
                        val = Graphics.boxWidth / 2 - this.windowWidth() / 2;
                    } else if (type == "y") {
                        val = Graphics.boxHeight / 2 - this.windowHeight() / 2;
                    }
                    break;
            }
        }

        return val;
    }

    Window_ItemSlotBase.prototype.select = function (index) {
        if (index < Params.SlotNumber[0]) {
            Window_Selectable.prototype.select.call(this, index);
        }
    };

    Window_ItemSlotBase.prototype.selectLast = function () {
        if (this._lastIndex <= -1) {
            this.select(0);
        } else {
            this.select(this._lastIndex);
        }
    };


    //=========================================================================
    // Window_MapItemSlot
    //  ・マップ画面のアイテムスロットウィンドウを定義します。
    //
    //=========================================================================
    function Window_MapItemSlot() {
        this.initialize.apply(this, arguments);
    }

    Window_MapItemSlot.prototype = Object.create(Window_ItemSlotBase.prototype);
    Window_MapItemSlot.prototype.constructor = Window_MapItemSlot;

    Window_MapItemSlot.prototype.initialize = function (x, y, kind) {
        Window_ItemSlotBase.prototype.initialize.call(this, x, y, kind);

        this._opacityOffset = 0;
        this._showing = false;
        this._hiding = false;
        this.selectLast();
    };

    Window_MapItemSlot.prototype.standardPadding = function () {
        return Params.MapSlotWindow.Padding[0];
    };

    Window_MapItemSlot.prototype.spacing = function () {
        return Params.MapSlotWindow.Spacing[0];
    };

    Window_MapItemSlot.prototype.windowWidth = function () {
        let val, windowWidth, sizeRate, spacing;
        windowWidth = Window_ItemSlotBase.prototype.windowWidth.call(this);
        sizeRate = Params.MapSlotWindow.SizeRate[0];
        spacing = this.spacing() * (this.maxCols() - 1);
        val = windowWidth * sizeRate + spacing;
        // val = Graphics.boxWidth < val ? Graphics.boxWidth : val;

        return val;
    };

    Window_MapItemSlot.prototype.windowHeight = function () {
        let val;
        val = Window_ItemSlotBase.prototype.windowHeight.call(this) * Params.MapSlotWindow.SizeRate[0];
        // val = Graphics.boxHeight < val ? Graphics.boxHeight : val;

        return val;
    };

    Window_MapItemSlot.prototype.update = function () {
        Window_ItemSlotBase.prototype.update.call(this);

        let index;
        index = Graphics.frameCount % Params.SlotNumber[0];

        // 再描画判定
        if (this.checkRedraw(index)) {
            this.redrawItem(index);
        }

        this._lastIndex = this.index();

        if (this._showing) {
            this.updateFadeIn();
        } else if (this._hiding) {
            this.updateFadeOut();
        }
    };

    Window_MapItemSlot.prototype.updateFadeIn = function () {
        this.opacity += this._opacityOffset;
        this.contentsOpacity += this._opacityOffset;

        if (this.opacity >= Params.MapSlotOpacity[0] || this.contentsOpacity >= Params.MapSlotOpacity[0]) {
            this.opacity = Params.MapSlotOpacity[0];
            this.contentsOpacity = Params.MapSlotOpacity[0];
            this._showing = false;
        }
    };

    Window_MapItemSlot.prototype.updateFadeOut = function () {
        this.opacity -= this._opacityOffset;
        this.contentsOpacity -= this._opacityOffset;

        if (this.opacity <= 0 || this.contentsOpacity <= 0) {
            this.opacity = 0;
            this.contentsOpacity = 0;
            this._hiding = false;
        }
    };

    Window_MapItemSlot.prototype.checkRedraw = function (index) {
        let itemSlot, item, equipFlg, actor;
        itemSlot = $gameParty.getItemSlot(index);
        actor = $gameParty.leader();

        if (itemSlot) {
            item = this.item(index);
            if (item) {
                if (this._type[index] != itemSlot.type || this._num[index] != $gameParty.numItems(item)) {
                    return true;
                }
                // if(itemSlot.type == WEAPON || itemSlot.type = ARMOR) {
                //     if(itemSlot.equip != actor.isEquipped(item)) {
                //         console.log("itemSlot equip:"+itemSlot.equip);
                //         console.log("actor equip:"+actor.isEquipped(item));
                //         return true;
                //     }
                // }
            }
        }

        return false;
    };

    Window_MapItemSlot.prototype.drawItem = function (index) {
        Window_ItemSlotBase.prototype.drawItem.call(this, index);

        let item, rect, num, type, id, itemSlot, equipFlg, actor, fontSize;
        itemSlot = $gameParty.getItemSlot(index);
        actor = $gameParty.leader();

        // 装備状態を表示&変更
        if (itemSlot) {
            type = itemSlot.type;
            id = itemSlot.id;
            item = this.item(index);
            if (item) {
                rect = this.itemRect(index);
                if (type == WEAPON || type == ARMOR) {
                    equipFlg = actor.isEquipped(item);
                    if (equipFlg) {
                        fontSize = this.contents.fontSize;
                        this.contents.fontSize = 20;
                        this.contents.drawText("E", rect.x, rect.y, rect.width - 2, 24, 'right');
                        this.contents.fontSize = fontSize;
                    }
                    if (itemSlot.equip != equipFlg) {
                        $gameParty.setEquipStatus(index, equipFlg);
                    }
                }
            }
        }
    };

    Window_MapItemSlot.prototype.isCursorVisible = function () {
        if (Params.SlotCursorVisible[0]) {
            return Window_Selectable.prototype.isCursorVisible.call(this);
        } else {
            return false;
        }
    };

    Window_MapItemSlot.prototype.fadeIn = function () {
        this._opacityOffset = Params.SlotOpacityOffset[0];
        this._showing = true;
        this._hiding = false;
    };

    Window_MapItemSlot.prototype.fadeOut = function () {
        this._opacityOffset = Params.SlotOpacityOffset[0];
        this._hiding = true;
        this._showing = false;
    };

    Window_MapItemSlot.prototype.isShowing = function () {
        return this._showing;
    };

    Window_MapItemSlot.prototype.isHiding = function () {
        return this._hiding;
    };

    Window_ItemSlotBase.prototype.isHide = function () {
        return this.opacity <= 0;
    };

    Window_ItemSlotBase.prototype.isShow = function () {
        return this.opacity > 0;
    };


    //=========================================================================
    // Window_ItemSlotHelp
    //  ・アイテムスロット画面のヘルプウィンドウを再定義します。
    //
    //=========================================================================
    function Window_ItemSlotHelp() {
        this.initialize.apply(this, arguments);
    }

    Window_ItemSlotHelp.prototype = Object.create(Window_Help.prototype);
    Window_ItemSlotHelp.prototype.constructor = Window_ItemSlotHelp;

    Window_ItemSlotHelp.prototype.initialize = function (numLines) {
        Window_Help.prototype.initialize.call(this, numLines);
        // this.height += this.fittingHeight(0);
    };

    Window_ItemSlotHelp.prototype.setItem = function (item) {
        this.setText(item ? item.name + "\n" + item.description : '');
    };


    //=========================================================================
    // Window_SlotCommand
    //  ・アイテムスロット画面のスロットコマンドウィンドウを定義します。
    //
    //=========================================================================
    function Window_SlotCommand() {
        this.initialize.apply(this, arguments);
    }

    Window_SlotCommand.prototype = Object.create(Window_Command.prototype);
    Window_SlotCommand.prototype.constructor = Window_SlotCommand;

    Window_SlotCommand.prototype.initialize = function (x, y) {
        Window_Command.prototype.initialize.call(this, x, y);
        this.selectLast();
    };

    Window_SlotCommand._lastCommandSymbol = null;

    Window_SlotCommand.initCommandPosition = function () {
        this._lastCommandSymbol = null;
    };

    Window_SlotCommand.prototype.windowWidth = function () {
        return 240;
    };

    Window_SlotCommand.prototype.numVisibleRows = function () {
        return this.maxItems();
    };

    Window_SlotCommand.prototype.makeCommandList = function () {
        this.addCommand(Params.SlotSetName[0], "slotset");
        // this.addCommand(Params.SlotChangeName[0], "slotchange");
        this.addCommand(Params.SlotRemoveName[0], "slotremove");
    };

    Window_SlotCommand.prototype.processOk = function () {
        Window_SlotCommand._lastCommandSymbol = this.currentSymbol();
        Window_Command.prototype.processOk.call(this);
    };

    Window_SlotCommand.prototype.updateHelp = function () {
        switch (this.currentSymbol()) {
            case "slotset":
                this._helpWindow.setText(Params.SlotSetDesc[0]);
                break;
            case "slotchange":
                this._helpWindow.setText(Params.SlotChangeDesc[0]);
                break;
            case "slotremove":
                this._helpWindow.setText(Params.SlotRemoveDesc[0]);
                break;
        }
    };

    Window_SlotCommand.prototype.selectLast = function () {
        this.selectSymbol(Window_SlotCommand._lastCommandSymbol);
    };


    //=========================================================================
    // Window_ItemSlot
    //  ・アイテムスロット画面のアイテムスロットウィンドウを定義します。
    //
    //=========================================================================
    function Window_ItemSlot() {
        this.initialize.apply(this, arguments);
    }

    Window_ItemSlot.prototype = Object.create(Window_ItemSlotBase.prototype);
    Window_ItemSlot.prototype.constructor = Window_ItemSlot;

    Window_ItemSlot.prototype.initialize = function (x, y, w, h, kind) {
        let x2, y2;
        x2 = x + w / 2 - this.windowWidth() / 2;
        y2 = y;

        Window_ItemSlotBase.prototype.initialize.call(this, x2, y2, kind);
        this._slotType = null;
        this._swapTemp = -1;
        this.resetLastIndex();
    };

    Window_ItemSlot.prototype.standardPadding = function () {
        return Params.MenuSlotWindow.Padding[0];
    };

    Window_ItemSlot.prototype.spacing = function () {
        return Params.MenuSlotWindow.Spacing[0];
    };

    Window_ItemSlot.prototype.windowWidth = function () {
        let val, windowWidth, sizeRate, spacing;
        windowWidth = Window_ItemSlotBase.prototype.windowWidth.call(this);
        sizeRate = Params.MenuSlotWindow.SizeRate[0];
        spacing = this.spacing() * (this.maxCols() - 1);
        val = windowWidth * sizeRate + spacing;
        // val = Graphics.boxWidth < val ? Graphics.boxWidth : val;

        return val;
    };

    Window_ItemSlot.prototype.windowHeight = function () {
        let val;
        val = Window_ItemSlotBase.prototype.windowHeight.call(this) * Params.MenuSlotWindow.SizeRate[0];
        // val = Graphics.boxHeight < val ? Graphics.boxHeight : val;

        return val;
    };

    Window_ItemSlot.prototype.update = function () {
        Window_ItemSlotBase.prototype.update.call(this);

        let index;
        index = Graphics.frameCount % Params.SlotNumber[0];

        // 再描画判定
        if (this.checkRedraw(index)) {
            this.redrawItem(index);
        }

        // this._lastIndex = this.index();
    };

    Window_ItemSlot.prototype.checkRedraw = function (index) {
        let itemSlot, item, equipFlg, actor;
        itemSlot = $gameParty.getItemSlot(index);
        actor = $gameParty.leader();

        if (itemSlot) {
            item = this.item(index);
            if (item) {
                if (this._type[index] != itemSlot.type || this._num[index] != $gameParty.numItems(item)) {
                    return true;
                }
                // if(itemSlot.type == WEAPON || itemSlot.type == ARMOR) {
                //     if(itemSlot.equip != actor.isEquipped(item)) {
                //         console.log("itemSlot equip:"+itemSlot.equip);
                //         console.log("actor equip:"+actor.isEquipped(item));
                //         return true;
                //     }
                // }
            }
        }

        return false;
    };

    Window_ItemSlot.prototype.drawItem = function (index) {
        Window_ItemSlotBase.prototype.drawItem.call(this, index);

        let item, rect, num, type, id, itemSlot, equipFlg, actor, fontSize;
        itemSlot = $gameParty.getItemSlot(index);
        actor = $gameParty.leader();

        // 装備状態を表示
        if (itemSlot) {
            type = itemSlot.type;
            id = itemSlot.id;
            item = this.item(index);
            if (item) {
                rect = this.itemRect(index);
                if (type == WEAPON || type == ARMOR) {
                    equipFlg = actor.isEquipped(item);
                    if (equipFlg) {
                        fontSize = this.contents.fontSize;
                        this.contents.fontSize = 20;
                        this.contents.drawText("E", rect.x, rect.y, rect.width - 2, 24, 'right');
                        this.contents.fontSize = fontSize;
                    }
                }
            }
        }
    };

    Window_ItemSlot.prototype.isCurrentItemEnabled = function () {
        let ret, item, actor;
        item = this.item();
        actor = $gameParty.leader();
        ret = true;

        if (item) {
            // if(DataManager.isWeapon(item) || DataManager.isArmor(item)) {
            //     ret = !actor.isEquipped(item);
            // }
        } else {
            if (!this._slotType || this._slotType == "slotremove") {
                ret = false;
            }
        }

        return ret;
    };

    Window_ItemSlot.prototype.updateHelp = function () {
        this.setHelpWindowItem(this.item());
    };

    Window_ItemSlot.prototype.processOk = function () {
        if (this.isCurrentItemEnabled() && !this.hasLastIndex()) {
            this._lastIndex = this.index();
        }

        Window_ItemSlotBase.prototype.processOk.call(this);
    };

    Window_ItemSlot.prototype.setSlotType = function (type) {
        this._slotType = type;
    };

    Window_ItemSlot.prototype.hasLastIndex = function () {
        return this._lastIndex != -1;
    };

    Window_ItemSlot.prototype.resetLastIndex = function () {
        this._lastIndex = -1;
    };


    //=========================================================================
    // Window_ItemSlotCategory
    //  ・アイテムスロット画面のカテゴリウィンドウを定義します。
    //
    //=========================================================================
    function Window_ItemSlotCategory() {
        this.initialize.apply(this, arguments);
    }

    Window_ItemSlotCategory.prototype = Object.create(Window_ItemCategory.prototype);
    Window_ItemSlotCategory.prototype.constructor = Window_ItemSlotCategory;

    Window_ItemSlotCategory.prototype.initialize = function (width) {
        this._windowWidth = width;
        Window_ItemCategory.prototype.initialize.call(this);
        this.deselect();
        this.deactivate();
    };

    Window_ItemSlotCategory.prototype.windowWidth = function () {
        return this._windowWidth;
    };

    Window_ItemSlotCategory.prototype.maxCols = function () {
        if (Params.SlotSetW[0] && Params.SlotSetA[0]) {
            return 3;
        } else if (Params.SlotSetW[0] || Params.SlotSetA[0]) {
            return 2;
        }

        return 1;
    };

    Window_ItemSlotCategory.prototype.makeCommandList = function () {
        this.addCommand(TextManager.item, 'item');
        if (Params.SlotSetW[0]) {
            this.addCommand(TextManager.weapon, 'weapon');
        }
        if (Params.SlotSetA[0]) {
            this.addCommand(TextManager.armor, 'armor');
        }
    };


    //=========================================================================
    // Window_ItemSlotList
    //  ・アイテムスロット画面のアイテムリストウィンドウを定義します。
    //
    //=========================================================================
    function Window_ItemSlotList() {
        this.initialize.apply(this, arguments);
    }

    Window_ItemSlotList.prototype = Object.create(Window_ItemList.prototype);
    Window_ItemSlotList.prototype.constructor = Window_ItemSlotList;

    Window_ItemSlotList.prototype.initialize = function (x, y, width, height) {
        Window_ItemList.prototype.initialize.call(this, x, y, width, height);
    };

    Window_ItemSlotList.prototype.includes = function (item) {
        let ret, meta;
        ret = true;

        meta = "";
        if (item && item.meta) {
            meta = GetMeta(item.meta, "itemslot");
        }

        if (meta.toLowerCase() == "noadd") {
            return false;
        }

        if (Params.CateSortType[0] > 0) {
            return true;
        }

        switch (this._category) {
            case 'item':
                ret = DataManager.isItem(item) && item.itypeId === 1;
                break;
            case 'weapon':
                ret = DataManager.isWeapon(item);
                break;
            case 'armor':
                ret = DataManager.isArmor(item);
                break;
            default:
                ret = false;
                break;
        }

        return ret;
    };

    Window_ItemSlotList.prototype.isEnabled = function (item) {
        let ret, type, actor;
        actor = $gameParty.leader();
        ret = false;

        if (item && $gameParty.hasItemType(item)) {
            type = DataManager.getItemType(item);
            // ret = $gameParty.getItemSlotNumber(type, item.id) == -1 ? true : false;
            ret = $gameParty.getItemSlotNumber(type, item.id) == -1;

            if (type == WEAPON && !actor.isEquipWtypeOk(item.wtypeId)) {
                ret = false;
            }
            if (type == ARMOR && !actor.isEquipAtypeOk(item.atypeId)) {
                ret = false;
            }
        }

        return ret;
        // return $gameParty.canUse(item);
    };

    Window_ItemSlotList.prototype.isCurrentItemEnabled = function () {
        return this.isEnabled(this.item());
        // let ret, item, type;
        // item = this.item();
        // ret = false;

        // if(item && $gameParty.hasItemType(item)) {
        //     type = DataManager.getItemType(item);
        //     ret = $gameParty.getItemSlotNumber(type, item.id) == -1 ? true : false;
        // }

        // return ret;
    };

    Window_ItemSlotList.prototype.makeItemList = function () {
        let itemData, weaponData, armorData;
        if ((!Params.SlotSetW[0] && !Params.SlotSetA[0]) || Params.CateSortType[0] == 0) {
            Window_ItemList.prototype.makeItemList.call(this);
            return;
        }

        itemData = $gameParty.items().filter(function (item) {
            return this.includes(item);
        }, this);

        weaponData = $gameParty.weapons().filter(function (item) {
            return this.includes(item);
        }, this);

        armorData = $gameParty.armors().filter(function (item) {
            return this.includes(item);
        }, this);

        switch (Params.CateSortType[0]) {
            case CATEGORYSORT.I_W_A:
                this._data = itemData.concat(weaponData.concat(armorData));
                break;
            case CATEGORYSORT.I_A_W:
                this._data = itemData.concat(armorData.concat(weaponData));
                break;
            case CATEGORYSORT.W_I_A:
                this._data = weaponData.concat(itemData.concat(armorData));
                break;
            case CATEGORYSORT.W_A_I:
                this._data = weaponData.concat(armorData.concat(itemData));
                break;
            case CATEGORYSORT.A_I_W:
                this._data = armorData.concat(itemData.concat(weaponData));
                break;
            case CATEGORYSORT.A_W_I:
                this._data = armorData.concat(weaponData.concat(itemData));
                break;
        }

        if (this.includes(null)) {
            this._data.push(null);
        }
    };


    //=========================================================================
    // Window_MenuCommand
    //  ・メニュー画面にアイテムスロットコマンドを定義します。
    //
    //=========================================================================
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function () {
        _Window_MenuCommand_addOriginalCommands.call(this);

        let status;
        status = $gameParty.getMenuSlotStatus();

        if (status == 1) {
            this.addCommand(Params.MenuSlotName[0], 'itemslot', true);
        } else if (status == 2) {
            this.addCommand(Params.MenuSlotName[0], 'itemslot', false);
        }
    };


    //=========================================================================
    // Scene_Map
    //  ・マップ画面にアイテムスロットを定義します。
    //
    //=========================================================================
    const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function () {
        _Scene_Map_createDisplayObjects.call(this);
        this.createMapItemSlotWindow();
    };

    Scene_Map.prototype.createMapItemSlotWindow = function () {
        let kind;
        kind = 1; // マップ用は1

        this._mapItemSlotWindow = new Window_MapItemSlot(Params.SlotX[0], Params.SlotY[0], kind);
        this._mapItemSlotWindow.setHandler("ok", this.onItemSlotOk.bind(this));
        this._mapItemSlotWindow.opacity = Params.MapSlotOpacity[0];
        this._mapItemSlotWindow.contentsOpacity = Params.MapSlotOpacity[0];
        if (Params.SlotBackground[0] != "") {
            this._mapItemSlotWindow._windowSpriteContainer.removeChild(this._mapItemSlotWindow._windowBackSprite);
            this._mapItemSlotWindow._windowSpriteContainer.removeChild(this._mapItemSlotWindow._windowFrameSprite);
            this._mapItemSlotWindow._windowBackSprite = new Sprite();
            this._mapItemSlotWindow._windowBackSprite.bitmap = ImageManager.loadPicture(Params.SlotBackground[0]);
            this._mapItemSlotWindow._windowSpriteContainer.addChild(this._mapItemSlotWindow._windowBackSprite);
        }
        this.addChild(this._mapItemSlotWindow);
        if (this._mapItemSlotWindow.lastIndex() <= -1 && !Params.SlotVisible[0]) {
            $gameParty.setItemSlotVisible(false);
            this._mapItemSlotWindow.opacity = 0;
            this._mapItemSlotWindow.contentsOpacity = 0;
        }
        this._mapItemSlotWindow.selectLast();
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);

        this.updateItemSlot();
    };

    Scene_Map.prototype.updateItemSlot = function () {
        let index, itemSlot, actor, lastIndex, item, action, win;
        actor = $gameParty.leader();
        win = this._mapItemSlotWindow;
        index = win.index();
        lastIndex = win.lastIndex();

        // 表示判定
        // console.log("eventRun:"+$gameMap.isEventRunning());
        if (isEnableEventToSlot() && !$gameParty.isItemSlotHide()) {
            if ((win.isHide() || win.isHiding()) && !win.isShowing()) {
                win.fadeIn();
            }
        } else {
            if (win.isShow() && !win.isHiding() && !SceneManager._scene.isBusy()) {
                win.fadeOut();
            }
        }

        if ($gameParty.isItemSlotHide() || win.isHide()) {
            return;
        }

        if (index < 0) {
            win.selectLast();
        }

        // アイテムスロット選択
        updateSlotSelect(win, index, true);
        index = win.index();

        // アイテム使用
        if (isEnableEventToUse() &&
            (isEnableMouseToUse() || isEnableKeyboardToUse())) {
            win.callHandler("ok");
        }

        if (!actor) {
            return;
        }

        // 装備アイテム
        itemSlot = $gameParty.getItemSlot(lastIndex);
        if (itemSlot && ((Params.SlotSetW[0] && itemSlot.type == WEAPON) || (Params.SlotSetA[0] && itemSlot.type == ARMOR))) {
            // lastIndex の装備を先に外すこと
            if (lastIndex != index) {
                item = win.item(lastIndex);
                if (actor.isEquipped(item)) {
                    actor.changeEquipById(item.etypeId, 0);
                    win.redrawItem(lastIndex);
                }
            }
        }
        itemSlot = $gameParty.getItemSlot(index);
        if (itemSlot && ((Params.SlotSetW[0] && itemSlot.type == WEAPON) || (Params.SlotSetA[0] && itemSlot.type == ARMOR))) {
            item = win.item();
            if (!actor.isEquipped(item)) {
                actor.changeEquipById(item.etypeId, item.id);
                $gameParty.setSlotEquipItem(item);
                win.redrawCurrentItem();
            }
        }
        if ((itemSlot == null || itemSlot.type == ITEM) && ((Params.SlotSetW[0] && actor.weapons().length > 0) || (Params.SlotSetA[0] && actor.armors().length > 0))) {
            // 装備アイテム以外のスロット選択時に装備を確実に外す
            item = win.item(lastIndex);
            actor.changeEquipById(item.etypeId, 0);
        }

        // アイテムスロットのアイテム削除判定
        if (Params.ItemRemoveMode[0]) {
            itemSlot = $gameParty.getItemSlot(index);
            item = win.item();
            if (itemSlot) {
                if ((itemSlot.type == ITEM && $gameParty.numItems(item) <= 0) || ((itemSlot.type == WEAPON || itemSlot.type == ARMOR) && !actor.isEquipped(item))) {
                    $gameParty.removeItemSlot(index);
                    win.redrawCurrentItem();
                }
            }
        }

        // console.log("visible2:"+win.visible);
        $gameParty.setItemSlotLastIndex(index);
    };

    Scene_Map.prototype.onItemSlotOk = function () {
        let item;
        item = this._mapItemSlotWindow.item();

        if ($gameParty.useItemSlot(item)) {
            this._mapItemSlotWindow.redrawCurrentItem();
        }
    };

    const _Scene_Map_isMapTouchOk = Scene_Map.prototype.isMapTouchOk;
    Scene_Map.prototype.isMapTouchOk = function () {
        if (isEnableMouseToUse()) {
            return false;
        }
        return _Scene_Map_isMapTouchOk.call(this);
    };

    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function () {
        if (!SceneManager.isNextScene(Scene_Battle)) {
            this._mapItemSlotWindow.hide();
            // $gameParty.setItemSlotVisible(false);
        }
        _Scene_Map_terminate.call(this);
    };


    //=========================================================================
    // Scene_ItemSlot
    //  ・メニューから遷移するアイテムスロット画面を定義します。
    //
    //=========================================================================
    function Scene_ItemSlot() {
        this.initialize.apply(this, arguments);
    }

    Scene_ItemSlot.prototype = Object.create(Scene_ItemBase.prototype);
    Scene_ItemSlot.prototype.constructor = Scene_ItemSlot;

    Scene_ItemSlot.prototype.initialize = function () {
        Scene_ItemBase.prototype.initialize.call(this);
    };

    Scene_ItemSlot.prototype.create = function () {
        Scene_ItemBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createCommandWindow();
        this.createItemSlotWindow();
        this.createCategoryWindow();
        this.createItemWindow();
    };

    Scene_ItemSlot.prototype.createBackground = function () {
        let background;
        background = Params.MenuBackground[0];

        if (background) {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = ImageManager.loadPicture(background);
            this.addChild(this._backgroundSprite);
            return;
        } else {
            Scene_ItemBase.prototype.createBackground.call(this);
        }
    };

    Scene_ItemSlot.prototype.createHelpWindow = function () {
        this._helpWindow = new Window_ItemSlotHelp();
        this._helpWindow.opacity = Params.MenuSlotOpacity[0];
        this.addWindow(this._helpWindow);
    };

    Scene_ItemSlot.prototype.createCommandWindow = function () {
        this._commandWindow = new Window_SlotCommand(0, this._helpWindow.height);
        this._commandWindow.setHandler("slotset", this.commandItemSlot.bind(this));
        // this._commandWindow.setHandler("slotchange", this.commandItemSlot.bind(this));
        this._commandWindow.setHandler("slotremove", this.commandItemSlot.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this._commandWindow.opacity = Params.MenuSlotOpacity[0];
        this._commandWindow.setHelpWindow(this._helpWindow);
        this.addWindow(this._commandWindow);
    };

    Scene_ItemSlot.prototype.createItemSlotWindow = function () {
        let x, y, w, h, kind;
        x = this._commandWindow.width;
        y = this._commandWindow.y;
        w = Graphics.boxWidth - x;
        h = this._commandWindow.height;
        kind = 0; // スロットシーン用は0

        this._itemSlotWindow = new Window_ItemSlot(x, y, w, y, kind);
        this._itemSlotWindow.setHelpWindow(this._helpWindow);
        this._itemSlotWindow.setHandler('ok', this.onItemSlotOk.bind(this));
        this._itemSlotWindow.setHandler('cancel', this.onItemSlotCancel.bind(this));
        this._itemSlotWindow.opacity = Params.MenuSlotOpacity[0];
        if (Params.MapBackgroundEnable[0] && Params.SlotBackground[0] != "") {
            this._itemSlotWindow._windowSpriteContainer.removeChild(this._itemSlotWindow._windowBackSprite);
            this._itemSlotWindow._windowSpriteContainer.removeChild(this._itemSlotWindow._windowFrameSprite);
            this._itemSlotWindow._windowBackSprite = new Sprite();
            this._itemSlotWindow._windowBackSprite.bitmap = ImageManager.loadPicture(Params.SlotBackground[0]);
            this._itemSlotWindow._windowSpriteContainer.addChild(this._itemSlotWindow._windowBackSprite);
        }
        this.addWindow(this._itemSlotWindow);
    };

    Scene_ItemSlot.prototype.createCategoryWindow = function () {
        let width;
        width = Graphics.boxWidth - this._commandWindow.width;

        this._categoryWindow = new Window_ItemSlotCategory(width);
        this._categoryWindow.x = this._commandWindow.width;
        // this._categoryWindow.y = this._commandWindow.y + this._commandWindow.height - this._categoryWindow.height;
        this._categoryWindow.y = this._itemSlotWindow.y + this._itemSlotWindow.height;
        this._categoryWindow.hide();
        this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
        this._categoryWindow.opacity = Params.MenuSlotOpacity[0];
        this.addWindow(this._categoryWindow);
    };

    Scene_ItemSlot.prototype.createItemWindow = function () {
        let wy, wh;
        wy = this._categoryWindow.y + this._categoryWindow.height;
        wh = Graphics.boxHeight - wy;

        this._itemWindow = new Window_ItemSlotList(0, wy, Graphics.boxWidth, wh);
        this._itemWindow.hide();
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this._itemWindow.opacity = Params.MenuSlotOpacity[0];
        this.addWindow(this._itemWindow);
        this._categoryWindow.setItemWindow(this._itemWindow);
    };

    Scene_ItemSlot.prototype.commandItemSlot = function () {
        let symbol;
        symbol = this._commandWindow.currentSymbol();

        this._itemSlotWindow.setSlotType(symbol);
        this._itemSlotWindow.activate();
        this._itemSlotWindow.selectLast();
    };

    Scene_ItemSlot.prototype.onItemSlotOk = function () {
        let index, lastIndex;
        lastIndex = this._itemSlotWindow.lastIndex();
        index = this._itemSlotWindow.index();

        switch (this._commandWindow.currentSymbol()) {
            case "slotset":
                if (Params.SlotSetW[0] || Params.SlotSetA[0]) {
                    if (Params.CateSortType[0] > 0) {
                        this._categoryWindow.select(0);
                        this._itemWindow.activate();
                        this._itemWindow.selectLast();
                        this._itemWindow.show();
                        this._itemWindow.refresh();
                        this._itemSlotWindow.deactivate();
                        break;
                    }
                    this._categoryWindow.show();
                    this._categoryWindow.activate();
                    this._categoryWindow.select(0);
                    this._itemWindow.deselect();
                } else {
                    this._categoryWindow.select(0);
                    this._itemWindow.activate();
                    this._itemWindow.selectLast();
                }
                this._itemWindow.show();
                this._itemWindow.refresh();
                this._itemSlotWindow.deactivate();
                break;
            case "slotchange":
                if (this._itemSlotWindow.hasLastIndex() && index != lastIndex) {
                    $gameParty.swapItemSlot(lastIndex, index);
                    this._itemSlotWindow.resetLastIndex();
                    this._itemSlotWindow.refresh();
                }
                this._itemSlotWindow.activate();
                break;
            case "slotremove":
                $gameParty.removeItemSlot(this._itemSlotWindow.index());
                this._itemSlotWindow.refresh();
                this._itemSlotWindow.activate();
                break;
        }
    };

    Scene_ItemSlot.prototype.onItemSlotCancel = function () {
        this._itemSlotWindow.resetLastIndex();
        this._itemSlotWindow.deselect();
        this._commandWindow.activate();
        this._commandWindow.callUpdateHelp();
        this._itemSlotWindow.setSlotType(null);
    };

    Scene_ItemSlot.prototype.onCategoryOk = function () {
        this._itemWindow.activate();
        this._itemWindow.selectLast();
    };

    Scene_ItemSlot.prototype.onCategoryCancel = function () {
        this._categoryWindow.deselect();
        this._categoryWindow.hide();
        this._itemWindow.hide();
        this._itemSlotWindow.activate();
        // this._itemSlotWindow.selectLast();
    };

    Scene_ItemSlot.prototype.onItemOk = function () {
        let item;
        item = this.item();

        // setslot専用
        // $gameParty.setLastItem(this.item());
        $gameParty.setSlotEquipItem(this._itemSlotWindow.item());
        $gameParty.setItemSlot(this._itemSlotWindow.index(), this.item());
        $gameParty.setSlotEquipItem(this.item());
        this._itemSlotWindow.refresh();
        this._itemWindow.activate();
        this._itemWindow.refresh();
        // this.determineItem();
    };

    Scene_ItemSlot.prototype.onItemCancel = function () {
        this._itemWindow.deselect();
        this._itemWindow.deactivate();
        if ((Params.SlotSetW[0] || Params.SlotSetA[0]) && Params.CateSortType[0] == 0) {
            this._categoryWindow.activate();
        } else {
            this._itemSlotWindow.activate();
        }
        this._helpWindow.setItem(this._itemSlotWindow.item());
    };

    Scene_ItemSlot.prototype.update = function () {
        Scene_ItemBase.prototype.update.call(this);
        this.updateItemSlot();
    };

    Scene_ItemSlot.prototype.updateItemSlot = function () {
        let pressKey, index, win, itemSlot, item, actor, lastIndex;
        win = this._itemSlotWindow;
        index = win.index();
        actor = $gameParty.leader();

        // アイテムスロット選択
        updateSlotSelect(win, index, false);
        index = win.index();

        // 装備アイテム
        lastIndex = $gameParty.getItemSlotLastIndex();
        itemSlot = $gameParty.getItemSlot(lastIndex);
        item = win.item(lastIndex);
        if (itemSlot) {
            if (itemSlot.type == WEAPON) {
                if (!actor.isEquipped(item)) {
                    actor.changeEquipById(item.etypeId, item.id);
                    win.redrawItem($gameParty.getItemSlotLastIndex());
                }
            } else if (actor.weapons().length > 0) {
                console.log("updateItemSlot WEAPON:%o", item);
                // actor.changeEquipById(1, 0);
                // win.redrawItem($gameParty.getItemSlotLastIndex());
            }
            if (itemSlot.type == ARMOR) {
                if (!actor.isEquipped(item)) {
                    actor.changeEquipById(item.etypeId, item.id);
                    win.redrawItem($gameParty.getItemSlotLastIndex());
                }
            } else if (actor.armors().length > 0) {
                console.log("updateItemSlot ARMOR:%o", item);
                // actor.changeEquipById(1, 0);
                // win.redrawItem($gameParty.getItemSlotLastIndex());
            }
        }
    };


    //=========================================================================
    // Scene_Menu
    //  ・メニュー画面にアイテムスロットコマンドを定義します。
    //
    //=========================================================================
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('itemslot', this.commandItemSlot.bind(this));
    };

    Scene_Menu.prototype.commandItemSlot = function () {
        SceneManager.push(Scene_ItemSlot);
    };


    //=========================================================================
    // DataManager
    //  ・プラグイン導入前のセーブデータをロードしたとき用の処理を定義します。
    //  ・アイテム用関数を定義します。
    //
    //=========================================================================
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        _DataManager_extractSaveContents.call(this, contents);
        // 処理を追記

        if ($gameParty.getItemSlot(-1) == undefined || $gameParty.getItemSlot(-1) == null) {
            $gameParty.initItemSlot();
        } else if ($gameParty.getItemSlot(-1).length != Params.SlotNumber[0]) {
            $gameParty.updateItemSlot();
        }
    };

    DataManager.getItemType = function (item) {
        if (this.isItem(item)) {
            return ITEM;
        } else if (this.isWeapon(item)) {
            return WEAPON;
        } else if (this.isArmor(item)) {
            return ARMOR;
        }

        return null;
    };

    DataManager.getItemByIdType = function (id, type) {
        if (!type) {
            return null;
        }
        if (!id || !isFinite(id)) {
            return null;
        }

        id = parseInt(id, 10);
        type = type.toLowerCase();

        if (id < 1) {
            return null;
        }

        if (type == ITEM && $dataItems.length > id) {
            return $dataItems[id];
        } else if (type == WEAPON && $dataWeapons.length > id) {
            return $dataWeapons[id];
        } else if (type == ARMOR && $dataArmors.length > id) {
            return $dataArmors[id];
        }

        return null;
    };


    //=========================================================================
    // Utility
    //  ・汎用的な処理を定義します。
    //
    //=========================================================================
    // キーイベントのkeyCodeからキー名を取得
    function codeToName(event) {
        let name, key;
        name = null;

        if (event.key != undefined && event.key != null) {
            name = event.key;
            // console.log("key name:"+name);
        } else if (event.keyIdentifier != undefined && event.keyIdentifier != null) {
            key = event.keyIdentifier;
            if (/^U\+/.test(key)) {
                key = parseInt(key.substr(2), 16);
                // console.log("key:"+key);
            }
            if (isFinite(key)) {
                if (key >= 112 && key <= 123) {
                    name = 'f' + (key - 111);// ファンクションキー
                } else if (key >= 96 && key <= 105) {
                    name = 'num' + (key - 96); // 0 ～ 9 (テンキー)
                } else if (key >= 65 && key <= 90) {
                    name = String.fromCharCode(key); // A ～ Z キー
                } else if (key >= 48 && key <= 57) {
                    name = (key - 48).toString(); // 0 ～ 9 キー
                } else {
                    switch (key) {
                        case 32:
                            name = "space";
                            break;
                    }
                }
            } else {
                name = key;
            }
            // console.log(event);
            // console.log("keyIdentifier name:"+name);
        }

        if (name) {
            name = name.toLowerCase();
        }

        return name;
    }

    // スロット番号の指定をindexに変換する
    function slotToIndex(slot) {
        let ret;
        ret = -1;

        if (slot == "left") {
            ret = $gameParty.getItemSlotLastIndex() - 1;
            ret = ret < 0 ? Params.SlotNumber[0] - 1 : ret;
        } else if (slot == "right") {
            ret = $gameParty.getItemSlotLastIndex() + 1;
            ret = ret >= Params.SlotNumber[0] ? 0 : ret;
        } else if (slot != null && isFinite(slot)) {
            ret = parseInt(slot, 10);
            if (ret > Params.SlotNumber[0] || ret < 1) {
                ret = -1;
            } else {
                ret--;
            }
        }

        return ret;
    }

    // スロット使用キーを取得する
    function getUseKey() {
        let keys;
        keys = Params.KeyConfig;

        // console.log(keys);
        // return keys.ItemUseKey[0].toLowerCase();
        return keys.ItemUseKey[0];
    }

    // スロットウィンドウselect
    function updateSlotSelect(win, index, useFlg) {
        let i, key, item, pushFlg, keys;
        pushFlg = false;
        keys = Params.KeyConfig;

        // アイテムスロット選択

        // 強制選択
        if ($gameParty.getItemSlotForceIndex() >= 0) {
            win.select($gameParty.getItemSlotForceIndex());
            $gameParty.setItemSlotForceIndex(-1);
            pushFlg = true;
        }

        // キーボード
        if (isEnableEventToSelect() && isEnableKeyboardToSelect()) {
            if (Input.isTriggered(keys.Slot1Key[0]) && slotToIndex(1) != -1) {
                win.select(slotToIndex(1));
                pushFlg = true;
            }
            if (Input.isTriggered(keys.Slot2Key[0]) && slotToIndex(2) != -1) {
                win.select(slotToIndex(2));
                pushFlg = true;
            }
            if (Input.isTriggered(keys.Slot3Key[0]) && slotToIndex(3) != -1) {
                win.select(slotToIndex(3));
                pushFlg = true;
            }
            if (Input.isTriggered(keys.Slot4Key[0]) && slotToIndex(4) != -1) {
                win.select(slotToIndex(4));
                pushFlg = true;
            }
            if (Input.isTriggered(keys.Slot5Key[0]) && slotToIndex(5) != -1) {
                win.select(slotToIndex(5));
                pushFlg = true;
            }
            if (Input.isTriggered(keys.Slot6Key[0]) && slotToIndex(6) != -1) {
                win.select(slotToIndex(6));
                pushFlg = true;
            }
            if (Input.isTriggered(keys.Slot7Key[0]) && slotToIndex(7) != -1) {
                win.select(slotToIndex(7));
                pushFlg = true;
            }
            if (Input.isTriggered(keys.Slot8Key[0]) && slotToIndex(8) != -1) {
                win.select(slotToIndex(8));
                pushFlg = true;
            }
            if (Input.isTriggered(keys.Slot9Key[0]) && slotToIndex(9) != -1) {
                win.select(slotToIndex(9));
                pushFlg = true;
            }
            if (Input.isTriggered(keys.Slot10Key[0]) && slotToIndex(10) != -1) {
                win.select(slotToIndex(10));
                pushFlg = true;
            }
        }

        // アイテム自動使用
        if (isEnableEventToUse() && useFlg && pushFlg && Params.ItemUseMode[0]) {
            pushFlg = false;
            item = win.item();
            $gameParty.useItemSlot(item);
        }

        // マウスホイール
        if (isEnableEventToSelect() && isEnableMouseToSelect()) {
            if (TouchInput.wheelY > 0) {
                if (index <= 0) {
                    win.select(Params.SlotNumber[0] - 1);
                } else {
                    win.select(index - 1);
                }
            } else if (TouchInput.wheelY < 0) {
                if (index >= Params.SlotNumber[0] - 1) {
                    win.select(0);
                } else {
                    win.select(index + 1);
                }
            }
            // if(TouchInput.wheelY > 0) {
            //     if(index >= Params.SlotNumber[0] - 1) {
            //         win.select(0);
            //     } else {
            //         win.select(index + 1);
            //     }
            // } else if(TouchInput.wheelY < 0) {
            //     if(index <= 0) {
            //         win.select(Params.SlotNumber[0] - 1);
            //     } else {
            //         win.select(index - 1);
            //     }
            // }
        }
    }

    function isEnableMouseToUse() {
        let mouseMode;
        mouseMode = Params.MouseMode;

        return (mouseMode.UseEnable[0] && TouchInput.isTriggered()) ? true : false;
    }

    function isEnableMouseToSelect() {
        let mouseMode;
        mouseMode = Params.MouseMode;

        return mouseMode.SelectEnable[0] ? true : false;
    }

    function isEnableKeyboardToUse() {
        let keyboardMode, paramKey;
        keyboardMode = Params.KeyboardMode;
        paramKey = getUseKey();

        return (keyboardMode.UseEnable[0] && paramKey && Input.isTriggered(paramKey)) ? true : false;
    }

    function isEnableKeyboardToSelect() {
        let keyboardMode;
        keyboardMode = Params.KeyboardMode;

        return keyboardMode.SelectEnable[0] ? true : false;
    }

    function isEnableEventToSlot() {
        let eventMode;
        eventMode = Params.EventMode;

        return $gameMap.isEventRunning() ? eventMode.SlotEnable[0] ? true : false : true;
        // return eventMode.SlotEnable[0];
    }

    function isEnableEventToUse() {
        let eventMode;
        eventMode = Params.EventMode;

        return $gameMap.isEventRunning() ? eventMode.UseEnable[0] ? true : false : true;
    }

    function isEnableEventToSelect() {
        let eventMode;
        eventMode = Params.EventMode;

        return $gameMap.isEventRunning() ? eventMode.SelectEnable[0] ? true : false : true;
    }

})();