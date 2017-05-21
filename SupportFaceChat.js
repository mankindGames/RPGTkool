//=============================================================================
// 【フェイスチャット補助】　Version: 1.22
//
// ここからリスポーン: http://respawnfromhere.blog.fc2.com/
// Twitter: https://twitter.com/ibakip
//=============================================================================

//=============================================================================
 /*:
 * @plugindesc (v1.22_Custom_0.01) フェイスチャット機能を実装します。
 * @author Naoya（http://respawnfromhere.blog.fc2.com/）
 *
 * @param x
 * @desc フェイスチャットお知らせウィンドウを表示するx座標。
 * @default 0
 *
 * @param y
 * @desc フェイスチャットお知らせウィンドウを表示するy座標。
 * @default 550
 *
 * @param width
 * @desc フェイスチャットお知らせウィンドウの横幅。
 * @default 410
 *
 * @param type
 * @desc フェイスチャットお知らせウィンドウのウィンドウタイプ。
 * 0：通常 1：黒背景 2:透明
 * @default 1
 *
 * @param IconNumber
 * @desc フェイスチャットお知らせウィンドウに描画するアイコン番号。
 *  0 を指定するとアイコンは使わず文字で［C］と描画。
 * @default 4
 *
 * @param [C]color
 * @desc [C]の文字を描画するシステムカラー番号。
 * アイコンを使用する場合は無効。
 * @default 2
 *
 * @param MsgWindowHeight
 * @desc レイアウト計算に使うメッセージウィンドウの高さを直接指定。
 *　空文字の場合は高さを自動取得して計算。
 * @default
 *
 * @param ChangeTone
 * @desc FaceChat Ready実行時に画面の色調変更を行うか指定。
 * true:行う false:行わない
 * @default true
 *
 * @param FaceChatKey
 * @desc キー上に表れるフェイスチャット起動キーアクションの表記を変更できます(キーボードコンフィグ有効時のみ)
 * @default Chat
 *
 * @param FaceChatText
 * @desc コンフィグテキストに表れるフェイスチャット起動キーの説明文を変更できます(キーボードコンフィグ有効時のみ)
 * @default フェイスチャット起動
 *
 * @param FaceChatButton
 * @desc フェイスチャット起動ボタンに対するコマンド名を変更できます(ゲームパッドコンフィグ有効時のみ)
 * @default フェイスチャット起動
 *
 * @param FaceChatHelp
 * @desc フェイスチャット起動ボタンに対するヘルプを設定できます(ゲームパッドコンフィグ有効時のみ)
 * @default 表示されているフェイスチャットイベントを起動します
 *
 * @help
 *
 * //=============================================================================
 * // 【フェイスチャット補助】　Version: 1.22_Custom_0.01
 * //
 * // ここからリスポーン: http://respawnfromhere.blog.fc2.com/
 * // Twitter: https://twitter.com/ibakip
 * //=============================================================================
 *
 * フェイスチャット機能を実装します。
 * 機能１：マップから任意のコモンイベントを呼び出せるようにします。
 * 機能２：コモンイベント編集時に、簡単にフェイスチャットが
 *        実行できるようになるプラグインコマンドを追加します。
 *
 * 下記サイトや同梱したイベント編集例などを参考にイベントを作成して下さい。
 * なにか不明な点があればお気軽にブログやツイッターなどで声をかけてください。
 *
 * ・ リファレンス（パラメータやプラクグインコマンドなどの説明）
 *  http://respawnfromhere.blog.fc2.com/blog-entry-9.html
 *
 * ・ 紹介記事
 *  http://respawnfromhere.blog.fc2.com/blog-entry-8.html
 *
 * (2017/05/21 ～ 補足ここから)
 * 【フェイスチャット補助】Ver 1.22_Custom_0.01 は同プラグインの Ver 1.22 を
 * 修正し、Yanfly氏のキーボード/ゲームパッドコンフィグプラグインに
 * 対応したものです。
 *
 * もし、キーボード/ゲームパッドコンフィグプラグインと
 * このプラグイン(Ver 1.22_Custom_0.01)を一緒に利用していて
 * 動作不良などが起きた場合は、元プラグイン(Ver 1.22)製作者の
 * Naoya氏ではなく、私(マンカインド)までご連絡を頂けますようお願いします。
 *
 * [Twitter] https://twitter.com/mankind_games/
 *
 * 最後になりますが、このプラグインを製作、公開されているNaoya氏に
 * 深く感謝申し上げます。
 * (2017/05/21 ～ 補足ここまで)
 *
 *
 * 【更新履歴】
 *  ○ Ver 1.01 （2015/11/21）
 *   ・チャットが空の時にもウィンドウが表示される問題を修正
 *  ○ Ver 1.02 （2015/11/21）
 *   ・ウィンドウに余白ができるとレイアウトが崩れる問題を修正
 *  ○ Ver 1.10 (2015/11/26)
 *   ・フキダシアイコン描画の機能追加
 *   ・サイドビューステート描画の機能追加
 *   ・顔グラ変更の機能追加
 *   ・顔グラ相対移動の機能追加
 *   ・ゲームパッドの操作に対応
 *   ・再起動すると追加していたチャットが消える問題を修正
 *  ○ Ver 1.11 (2015/12/10)
 *   ・フキダシアイコンとサイドビューステートが
 *     正しく描画されない問題を修正
 *   ・FaceChat Ready実行時に、タイトルのウィンドウを
 *     開くのが一瞬見えてしまう問題を修正
 *   ・FaceChat ChangeFaceでエラーが出る問題を修正
 *   ・他プラグインとの競合対策を追加
 *  ○ Ver 1.12 (2015/12/31)
 *   ・動作の軽量化
 *  ○ Ver 1.13 (2016/1/2)
 *   ・いくつかの問題点を修正
 *  ○ Ver 1.14 (2016/1/3)
 *   ・FaceChat Ready実行時に色調変化を行うかを指定できる
 *     プラグインパラメータを追加
 *   ・コンテニュー時にチャット起動が正しく行えなくなるバグを修正
 *  ○ Ver 1.15 (2016/1/23)
 *   ・いくつかの問題点を修正
 *  ○ Ver 1.20 (2016/2/24)
 *   ・クリック（タッチ）による起動を実装
 *   ・若干の動作軽量化
 *  ○ Ver 1.21 (2016/3/22)
 *   ・プラグインOFF時にセーブしたデータをプラグインON時に
 *     ロードするとエラーが発生する問題を修正
 *  ○ Ver 1.22 (2016/7/28)
 *   ・コモンイベントを直接実行した際にはタイトルウィンドウを
 *     開かないように修正
 *  ○ Ver 1.22_Custom_0.01 (2017/5/21) by マンカインド
 *   ・Yanfly氏のGamepadConfigプラグインとKeyBoardConfigプラグインに対応
 *     コンフィグ上でフェイスチャット起動キーを指定可能にした
*      (デフォルトだとキーボードのCキー、またはゲームパッドのボタン8で起動)
 *
 */
 //=============================================================================

var Imported = Imported || {};
Imported.SupportFaceChat = {};

(function(){


//変数の定義
var SFC_Val = Imported.SupportFaceChat;
SFC_Val.WinON = true;
var FaceChatArray = new Array();
var currentDisplayID = 0;
var currentFaceChatID = 0;
var showTitle = false;
var titleText = '';
var draw_Face = false;
var draw_Balloon = false;
var draw_State = false;
var Face = [ [10,0], [11,0], [12,0], [13,0], [14,0], [15,0], [16,0], [17,0] ];
var BalloonAndState = [ [18,0], [19,0], [20,0], [21,0], [22,0], [23,0], [24,0], [25,0] ];
var SFC_cache = {};
var doFaceChatReady = false;
Input.keyMapper[67] = 'FaceChat';
Input.gamepadMapper[8] = 'FaceChat';


// ---プラグインパラメータの取得-----------------------------------------------------
 var Parameters = PluginManager.parameters('SupportFaceChat');
 var CIW_x  = Math.floor(Number(Parameters['x'])) || 0;
 var CIW_y  = Math.floor(Number(Parameters['y'])) || 0;
 var CIW_width  = Math.floor(Number(Parameters['width'])) || 0;
 var CIW_type   = Math.floor(Number(Parameters['type'])) || 0;
 var CIW_icon   = Math.floor(Number(Parameters['IconNumber'])) || 0;
 var C_color = Math.floor(Number(Parameters['[C]color'])) || 0;
 var SFC_MsgWinHeight = Math.floor(Number(Parameters['MsgWindowHeight'])) || Window_Base.prototype.fittingHeight(4);
 var ChangeTone = !Parameters['ChangeTone'].match(/^\s*(false)\s*$/i);

 // キーコンフィグ、ゲームパッドコンフィグプラグイン対応
 var FaceChatKey  = String(Parameters['FaceChatKey']);
 var FaceChatText = String(Parameters['FaceChatText']);
 var FaceChatBt   = String(Parameters['FaceChatButton']);
 var FaceChatHelp = String(Parameters['FaceChatHelp']);
//----------------------------------------------------------------------------


// ---プラグインコマンド-------------------------------------------------------------
var SFC_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    SFC_Game_Interpreter_pluginCommand.call(this, command, args);

    //---マップ画面での管理用-------------------------------------------------------------
    if (command === 'addFaceChat') {
        FaceChatArray[FaceChatArray.length] = new Array( args[0], args[1], args[2] );
        FaceChatArray.sort(
            function(param1,param2){
                return(param2[1] - param1[1]);
            }
        );
        currentDisplayID = 0;
        currentFaceChatID = FaceChatArray[currentDisplayID][0];
    }
    if (command === 'deleteFaceChat') {
        if( FaceChatArray.length !== 0 ){
            for (var i = 0; i < FaceChatArray.length; i++) {
                if( FaceChatArray[i][0] === args[0] ){
                    FaceChatArray.splice(i,1);
                    currentDisplayID = 0;
                }
            }
            if(FaceChatArray.length > 0){
                currentFaceChatID = FaceChatArray[currentDisplayID][0];
            }
        }
    }
    if (command === 'FaceChatWindow'){
        switch (args[0]) {
            case 'Show':
                SFC_Val.WinON = true;
                break;
            case 'Hide':
                SFC_Val.WinON = false;
                break;
        }
    }
    //------------------------------------------------------------------------------------

    //---コモンイベント内での補助機能-------------------------------------------------------------
    if ( command === 'FaceChat' ){
        switch (args[0]) {
            case 'Ready':
                if(ChangeTone){
                    currentTone = [$gameScreen.tone()[0],$gameScreen.tone()[1],$gameScreen.tone()[2],$gameScreen.tone()[3]];
                    var tone = [currentTone[0]-120,currentTone[1]-120,currentTone[2]-120,currentTone[3]];
                    var frame = 30;
                    var wait = true;
                    $gameScreen.startTint( tone , frame );
                    if ( wait ) {
                        this.wait( frame );
                    }
                }
                doFaceChatReady = true;
                //showTitle = true;
                break;
            case 'Finish':
                showTitle = false;
                for(var i=0;i<BalloonAndState.length;i++){
                    Face[i][1] = 0;
                    BalloonAndState[i][1] = 0;
                }
                for(var loop=25;loop>=10;loop--){
                    $gameScreen.erasePicture(loop);
                }
                if(ChangeTone && doFaceChatReady){
                    var frame = 30;
                    var wait = true;
                    $gameScreen.startTint( currentTone , frame );
                    if ( wait ) {
                        this.wait( frame );
                    }
                }
                doFaceChatReady = false;
                break;
            case 'addFace':
                draw_Face = true;
                var tone = [0,0,0,0];
                Face[Number(args[4])-1][1] = args[2];
                var facePos = calcXYPosition(args[3],args[4]);
                $gameScreen.showPicture(Number(args[4])+9, args[1], 1, facePos[0], facePos[1], 100, 100, 255, 0);
                $gameMap._interpreter.wait(1);
                window.setTimeout( function() { draw_Face = false; }, (1000/60) * 2 );
                break;
            case 'ChangeFace':
                var pic_Id = Number(args[3])+9;
                var pic = $gameScreen.picture( pic_Id );
                if(pic){
                    draw_Face = true;
                    Face[Number(args[3])-1][1] = args[2];
                    $gameScreen.showPicture( Number(args[3])+9, args[1], 1, pic.x(), pic.y(), pic.scaleX(), pic.scaleY(), pic.opacity(), pic.blendMode() );
                    window.setTimeout( function() { draw_Face = false; }, (1000/60) * 5 );
                }
                pic=null;
                break;
            case 'Emphasize':
                var brightTone = [0, 0, 0, 0];
                var darkTone = [-58, -58, -58, 58];
                var pic;
                if(args[1] === 'OFF'){
                    for (var loop=1; loop<=8; loop++) {
                        pic = $gameScreen.picture( loop+9 );
                        if(pic){
                            $gameScreen.tintPicture(loop+9, brightTone, 2);
                            $gameScreen.movePicture(loop+9, 1, pic.x() , pic.y(), 100, 100, 255, 0, 5);
                        }
                    }
                }
                else{
                    for (var loop=1; loop<=8; loop++) {
                        pic = $gameScreen.picture( loop+9 );
                        if ( pic ){
                            if ( loop !== Number(args[1]) ){
                                $gameScreen.tintPicture(loop+9, darkTone, 2);
                            }
                            else{
                                $gameScreen.tintPicture(loop+9, brightTone, 2);
                                $gameScreen.movePicture(loop+9, 1, pic.x() , pic.y(), 110, 110, 255, 0, 5);
                            }
                            if ( pic.scaleX() > 100 ){
                                $gameScreen.movePicture(loop+9, 1, pic.x() , pic.y(), 100, 100, 255, 0, 5);
                            }
                        }
                    }
                }
                $gameMap._interpreter.wait(5);
                break;
            case 'RelativeMove':
                var pic_Id = Number(args[1])+9;
                var pic = $gameScreen.picture( pic_Id );
                var move_x = Number(args[2]);
                var move_y = Number(args[3]);
                var move_wait = Number(args[4]);
                $gameScreen.movePicture(pic_Id, 1, pic.x()+move_x, pic.y()+move_y, pic.scaleX(), pic.scaleY(), pic.opacity(), pic.blendMode(), move_wait);
                if( !args[5].match(/^\s*(false)\s*$/i) === true ){
                    $gameMap._interpreter.wait( Number(args[4]) );
                }
                break;
            case 'StartBalloon':
                draw_Balloon = true;
                startBalloonAndState(args[1],args[2],-80, 'Balloon');
                window.setTimeout( function() { draw_Balloon = false; }, (1000/60) * 2 );
                break;
            case 'StartState':
                draw_State = true;
                startBalloonAndState(args[1],args[2],-55, 'States');
                window.setTimeout( function() { draw_State = false; }, (1000/60) * 2 );
                break;
            case 'EndBalloonAndState':
                for(var i=0;i<BalloonAndState.length;i++){
                    if( BalloonAndState[i][0] === Number(args[1])+17 ){
                        BalloonAndState[i][1] = 0;
                    }
                }
                $gameScreen.erasePicture( Number(args[1])+17 );
                break;
        }
    }
    //------------------------------------------------------------------------------------
};
//----------------------------------------------------------------------------

/* フキダシアイコンとサイドビューステートの描画開始 */
var startBalloonAndState = function(args1, args2, plusY, Name){
    var pic = $gameScreen.picture( Number(args1)+9 );
    for(var i=0;i<BalloonAndState.length;i++){
        if( BalloonAndState[i][0] === Number(args1)+17 ) BalloonAndState[i][1] = Number(args2);
    }
    $gameScreen.showPicture(Number(args1)+17, Name, 1, pic.x(), pic.y()+plusY, 100, 100, 255, 0);
    $gameMap._interpreter.wait(1);
};

/* フキダシアイコンとサイドビューステートの描画終了 */
var endBalloonAndState = function(args1){
    for(var i=0;i<BalloonAndState.length;i++){
        if( BalloonAndState[i][0] === Number(args1)+17 ){
            BalloonAndState[i][1] = 0;
        }
    }
    $gameScreen.erasePicture( Number(args1)+17 );
};

/* 顔グラを表示する座標を計算して返す */
var calcXYPosition = function(total, number){
    var x = 0;
    var y = 0;
    var spaceWidth = Graphics.boxWidth;
    var spaceHeight = Graphics.boxHeight - Window_ChatTitle.prototype.contentsHeight() - SFC_MsgWinHeight;

    switch (total) {
        case '1':
            x = (spaceWidth - 144) / 2 + 72;
            y = ((spaceHeight - 144) / 2 + 72) + Window_ChatTitle.prototype.contentsHeight();
            break;
        case '2':
            y = ((spaceHeight - 144) / 2 + 72) + Window_ChatTitle.prototype.contentsHeight();
            switch (number) {
                case '1':
                    x = ((spaceWidth - 144*2) / 5) * 2 + 72;
                    break;
                case '2':
                    x = ((spaceWidth - 144*2) / 5) * 3 + 144 + 72;
                    break;
            }
            break;
        case '3':
            switch (number) {
                case '1':
                    x = (spaceWidth - 144) / 2 + 72;
                    y = ((spaceHeight - 144*2) / 3) + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '2':
                    x = ((spaceWidth - 144*2) / 5) * 2 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 144 + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '3':
                    x = ((spaceWidth - 144*2) / 5) * 3 + 144 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 144 + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
            }
            break;
        case '4':
            switch (number) {
                case '1':
                    x = ((spaceWidth - 144*2) / 5) * 2 + 72;
                    y = ((spaceHeight - 144*2) / 3) + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '2':
                    x = ((spaceWidth - 144*2) / 5) * 3 + 144 + 72;
                    y = ((spaceHeight - 144*2) / 3) + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '3':
                    x = ((spaceWidth - 144*2) / 5) * 2 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 72 + 144 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '4':
                    x = ((spaceWidth - 144*2) / 5) * 3 + 144 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 144 + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
            }
            break;
        case '5':
            switch (number) {
                case '1':
                    x = ((spaceWidth - 144*2) / 5) * 2 + 72;
                    y = ((spaceHeight - 144*2) / 3) + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '2':
                    x = ((spaceWidth - 144*2) / 5) * 3 + 144 + 72;
                    y = ((spaceHeight - 144*2) / 3) + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '3':
                    x = ((spaceWidth - 144*3) / 6) * 2 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 144 + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '4':
                    x = ((spaceWidth - 144*3) / 6) * 3 + 144 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 144 + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '5':
                    x = ((spaceWidth - 144*3) / 6) * 4 + 144 * 2 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 144 + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
            }
            break;
        case '6':
            switch (number){
                case '1':
                    x = ((spaceWidth - 144*3) / 6) * 2 + 72;
                    y = ((spaceHeight - 144*2) / 3) + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '2':
                    x = ((spaceWidth - 144*3) / 6) * 3 + 144 + 72;
                    y = ((spaceHeight - 144*2) / 3) + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '3':
                    x = ((spaceWidth - 144*3) / 6) * 4 + 144 * 2 + 72;
                    y = ((spaceHeight - 144*2) / 3) + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '4':
                    x = ((spaceWidth - 144*3) / 6) * 2 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 144 + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '5':
                    x = ((spaceWidth - 144*3) / 6) * 3 + 144 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 144 + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '6':
                    x = ((spaceWidth - 144*3) / 6) * 4 + 144 * 2 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 144 + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
            }
            break;
        case '7':
            switch (number){
                case '1':
                    x = ((spaceWidth - 144*3) / 6) * 2 + 72;
                    y = ((spaceHeight - 144*2) / 3) + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '2':
                    x = ((spaceWidth - 144*3) / 6) * 3 + 144 + 72;
                    y = ((spaceHeight - 144*2) / 3) + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '3':
                    x = ((spaceWidth - 144*3) / 6) * 4 + 144 * 2 + 72;
                    y = ((spaceHeight - 144*2) / 3) + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '4':
                    x = ((spaceWidth - 144*4) / 12) * 3 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 144 + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '5':
                    x = ((spaceWidth - 144*4) / 12) * 5 + 144 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 144 + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '6':
                    x = ((spaceWidth - 144*4) / 12) * 7 + 144 * 2 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 144 + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '7':
                    x = ((spaceWidth - 144*4) / 12) * 9 + 144 * 3 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 144 + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
            }
            break;
        case '8':
            switch (number){
                case '1':
                    x = ((spaceWidth - 144*4) / 12) * 3 + 72;
                    y = ((spaceHeight - 144*2) / 3) + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '2':
                    x = ((spaceWidth - 144*4) / 12) * 5 + 144 + 72;
                    y = ((spaceHeight - 144*2) / 3) + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '3':
                    x = ((spaceWidth - 144*4) / 12) * 7 + 144 * 2 + 72;
                    y = ((spaceHeight - 144*2) / 3) + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '4':
                    x = ((spaceWidth - 144*4) / 12) * 9 + 144 * 3 + 72;
                    y = ((spaceHeight - 144*2) / 3) + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '5':
                    x = ((spaceWidth - 144*4) / 12) * 3 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 144 + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '6':
                    x = ((spaceWidth - 144*4) / 12) * 5 + 144 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 144 + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '7':
                    x = ((spaceWidth - 144*4) / 12) * 7 + 144 * 2 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 144 + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
                case '8':
                    x = ((spaceWidth - 144*4) / 12) * 9 + 144 * 3 + 72;
                    y = ((spaceHeight - 144*2) / 3) * 2 + 144 + 72 + Window_ChatTitle.prototype.contentsHeight();
                    break;
            }
            break;
    }
    var XY = [x,y];
    return  XY;
};


//-----------------------------------------------------------------------------
// DataManager
//-----------------------------------------------------------------------------
/* フェイスチャットの情報をセーブ＆ロードできるように上書き */

var SFC_DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    var contents = SFC_DataManager_makeSaveContents();
    contents.FaceChatArray = FaceChatArray;
    contents.currentDisplayID = currentDisplayID;
    contents.currentFaceChatID = currentFaceChatID;
    contents.WinON = SFC_Val.WinON;
    return contents;
};
var SFC_DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    SFC_DataManager_extractSaveContents(contents);
    if (!(typeof contents.currentDisplayID === "undefined")) {
        currentDisplayID = contents.currentDisplayID;
    }
    if (!(typeof contents.currentFaceChatID === "undefined")) {
        currentFaceChatID = contents.currentFaceChatID;
    }
    if (!(typeof contents.FaceChatArray === "undefined")) {
        FaceChatArray = contents.FaceChatArray;
    }
    if (!(typeof contents.WinON === "undefined")) {
        SFC_Val.WinON = contents.WinON;
    }
};

//-----------------------------------------------------------------------------
// Scene_Title
//-----------------------------------------------------------------------------
//ニューゲーム時にフェイスチャットのリストをリセット
var SFC_scene_title_commandNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function() {
    FaceChatArray = new Array();
    SFC_scene_title_commandNewGame.call(this);
};


//-----------------------------------------------------------------------------
// Window_ChatTitle
//-----------------------------------------------------------------------------
/* フェイスチャットのタイトル描画用ウィンドウ */

function Window_ChatTitle() {
    this.initialize.apply(this, arguments);
}

Window_ChatTitle.prototype = Object.create(Window_Base.prototype);
Window_ChatTitle.prototype.constructor = Window_ChatTitle;

Window_ChatTitle.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
};

//描画内容の更新
Window_ChatTitle.prototype.refresh = function(){
    if(this.visible){
        var y = (this.contentsHeight() - Window_Base.prototype.lineHeight() ) / 2;
        this.contents.fillRect(0, 0, this.contentsWidth(), this.contentsHeight(), '#0c0c0c' );
        this.drawText(titleText, 0, y, this.contentsWidth(), 'center' );
    }
    else{
        this.contents.clear();
    }
};

Window_ChatTitle.prototype.contentsWidth = function() {
    return Graphics.boxWidth;
};

Window_ChatTitle.prototype.contentsHeight = function() {
    return 60;
};

window.Window_ChatInfo = Window_ChatTitle;


//-----------------------------------------------------------------------------
// Window_ChatInfo
//-----------------------------------------------------------------------------
/* フェイスチャットお知らせウィンドウ */

function Window_ChatInfo() {
    this.initialize.apply(this, arguments);
}

Window_ChatInfo.prototype = Object.create(Window_Base.prototype);
Window_ChatInfo.prototype.constructor = Window_ChatInfo;

Window_ChatInfo.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.currentTitle = '';
};

//描画内容の更新
Window_ChatInfo.prototype.refresh = function(){
    this.contents.clear();
    if( FaceChatArray.length !== 0 && FaceChatArray[currentDisplayID] !== null){
        titleText = $dataCommonEvents[ FaceChatArray[currentDisplayID][0] ].name;
        this.currentTitle = titleText;
    }
    var x = this.textPadding()*2;
    var xPlus = 0;
    var y = (this.contentsHeight() - Window_Base.prototype.lineHeight() ) / 2;
    if (CIW_icon === 0){
        xPlus = this.textPadding();
        this.changeTextColor(this.textColor(C_color));
        this.drawText('[C]', x, y, this.contentsWidth() );
    }
    else{
        var icon_y = (this.contentsHeight() - Window_Base._iconWidth) / 2;
        this.drawIcon(CIW_icon, x, icon_y);
    }
    this.changeTextColor(this.textColor(0));
    this.drawText(titleText, x*2+Window_Base._iconWidth+xPlus, y, this.contentsWidth() );
};

Window_ChatInfo.prototype.update = function(){
    Window_Base.prototype.update.call(this);
    if( FaceChatArray.length !== 0 && this.visible ){
        if( this.isPreviousChatCalled() ){
            currentDisplayID = currentDisplayID - 1;
            if( currentDisplayID < 0 ){
                currentDisplayID = FaceChatArray.length - 1;
            }
            currentFaceChatID = FaceChatArray[currentDisplayID][0];
        }
        else if( this.isNextChatCalled() ){
            currentDisplayID = currentDisplayID + 1;
            if( currentDisplayID > FaceChatArray.length - 1 ){
                currentDisplayID = 0;
            }
            currentFaceChatID = FaceChatArray[currentDisplayID][0];
        }
        if(this.currentTitle !== $dataCommonEvents[ FaceChatArray[currentDisplayID][0] ].name){
            this.refresh();
        }
    }
};

Window_ChatInfo.prototype.contentsWidth = function() {
    return CIW_width;
};

Window_ChatInfo.prototype.contentsHeight = function() {
    return 60;
};

Window_ChatInfo.prototype.hide = function() {
    this.visible = false;
};

Window_ChatInfo.prototype.show = function() {
    this.visible = true;
};

//チャット切り替えのキーが押されたかチェック
Window_ChatInfo.prototype.isNextChatCalled = function() {
    return Input.isTriggered('pagedown');
};
Window_ChatInfo.prototype.isPreviousChatCalled = function() {
    return Input.isTriggered('pageup');
};

window.Window_ChatInfo = Window_ChatInfo;


//-----------------------------------------------------------------------------
// Scene_Map
//-----------------------------------------------------------------------------

var SFC_scene_map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    SFC_scene_map_start.call(this);
    this.RW_flag = false;
    this.changeScene = false;
    this.titleWindowOpened = false;
    this.ChatInfoWindow.open();
};

Scene_Map.prototype.createChatInfoWindow = function(){
    this.ChatInfoWindow = new Window_ChatInfo(this);
    this.ChatInfoWindow.x = CIW_x;
    this.ChatInfoWindow.y = CIW_y;
    this.ChatInfoWindow.width = CIW_width;
    this.ChatInfoWindow.height = 60;
    this.ChatInfoWindow.setBackgroundType(CIW_type);
    this.ChatInfoWindow.padding = 0;
    this.ChatInfoWindow.openness = 0;
    this.addWindow(this.ChatInfoWindow);
};

Scene_Map.prototype.createChatTitleWindow = function(){
    this.ChatTitleWindow = new Window_ChatTitle(this);
    this.ChatTitleWindow.x = 0;
    this.ChatTitleWindow.y = 0;
    this.ChatTitleWindow.width = Graphics.boxWidth;
    this.ChatTitleWindow.height = 60;
    this.ChatTitleWindow.setBackgroundType(2);
    this.ChatTitleWindow.padding = 0;
    this.ChatTitleWindow.openness = 0;
    this.ChatTitleWindow.visible = false;
    this.addWindow(this.ChatTitleWindow);
};

var SFC_scene_map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    SFC_scene_map_createAllWindows.call(this);
    this.createChatInfoWindow(this);
    this.createChatTitleWindow(this);
};

var SFC_scene_map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    SFC_scene_map_update.call(this);

    //チャットタイトルウィンドウの開閉処理
    if( showTitle && !this.titleWindowOpened ){
        this.ChatTitleWindow.open();
        this.ChatTitleWindow.visible = true;
        this.ChatTitleWindow.refresh();
        this.titleWindowOpened = true;
    } else if( !showTitle && this.titleWindowOpened ){
        this.ChatTitleWindow.close();
        this.ChatTitleWindow.visible = false;
        this.ChatTitleWindow.refresh();
        this.titleWindowOpened = false;
    }

    //チャット使用不可の時、チャットお知らせウィンドウを非表示にする。
    if( FaceChatArray.length === 0 || !$gamePlayer.canMove() || !SFC_Val.WinON ){
        this.ChatInfoWindow.hide();
        return;
    }

    //常駐ウィンドウプラグインとの競合対策
    if( this.RW_flag === true ){
        Imported.ResidentWindow.WinON = true;
        this.RW_flag = false;
    }

    //チャットお知らせウィンドウの表示
    if( !this.changeScene ) this.ChatInfoWindow.show();

    //フェイスチャット呼び出し処理
    if( this.isFaceChatCalled() ){
        if( Imported.ResidentWindow ){  //常駐ウィンドウプラグインとの競合対策
            if( Imported.ResidentWindow.WinON ){
                Imported.ResidentWindow.WinON = false;
                this.RW_flag = true;
            }
        }
        showTitle = true;
        $gameTemp.reserveCommonEvent( currentFaceChatID );
        this.ChatInfoWindow.hide();
        this._mapNameWindow.hide();
        FaceChatArray.splice(currentDisplayID,1);
        currentDisplayID = 0;
        if(FaceChatArray.length !== 0){
            currentFaceChatID = FaceChatArray[currentDisplayID][0];
        }else{
            currentFaceChatID = 0;
        }
    }
};

var SFC_scene_map_stop = Scene_Map.prototype.stop;
Scene_Map.prototype.stop = function() {
    this.changeScene = true;
    this.ChatInfoWindow.hide();
    SFC_scene_map_stop.call(this);
};

Scene_Map.prototype.isFaceChatCalled = function() {
    return Input.isTriggered('FaceChat') || this.isTouchCIW() ;
};

Scene_Map.prototype.isTitleWindowOpened = function() {
    return this.titleWindowOpened;
};

Scene_Map.prototype.isTouchCIW = function() {
    if( TouchInput.isPressed() && this.ChatInfoWindow.visible ){
        var eval1 = (TouchInput.x > this.ChatInfoWindow.x);
        var eval2 = (TouchInput.x < this.ChatInfoWindow.x + this.ChatInfoWindow.width);
        var eval3 = (TouchInput.y > this.ChatInfoWindow.y);
        var eval4 = (TouchInput.y < this.ChatInfoWindow.y + this.ChatInfoWindow.height);
        if(eval1 && eval2 && eval3 && eval4){
            SFC_StopMove = true;
        }
        return eval1 && eval2 && eval3 && eval4;
    }
    else{
        return false;
    }
};

var SFC_scene_map_isFastForward = Scene_Map.prototype.isFastForward;
Scene_Map.prototype.isFastForward = function() {
    if(this.isTouchCIW()){
        return false;
    }
    else{
        SFC_scene_map_isFastForward.call(this);
    }
};

Scene_Map.prototype.updateDestination = function() {
    if (this.isMapTouchOk()) {
        if(!this.isTouchCIW()){
            this.processMapTouch();
        }
    } else {
        $gameTemp.clearDestination();
        this._touchCount = 0;
    }
};


//-----------------------------------------------------------------------------
// Sprite_Picture
//-----------------------------------------------------------------------------

var SFC_sprite_picture_initialize = Sprite_Picture.prototype.initialize;
Sprite_Picture.prototype.initialize = function(pictureId) {
    this._face = false;
    this._balloon = false;
    this._state = false;
    this._count = 0;
    this._number = 0;
    this._now = 0;
    this._lastDate = 0;
    this._lastFaceNumber = 0;
    SFC_sprite_picture_initialize.call(this, pictureId);
};

var SFC_sprite_picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
Sprite_Picture.prototype.loadBitmap = function() {
    if( draw_Face ){
        this._face = true;
        var faceNumber = Face[this._pictureId-10][1];
        var x = ((faceNumber-1) % 4) * 144;
        var y = Math.floor((faceNumber-1) / 4) * 144;
        b = ImageManager.loadFace(this._pictureName);
        var bt = new Bitmap(144,144);
        bt.gradientFillRect(0, 0, 144, 144, '#DCDCDC', '#696969', true);
        b.addLoadListener(function () {
            bt.blt(b,x,y,144,144,0,0);
            this.bitmap = bt;
        });
        this.bitmap = bt;
        draw_Face = false;
    }
    else if(draw_Balloon){
        this._balloon = true;
        var b = ImageManager.loadSystem('Balloon');
        var width = 384/8;
        var height = 720/15;
        var bt = new Bitmap(width,height);
        var sx = width*0;
        var picture = this.picture();
        for(var i=0;i<BalloonAndState.length;i++){
            if( BalloonAndState[i][0] === this._pictureId && BalloonAndState[i][1] !== 0 ) {
                var sy = height * (BalloonAndState[i][1]-1);
            }
        }
        b.addLoadListener(function () {
            bt.blt(b, sx, sy, width, height, 0, 0);
        });
        this.bitmap = bt;
        draw_Balloon = false;
    }
    else if(draw_State){
        this._state = true;
        var b = ImageManager.loadSystem('States');
        var width = 768/8;
        var height = 960/10;
        var bt = new Bitmap(width,height);
        var sx = width*0;
        var picture = this.picture();
        for(var i=0;i<BalloonAndState.length;i++){
            if( BalloonAndState[i][0] === this._pictureId && BalloonAndState[i][1] !== 0 ) {
                var sy = height * (BalloonAndState[i][1]-1);
            }
        }
        b.addLoadListener(function () {
            bt.blt(b, sx, sy, width, height, 0, 0);
        });
        this.bitmap = bt;
        draw_State = false;
    }
    else{
        SFC_sprite_picture_loadBitmap.call(this);
    }
};

Sprite_Picture.prototype.SFC_updateFace = function() {
    var picture = this.picture();
    var b;
    if (picture) {
        var pictureName = picture.name();
        var x = ((Face[this._pictureId-10][1]-1) % 4) * 144;
        var y = Math.floor((Face[this._pictureId-10][1]-1) / 4) * 144;
        if (this._pictureName !== pictureName || this._lastFaceNumber!==Face[this._pictureId-10][1]) {
            this._pictureName = pictureName;
            this._lastFaceNumber = Face[this._pictureId-10][1];
            b = ImageManager.loadFace(this._pictureName);
            var bt = new Bitmap(144,144);
            bt.gradientFillRect(0, 0, 144, 144, '#DCDCDC', '#696969', true);
            b.addLoadListener(function () {
                   bt.blt(b,x,y,144,144,0,0);
                   this.bitmap = bt;
            });
            this.bitmap = bt;
        }
        this.visible = true;
    } else {
        this._pictureName = '';
        this.bitmap = null;
        this.visible = false;
    }
};

Sprite_Picture.prototype.SFC_updateBalloonAndState = function() {
    var picture = this.picture();
    var b;
    var width;
    var height;
        if (picture) {
            var pictureName = picture.name();
            if( (this._pictureName !== pictureName) && this._pictureName ){
                this._pictureName = pictureName;
                if ( this._pictureName ) {
                    if(this._balloon){
                        this._balloon = false;
                        this._state = true;
                    }
                    else{
                        this._balloon = true;
                        this._state = false;
                    }
                    this._count = 0;
                    this._now = 0;
                    this._lastDate = 0;
                }
            }
            if(this._count >= 1200){
                this._count=0;
                this._number = 0;
            }
            if(this._count === 0 ||  this._count >= (this._number*150) ){
                if(this._balloon === true){
                    b = ImageManager.loadSystem('Balloon');
                    width = 384/8;
                    height = 720/15;
                }
                else{
                    b = ImageManager.loadSystem('States');
                    width = 768/8;
                    height = 960/10;
                }
                var bt = new Bitmap(width,height);
                var sx = width*(this._number);
                for(var i=0;i<BalloonAndState.length;i++){
                    if( BalloonAndState[i][0] === this._pictureId && BalloonAndState[i][1] !== 0 ){
                        var sy = height * (BalloonAndState[i][1]-1);
                    }
                }
                b.addLoadListener(function () {
                    bt.blt(b, sx, sy, width, height, 0, 0);
                });
                this.bitmap = bt;
                this._number = this._number + 1;
            }
            this.visible = true;
            this._now = Date.now();
            this._count = this._count + (this._now - this._lastDate);
            this._lastDate = this._now;
        }
        else {
            b = null;
            this.bitmap = null;
            this.visible = false;
            this._count=0;
            this._now = 0;
            this._lastDate = 0;
        }
};

var SFC_sprite_picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
Sprite_Picture.prototype.updateBitmap = function() {
    if(this._face === true){
        this.SFC_updateFace();
    }
    else if(this._balloon === true || this._state === true){
        this.SFC_updateBalloonAndState();
    }
    else{
        SFC_sprite_picture_updateBitmap.call(this);
    }
};


Sprite_Picture.prototype.updatePosition = function() {
    var picture = this.picture();
    if(this._balloon){
        var parentPicture = $gameScreen.picture( this._pictureId-8 );
        this.x = parentPicture._x;
        this.y = parentPicture._y-80;
    }
    else if(this._state){
        var parentPicture = $gameScreen.picture( this._pictureId-8 );
        this.x = parentPicture._x;
        this.y = parentPicture._y-55;
    }
    else{
        this.x = Math.floor(picture.x());
        this.y = Math.floor(picture.y());
    }
};


// En:When [Yanfly.KeyboardConfig] plugin was enabled.
// Ja:Yanfly.KeyboardConfig プラグインが有効のとき。
if(Imported.KeyboardConfig) {

    var _ConfigManager_readKeyConfig = ConfigManager.readKeyConfig;
    ConfigManager.readKeyConfig = function(config, name) {
        var value, ret;

        value = config[name];
        ret = _ConfigManager_readKeyConfig.apply(this, arguments);
        if(value !== undefined) {
            if(!Object.keys(ret).some(function(e){return ret[e] == 'FaceChat'})) {
                ret[67] = 'FaceChat';
            }
        }else if(ret[67] == undefined) {
            ret[67] = 'FaceChat';
        }

        return ret;
    };

    var _Window_KeyConfig_actionKey = Window_KeyConfig.prototype.actionKey;
    Window_KeyConfig.prototype.actionKey = function(action) {
        if(action == 'FaceChat') {
            return FaceChatKey;
        } else {
            return _Window_KeyConfig_actionKey.call(this, action);
        }
    };

    var _Window_KeyAction_makeCommandList = Window_KeyAction.prototype.makeCommandList;
    Window_KeyAction.prototype.makeCommandList = function() {
        _Window_KeyAction_makeCommandList.call(this);
        this.addCommand(FaceChatText, 'ok', true, 'FaceChat');
    };

    var _Scene_KeyConfig_commandDefault = Scene_KeyConfig.prototype.commandDefault;
    Scene_KeyConfig.prototype.commandDefault = function() {
        _Scene_KeyConfig_commandDefault.call(this);
        ConfigManager.keyMapper[67] = 'FaceChat';
        ConfigManager.applyKeyConfig();
        this.refreshWindows();
    };

}


// en:When [Yanfly.GamepadConfig] plugin was enabled.
// ja:Yanfly.GamepadConfig プラグインが有効のとき。
if(Imported.GamepadConfig) {

    // var _Input_getGamepadButton = Input.getGamepadButton;
    // Input.getGamepadButton = function(type) {
    //     var ret = _Input_getGamepadButton.call(this, type);

    //     if(ret == null) {
    //         Object.keys(Input.gamepadMapper).some(function(e, i){
    //             ret = 8;
    //             return ret != null;
    //         });
    //     }

    //     return ret;
    // };

    var _ConfigManager_readGamepadConfig = ConfigManager.readGamepadConfig;
    ConfigManager.readGamepadConfig = function(config, name) {
        var value, ret;

        value = config[name];
        ret = _ConfigManager_readGamepadConfig.apply(this, arguments);
        if(value !== undefined) {
            if(!Object.keys(ret).some(function(e){return ret[e] == 'FaceChat'})) {
                ret[8] = 'FaceChat';
            }
        }else if(ret[8] == undefined) {
            ret[8] = 'FaceChat';
        }

        return ret;
    };

    var _Window_GamepadConfig_makeCommandList = Window_GamepadConfig.prototype.makeCommandList;
    Window_GamepadConfig.prototype.makeCommandList = function(index) {
        _Window_GamepadConfig_makeCommandList.call(this, index);

        this.insertCommand(this.maxItems() - 3, this.getButtonTypeText(20), 'button', true)
    };

    Window_GamepadConfig.prototype.insertCommand = function(index, name, symbol, enabled, ext) {
        if (enabled === undefined) {
            enabled = true;
        }
        if (ext === undefined) {
            ext = null;
        }
        this._list.splice(index, 0, { name: name, symbol: symbol, enabled: enabled, ext: ext});
    };

    var _Window_GamepadConfig_getButtonTypeText = Window_GamepadConfig.prototype.getButtonTypeText
    Window_GamepadConfig.prototype.getButtonTypeText = function(index) {
        if(index === 20) return FaceChatBt;
        return _Window_GamepadConfig_getButtonTypeText.call(this, index);
    };

    var _Window_GamepadConfig_drawItem = Window_GamepadConfig.prototype.drawItem;
    Window_GamepadConfig.prototype.drawItem = function(index) {
        var rect, align, ww, text;
        _Window_GamepadConfig_drawItem.call(this, index);

        if(index == this.maxItems() - 4) {
            Window_Command.prototype.clearItem.call(this, index);
            rect = this.itemRectForText(index);
            align = this.itemTextAlign();
            ww = rect.width / 2;
            this.resetTextColor();
            this.changePaintOpacity(this.isCommandEnabled(index));
            this.drawText(this.commandName(index), rect.x, rect.y, ww, align);
            text = this.getButtonConfig(index);
            this.drawText(text, rect.x + ww, rect.y, ww, align);
        }
    };

    var _Window_GamepadConfig_getButtonConfig = Window_GamepadConfig.prototype.getButtonConfig;
    Window_GamepadConfig.prototype.getButtonConfig = function(index) {
        var ret, key, button;
        ret = _Window_GamepadConfig_getButtonConfig.call(this, index);

        if(ret == '') {
            key = this.getButtonKey(index);
            if(key != '' && key !== undefined) {
                button = Input.getGamepadButton(key);
                if(button != null) {
                    ret = Yanfly.Param.GamepadConfigButton.format(button)
                }
            }
        }
        return ret;
    };

    var _Window_GamepadConfig_getButtonKey = Window_GamepadConfig.prototype.getButtonKey;
    Window_GamepadConfig.prototype.getButtonKey = function(index) {
        if(index == this.maxItems() - 4) {
            return 'FaceChat';
        } else {
            return _Window_GamepadConfig_getButtonKey.call(this, index);
        }
    };

    var _Window_GamepadConfig_updateHelp = Window_GamepadConfig.prototype.updateHelp;
    Window_GamepadConfig.prototype.updateHelp = function() {
        _Window_GamepadConfig_updateHelp.call(this);
        if (!this._helpWindow) return;
            switch (this.index()) {
            case this.maxItems() - 4:
                this._helpWindow.setText(FaceChatHelp);
                break;
            case this.maxItems() - 3:
                this._helpWindow.clear();
                break;
            case this.maxItems() - 2:
                this._helpWindow.setText(Yanfly.Param.GamepadConfigResetHelp);
                break;
            case this.maxItems() - 1:
                this._helpWindow.setText(Yanfly.Param.GamepadConfigFinishHelp);
                break;
            }
    };

    var _Scene_GamepadConfig_commandReset = Scene_GamepadConfig.prototype.commandReset;
    Scene_GamepadConfig.prototype.commandReset = function() {
        _Scene_GamepadConfig_commandReset.call(this);

        ConfigManager.gamepadInput[8] = 'FaceChat';
        ConfigManager.applyGamepadConfig();
        this.refreshWindows();
    };

}

})();
