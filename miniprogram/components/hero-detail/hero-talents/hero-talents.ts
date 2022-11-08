// components/hero-detail/hero-talents/hero-talents.ts
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
    talentsList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getAbilities(abilities = []) {
      return abilities.map((item: any) => item.special_values).flat(2);
    },
    getNameLoc(talents = [], abilities: any) {
      const reg = /\{(.+?)\}/gi;
      return talents.map((item: any) => {
        const { name_loc, special_values } = item;
        const attrs = name_loc.split(" ");
        let talentName = null;
        if (attrs.length > 0) {
          let attrValue = null;
          const regResult = attrs[0].match(reg)?.[0];
          const attrName = regResult?.toString()?.replace("{s:", "")?.replace("}", "");
          if (attrs[0].indexOf('value') > -1) {
            const result = special_values.find((specialItem: any) => specialItem.name === "value");
            attrValue = result?.values_float?.[0];
            talentName = name_loc.replace(reg, attrValue);
          } else if (attrs[0].indexOf('_') > -1) {
            const result = abilities.find((abilitiyItem: any) => {
              const { name, bonuses } = abilitiyItem;
              return attrName.indexOf(name) > -1 && bonuses.length > 0;
            });
            if (result) {
              attrValue = result.bonuses[0].value;
              talentName = name_loc.replace(reg, attrValue);
            }
          }else {
            talentName = attrs[0];
          }
        }
        return {
          talentName,
          ...item
        }
      });
    },
    getTalents() {
      let list: any = [];
      const hero = this.properties.heroes;
      const abilities = this.getAbilities(hero.abilities);
      const talentsList = this.getNameLoc(hero.talents, abilities);
      talentsList.forEach((item: any, index: number) => {
        if (index % 2 !== 0) {
          const talents = talentsList.slice(index - 1, index + 1).reverse();
          list.push({
            left: talents[0],
            right: talents[1],
          });
        }
      });
      list = list.map((item: any, index: number) => {
        const initLevel = (index + 2) * 5;
        return {
          ...item,
          level: initLevel
        }
      });
      this.setData({ talentsList: list.reverse() });
    }
  },
  lifetimes: {
    ready() {
      this.getTalents();
    }
  }
})
