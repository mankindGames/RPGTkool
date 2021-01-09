//===============================================================================
// MKR_LearnSkillSwitch.js
//===============================================================================
// (c) 2016 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.0 2021/01/09 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.0) スキルスイッチプラグイン
 * @author マンカインド
 *
 * @help = スキルスイッチプラグイン =
 * MKR_LearnSkillSwitch.js
 *
 * 指定したスキルを習得後、指定したスイッチを自動的にONにします。
 *
 * 本プラグインの仕様として、プラグインパラメータに指定したスキルを
 * ゲーム開始時に覚えている(=レベル条件を満たしている)場合、
 * ゲーム開始時点でスイッチがONになります。
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
 * @param skillSwitchList
 * @text スキル - スイッチ対応リスト
 * @desc ここで指定したスキルを習得すると指定したスイッチがONになります。
 * @type struct<SkillSwitch>[]
 * @default []
 *
*/
/*~struct~SkillSwitch:
 *
 * @param skillId
 * @text スキル
 * @desc 習得したらスイッチをONにさせるスキルを指定します。
 * @type skill
 *
 * @param switchNo
 * @text スイッチ
 * @desc スキル習得後にONにさせるスイッチを指定します。
 * @type switch
 *
*/

(() => {
    'use strict';


    //=========================================================================
    // Parameter
    //  ・プラグインパラメータの取得と加工
    //
    //=========================================================================
    const PLUGIN_NAME = document.currentScript.src.split("/").pop().replace(/\.js$/, "");
    const PLUGIN_PARAMETER = PluginManager.parameters(PLUGIN_NAME);
    const PARAMS = {
        "skillSwitchList": JSON.parse(PLUGIN_PARAMETER["skillSwitchList"]).map(struct => {
            const { skillId, switchNo } = JSON.parse(struct);
            if(!isFinite(skillId) || !isFinite(switchNo)) {
                throw new Error("スキルスイッチプラグイン:パラメータの設定が間違っています！");
            }
            return {
                "skillId": Number.parseInt(skillId, 10),
                "switchNo": Number.parseInt(switchNo, 10)
            };
        })
    };


    //=========================================================================
    // Game_Actor
    //  ・スキル習得時、特定のスイッチをONにします。
    //
    //=========================================================================
    const _Game_Actor_learnSkill = Game_Actor.prototype.learnSkill;
    Game_Actor.prototype.learnSkill = function(skillId) {
        const skillCount = this._skills.length;

        _Game_Actor_learnSkill.apply(this, arguments);

        if(skillCount === this._skills.length) {
            return;
        }

        const listKey = Object.keys(PARAMS.skillSwitchList).filter(key => {
            return PARAMS.skillSwitchList[key].skillId === skillId;
        }).shift();

        if(listKey !== undefined) {
            $gameSwitches.setValue(PARAMS.skillSwitchList[Number.parseInt(listKey, 10)].switchNo, true);
        }
    };



})();