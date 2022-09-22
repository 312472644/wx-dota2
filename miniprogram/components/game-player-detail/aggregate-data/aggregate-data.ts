import { IResult } from "miniprogram/interface";
import { GameModeMap } from "../../../map/index";
import { dotaMindRequest, formatDateTime, getStorageHeroById, isRadiant } from "../../../utils/index";

// components/game-player-detail/aggregate-data/aggregate-data.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    steamId: Number,
    leaderboardRank: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    showFlag: false,
    winDetail: null,
    mvps: 0,
    winTotal: 0,
    avgPoints: 0,
    winRate: '',
    heroList: [],
    totalList: [],
    matchList: []
  },
  lifetimes: {
    ready() {
      this.init();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      this.getWinLose();
      this.getMatches();
      this.getTotals();
      this.getHeroList();
      this.getLatestPerformances();
    },
    getWinLose() {
      dotaMindRequest(`/players/${this.properties.steamId}/wl?`).then((res: IResult<any>) => {
        const win = res.data.win;
        const lose = res.data.lose;
        const winRate = (win / (win + lose));
        const winRateStr = `${(winRate * 100).toFixed(1)}%`
        this.setData({ winRate: winRateStr, winTotal: win + lose });
      })
    },
    getTotals() {
      dotaMindRequest(`/players/${this.properties.steamId}/totals?`).then((res: IResult<any>) => {
        const totalList = res.data.map((item: any) => {
          const averageValue = item.sum / item.n;
          const value = averageValue >= 1000 ? (averageValue / 1000).toFixed(1).concat('k') : averageValue.toFixed(1)
          return { ...item, value }
        })
        this.setData({ totalList })
      })
    },
    getMatches() { 
      dotaMindRequest(`/players/${this.properties.steamId}/matches?offset=0&limit=20&significant=0&`).then((res: IResult<any>) => {
        const matchList = res.data.map((item: any) => { 
          return {
            ...item,
            win: isRadiant(item.player_slot) ? item.radiant_win : !item.radiant_win,
            game_mode: GameModeMap.get(item.game_mode),
            start_time: formatDateTime(item.start_time * 1000, true),
            heroInfo: getStorageHeroById(item.hero_id)
          }
        }).splice(0, 4);
        this.setData({ matchList });
      })
    },
    getLatestPerformances() {
      dotaMindRequest(`/playerext/${this.properties.steamId}/latestPerformances?limit=50`).then((res: IResult<any>) => {
        this.setData({ mvps: res.data.mvps, avgPoints: res.data.avg_points });
      })
    },
    getHeroList() {
      dotaMindRequest(`/players/${this.properties.steamId}/heroes?hero_limit=3`).then((res: IResult<any>) => {
        const heroList = res.data.map((item:any) => {
          return {
            ...item,
            winRate: ((item.win / item.games) * 100).toFixed(1).concat('%'),
            heroInfo: getStorageHeroById(item.hero_id)
          }
        });
        this.setData({ heroList });
      })
     },
    showMore() {
      this.setData({ showFlag: !this.data.showFlag });
    }
  }
})
