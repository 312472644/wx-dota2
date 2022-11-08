import { IEvent, IResult } from "../../../interface/index";
import { axios } from "../../../utils/index";

// components/dota-rank/rank-version/rank-version.ts
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
    version: '',
    level: '统帅',
    rankVersionList: [],
    levelOptions: [
      { text: '先锋', value: '先锋' },
      { text: '卫士', value: '卫士' },
      { text: '中军', value: '中军' },
      { text: '统帅', value: '统帅' },
      { text: '传奇', value: '传奇' },
      { text: '万古', value: '万古' },
      { text: '超凡', value: '超凡' },
      { text: '冠绝', value: '冠绝' },
    ],
    versionOptions: [],
  },
  /**
   * 组件的方法列表
   */
  methods: {
    versionChange(event: IEvent) {
      const name = event.detail;
      this.setData({ version: name });
      this.getRankVersion();
    },
    levelChange(event: IEvent) {
      const name = event.detail;
      this.setData({ level: name });
      this.getRankVersion();
    },
    getVersionList() {
      axios({
        url: 'https://gwapi.pwesports.cn/appdatacenter/api/v2/dota2/rank/versions',
      }).then((res: IResult<any>) => {
        const versionList = res.data.result.map((item: string) => {
          return {
            text: item,
            value: item
          }
        });
        this.setData({ versionOptions: versionList, version: versionList[versionList.length - 1].value });
        this.getRankVersion();
      })
    },
    getRankVersion() {
      axios({
        url: 'https://gwapi.pwesports.cn/appdatacenter/api/v2/dota2/rank/hero',
        data: {
          version: this.data.version,
          rank: this.data.level
        }
      }).then((res: IResult<any>) => {
        const rankVersionList = (res.data.result || []).map((item: any) => {
          return {
            ...item,
            hero_win_rate: `${(item.hero_win_rate * 100).toFixed(1)}%`,
            hero_picks_rate: `${(item.hero_picks_rate * 100).toFixed(1)}%`,
            sum_hero_matches: `${parseInt((item.sum_hero_matches / 1000).toString())}k`
          }
        });
        this.setData({ rankVersionList });
      })
    },
    toHeroDetail(event: IEvent) {
      const hero = event.currentTarget.dataset.hero;
      wx.navigateTo({
        url: `../hero-detail/hero-detail?id=${hero.hero_id}&name=${hero.hero_name}`
      });
     }
  }
})
