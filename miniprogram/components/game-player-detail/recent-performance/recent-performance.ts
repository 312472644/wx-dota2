import { IEvent, IResult } from "../../../interface/index";
import { CampMap, GameModeMap, HeroTypeMap, LaneMap, RoleMap, SkillMap } from "../../../map/index";
import { dotaMindRequest } from "../../../utils/index";

// components/game-player-detail/recent-performance/recent-performance.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    steamId: 98887913,
    date: 30,
    dataOptions: [
      { text: '最近一个月', value: 30 },
      { text: '最近三个月', value: 90 },
      { text: '全部', value: '' },
    ],
    performanceList: [],
  },
  /**
   * 组件的方法列表
   */
  methods: {
    formatLabel(type: any, label: any) {
      const map: any = {
        game_mode: GameModeMap.get(label) || '--',
        camp: CampMap.get(label) || '--',
        lane: LaneMap.get(label) || '--',
        skill: SkillMap.get(label) || '--',
        role: RoleMap.get(label) || '--',
        attr: HeroTypeMap.get(label) || '--'
      };
      return map[type]
    },
    dateChange(event: IEvent) {
      this.setData({ date: event.detail });
      this.getPerformance();
    },
    getPerformance() {
      const tableColumn: any = {
        game_mode: '游戏模式',
        camp: '游戏阵营',
        skill: '比赛段位',
        lane: '分路位置',
        role: '英雄定位',
        attr: '英雄属性'
      };
      const params = this.data.date ? `date=${this.data.date}` : '';
      dotaMindRequest(`/players/${this.properties.steamId}/performance?${params}`).then((res: IResult<any>) => {
        const performanceList = res.data.map((item: any) => {
          const stats = item.stats;
          return {
            ...item,
            cloumnList: [tableColumn[item.type], '场次', '胜率'],
            stats: stats.map((el: any) => {
              return {
                ...el,
                label: this.formatLabel(item.type, el.label),
                winRate: (el.winRate * 100).toFixed(1).concat('%')
              }
            })
          };
        });
        this.setData({ performanceList });
      })
    }
  }
})
