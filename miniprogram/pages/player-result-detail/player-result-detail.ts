import { IResult } from "miniprogram/interface";
import { axios, formatMillimeter } from "../../utils/index";

// pages/player-result-detail/player-result-detail.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    matchDetail: null,
    uid: 0,
    matchId:0,
    steamId:0,
    nickUrl: null,
    nickName: null,
    direHeroList: [],
    radiantHeroList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option: any) {
    const { matchId, steamId, nickName, nickUrl, uid } = option;
    this.setData({ steamId, nickName, nickUrl, uid });
    this.getMatch(matchId);
  },
  getItems(items: any = [],total = 6) { 
    const length = items.length;
    const list = [];
    for (let i = 0; i < total - length; i++) { 
      list.push({ isEmpty: true });
    }
    return items.concat(list);
  },
  getHeroesList(players: [], extraResult: any) {
    const heroList = players.map((item: any) => {
      const extra = this.getGold(extraResult, item.hero_id);
      return {
        ...item,
        items: this.getItems(item.items),
        hero_damage: formatMillimeter(item.hero_damage),
        initGold: extra.gold || item.gold,
        isExpand: false,
        gem: extra?.gem,
        observer: extra?.observer,
        sentry: extra?.sentry,
        killList: extra.killList,
        campsStacked: extra.campsStacked,
        gold: formatMillimeter(extra?.gold) || item.gold,
        role: extraResult?.players?.find((subItem: any) => subItem.heroId === item.hero_id).role
      }
    });
    return heroList;
  },
  formatDuration(duration: number) {
    const mins = parseInt((duration / 60).toString());
    const seconds = duration % 60;
    return `${mins}：${seconds}`;
  },
  getGold(extraResult: any, heroId: number) {
    const list = extraResult?.players?.find((heroItem: any) => heroItem.heroId === heroId).playerDataPerMinutes || [];
    return list.length > 0 ? list[list.length - 1] : [];
  },
  getMatch(matchId: number) {
    axios({
      url: "https://api.wmpvp.com/api/v1/dota2/matches",
      method: "POST",
      data: {
        matchId,
        platform: "admin"
      }
    }).then((res: IResult<any>) => {
      const result = res.data.data[0].data;
      const extraResult = res.data.data[1].data || [];
      const radiantHeroList = this.getHeroesList(result.players.slice(0, 5),  extraResult) as any;
      const direHeroList = this.getHeroesList(result.players.slice(5, 10),  extraResult) as any;
      result.duration = this.formatDuration(result.duration);
      result.radiantWin = result.radiant_score > result.dire_score;
      result.radiant_total_gold = formatMillimeter(radiantHeroList.map((item: any) => item.initGold).reduce((a: number, b: number) => a + b));
      result.dire_total_gold = formatMillimeter(direHeroList.map((item: any) => item.initGold).reduce((a: number, b: number) => a + b));
      // const matchDetail = res.data.data[0].data;
      // matchDetail.duration = transFormMS(matchDetail.duration);
      // const radiantHeroList = matchDetail.players.slice(0, 5);
      // const direHeroList = matchDetail.players.slice(5, 10);
      this.setData({ matchDetail: res.data.data[0].data, radiantHeroList, direHeroList });
    })
  }
})