import { IEvent, IOption } from "../../../interface/index";
// components/hero-skill/hero-skill.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    heroes: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectSkillIndex: 0,
    skillLogoList: [],
    skillDetail: null,
    selectSkillId: '',
    abilityTpe: ''
  },

  lifetimes: {
    ready() {
      this.getSkillLogoList();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 生成guid
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    // 获取普通技能
    getNormalList(abilities = []) {
      const list = abilities.filter((item: any) => !item.ability_is_granted_by_shard && !item.ability_is_granted_by_scepter);
      const normalList = list.map((item: any) => {
        const { id, img } = item;
        return {
          id,
          logo: `https://images.weserv.nl/?url=${img}`,
          hasScepter: false,
          hasShard: false,
          guid: this.guid()
        }
      });
      return normalList;
    },
    // 获取可升级的技能列表
    getUpgradeList(abilities = []) {
      // 魔晶碎片
      const skillShard = JSON.parse(JSON.stringify((abilities.find((item: any) => item.ability_has_shard || item.ability_is_granted_by_shard) || {}))) as any;
      skillShard.ability_type = 'shard';
      // 神杖
      const skillScepter = JSON.parse(JSON.stringify(((abilities.find((item: any) => item.ability_has_scepter || item.ability_is_granted_by_scepter) || {})))) as any;
      skillScepter.ability_type = 'scepter';
      const upgradeList = [skillShard, skillScepter].map((item: any) => {
        const { ability_has_scepter, ability_has_shard, ability_is_granted_by_scepter, ability_is_granted_by_shard, img, id, name_loc, ability_type } = item;
        return {
          id,
          name_loc,
          logo: `https://images.weserv.nl/?url=${img}`,
          guid: this.guid(),
          ability_type,
          hasScepter: ability_has_scepter || ability_is_granted_by_scepter,
          hasShard: ability_has_shard || ability_is_granted_by_shard,
        }
      });
      return upgradeList;
    },
    // 获取技能图标列表
    getSkillLogoList() {
      const { heroes } = this.properties;
      const { abilities = [] } = heroes;
      // 普通技能
      const normalList: any = this.getNormalList(abilities);
      // 升级技能
      const upgradeSkillList: any = this.getUpgradeList(abilities);
      const logoSkillList = normalList.concat(...upgradeSkillList);
      this.setData({
        skillLogoList: logoSkillList,
        selectSkillId: logoSkillList[0].guid
      });
      this.getSkillDetail(logoSkillList[0].id);
    },
    // 技能其他信息
    getSpecialValues(specialValues = [], skill: any) {
      const { ability_has_shard, ability_has_scepter } = skill;
      const list: IOption[] = [];
      if (this.data.selectSkillIndex > 3 && (ability_has_shard || ability_has_scepter)) {
        return [];
      }
      specialValues.forEach((item: any) => {
        const { heading_loc = '' } = item;
        if (heading_loc) {
          list.push({ label: heading_loc, value: this.getFixedOrInt(item) });
        }
      });
      return list;
    },
    // 获取技能显示文本
    getFixedOrInt(item: any) {
      const { values_float = [], values_int = [], is_percentage } = item || {};
      const initList = values_float.length > 0 ? values_float : values_int;
      const valueList = initList.map((item: any) => {
        const numberValue = values_float.length > 0 ? item.toFixed(1) : item;
        return is_percentage ? `${numberValue}%` : numberValue;
      });
      return valueList.join(' / ');
    },
    // 获取技能冷却时间和蓝耗
    getCooldownOrManaCosts(cooldowns: number[] = [], isFixed = true) {
      const hasEmpty = cooldowns.every(item => item !== 0);
      if (!hasEmpty) {
        return '';
      }
      const list = cooldowns.map((item: number) => {
        return isFixed ? item.toFixed(1) : item;
      });
      return list.join(' / ')
    },
    // 获取升级技能描述
    getUpgradeText(specialList = [], loc: string) {
      // 正则匹配%%之间的内容
      const locList = (loc.match(/(?<=%).*?(?=%)/g) || []).filter((item: string) => item.match(/\w/));
      if (locList.length === 0) {
        return loc;
      }
      let upgradeText = loc;
      locList.forEach((locItem: string) => {
        const result = specialList.find((item: any) => item.name === locItem);
        const value = this.getFixedOrInt(result);
        upgradeText = upgradeText.replace(`%${locItem}%`, value);
      });
      return upgradeText;
    },
    getUpgradeName(skill: any) {
      const abilitiyType = this.data.abilityTpe;
      const { ability_is_granted_by_scepter, ability_is_granted_by_shard } = skill;
      if (ability_is_granted_by_scepter) {
        return '神杖提供新技能';
      }
      if (ability_is_granted_by_shard) {
        return '魔晶提供新技能';
      }
      if (abilitiyType) {
        return abilitiyType === 'shard' ? '魔晶技能升级' : '神杖技能升级';
      }
      return '';
     },
    // 获取技能详情
    getSkillDetail(skillId: number, hasScepter = false, hasShard = false) {
      const { heroes } = this.properties;
      const { abilities = [] } = heroes;
      const skill: any = {};
      const currentSkill = abilities.find((item: any) => item.id === skillId);
      if (!currentSkill) {
        return;
      }
      const { img, desc_loc, cooldowns = [], mana_costs = [], special_values = [], lore_loc, name_loc, video_mp4, video_shard_mp4, video_scepter_mp4, shard_loc, scepter_loc, ability_is_granted_by_shard, ability_is_granted_by_scepter } = currentSkill;
      skill.logo = `https://images.weserv.nl/?url=${img}`; // 图片
      skill.nameLoc = name_loc; // 技能名称
      skill.hasScepter = hasScepter || ability_is_granted_by_scepter; // 神杖
      skill.hasShard = hasShard || ability_is_granted_by_shard; // 魔晶
      skill.cooldowns = this.getCooldownOrManaCosts(cooldowns); // 冷却时间
      skill.manaCosts = this.getCooldownOrManaCosts(mana_costs, false); // 蓝耗
      skill.specialValues = this.getSpecialValues(special_values, currentSkill); // 技能其他信息
      skill.loreLoc = lore_loc;
      skill.grantedShard = ability_is_granted_by_shard;// 魔晶提供技能
      skill.grantedScepter = ability_is_granted_by_scepter;// 神杖提供技能
      skill.upgradeName = this.getUpgradeName(currentSkill);
      // 神杖
      if (this.data.abilityTpe === 'scepter') {
        skill.video = video_scepter_mp4;
        skill.descLog = this.getUpgradeText(special_values, scepter_loc || desc_loc);
      }
      // 魔晶 
      else if (this.data.abilityTpe === 'shard') {
        skill.video = video_shard_mp4;
        skill.descLog = this.getUpgradeText(special_values, shard_loc || desc_loc);
      } else {
        skill.video = video_mp4;
        skill.descLog = this.getUpgradeText(special_values, desc_loc);
      }
      this.setData({ skillDetail: skill });
    },
    // 技能改变
    changeSkill(event: IEvent) {
      const { currentTarget } = event;
      const skill = currentTarget.dataset.skill;
      const selectSkillIndex = currentTarget.dataset.index;
      const { hasShard, hasScepter, id, guid, ability_type = null} = skill;
      this.setData({ selectSkillId: guid, selectSkillIndex, abilityTpe: ability_type });
      this.getSkillDetail(id, hasScepter, hasShard);
    }
  }
})
