//=============================================================================
// MKR_LearnActorSkill.js
//===============================================================================
// Copyright (c) 2016-2018 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.1 2018/04/01 ステートの付与によりスキルを覚える機能を追加した。
//
// 1.0.0 2017/08/12 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.1) アクター毎スキル習得
 * @author マンカインド
 *
 * @help = アクター毎スキル習得 ver 1.0.0 =
 * MKR_LearnActorSkill.js - マンカインド
 *
 * 武器・防具/ステートのメモ欄に設定することで、
 * アクターが装備/アクターにステート付与したときに覚える
 * スキルをアクター毎に変更することができます。
 *
 *
 * 武器・防具/ステートメモ欄:
 *   <actorSkills_[アクターId]:[スキルID]>
 *     ・このメモが設定されたアイテム/ステートを[アクターID]番の
 *       アクターが装備/アクターに付与した時、
 *       [スキルID]に設定したスキルをそのアクターが使えるようになります。
 *
 *     ・[スキルID]はカンマ区切りで複数指定することもできます。
 *
 *     ・装備を外した/ステートが解除された場合、アクターは[スキルID]の
 *       スキルを使うことができなくなります。
 *
 *     ・このメモを改行区切りで設定することで、複数のアクターそれぞれに
 *       スキルを設定することができます。
 *
 *
 * メモ欄の設定例:
 *   <actorSkills_3:71>
 *     ・このアイテム/ステートをアクターID:3の
 *       アクターが装備/アクターに付与した時、
 *       そのアクターはスキルID:71のスキルを使えるようになります。
 *
 *   <actorSkills_1:1,3>
 *   <actorSkills_3:4>
 *     ・このアイテム/ステートをアクターID:1の
 *       アクターが装備/アクターに付与した時、
 *       そのアクターはスキルID:1と3のスキルを使えるようになります。
 *
 *     ・このアイテム/ステートをアクターID:3の
 *       アクターが装備/アクターに付与した時、
 *       そのアクターはスキルID:4のスキルを使えるようになります。
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
 * 補足：
 *   ・このプラグインに関するメモ欄の設定、プラグインコマンド/パラメーター、
 *     制御文字は大文字/小文字を区別していません。
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
*/

var Imported = Imported || {};
Imported.MKR_learnActorSkill = true;

(function () {
    'use strict';

    // const PN = "MKR_LearnActorSkill";

    const Regex = {
        actorSkills : /<(?:actorskills_)(\d+)[ :]+([0-9, ]*)?>/i,
    };


    //=========================================================================
    // Game_Actor
    //  ・アクターのスキルを再定義します。
    //
    //=========================================================================
    const _Game_Actor_skills = Game_Actor.prototype.skills;
    Game_Actor.prototype.skills = function() {
        let ret;
        ret = _Game_Actor_skills.call(this);
        ret = this.learnEquipSkill(ret);
        ret = this.learnStateSkill(ret);

        return ret;
    };

    Game_Actor.prototype.learnEquipSkill = function(ret) {
        let id, notes, pattern, m, skills, actorId;
        actorId = this.actorId();

        this.equips().forEach(function(item) {
            if(!item || item.note == "") {
                return false;
            }
            notes = item.note.split(/ ?(?=<)/);
            notes.forEach(function(note, i) {
                note = note.trim();
                if(!Regex.actorSkills.test(note)) {
                    return false;
                }
                m = note.match(Regex.actorSkills);
                m[1] = m[1].trim();
                m[2] = m[2].trim();
                id = isFinite(m[1]) ? parseInt(m[1], 10) : 0;
                skills = m[2].split(",").map(function(num) {
                    return isFinite(num.trim()) ? parseInt(num.trim(), 10) : 0;
                });
                if(id == actorId) {
                    skills.forEach(function(skill) {
                        if(skill > 0 && $dataSkills[skill] && !ret.contains($dataSkills[skill])) {
                            ret.push($dataSkills[skill]);
                        }
                    });
                }
            });
        });

        return ret;
    };

    Game_Actor.prototype.learnStateSkill = function(ret) {
        let id, notes, pattern, m, skills, actorId;
        actorId = this.actorId();

        this.states().forEach(function(item) {
            if(!item || item.note == "") {
                return false;
            }
            notes = item.note.split(/ ?(?=<)/);
            notes.forEach(function(note, i) {
                note = note.trim();
                if(!Regex.actorSkills.test(note)) {
                    return false;
                }
                m = note.match(Regex.actorSkills);
                m[1] = m[1].trim();
                m[2] = m[2].trim();
                id = isFinite(m[1]) ? parseInt(m[1], 10) : 0;
                skills = m[2].split(",").map(function(num) {
                    return isFinite(num.trim()) ? parseInt(num.trim(), 10) : 0;
                });
                if(id == actorId) {
                    skills.forEach(function(skill) {
                        if(skill > 0 && $dataSkills[skill] && !ret.contains($dataSkills[skill])) {
                            ret.push($dataSkills[skill]);
                        }
                    });
                }
            });
        });

        return ret;
    };

})();