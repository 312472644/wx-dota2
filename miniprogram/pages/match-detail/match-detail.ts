import { IEvent, IResult } from "../../interface/index";
import { axios, formatDateTime, formatMillimeter } from "../../utils/index";

// pages/match-detail/match-detail.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    matchId: 0,
    eventId: 0,
    matchResult: null,
    activeMatch: null,
    heroesList: [],
    radiantHeroList: [],
    direHeroList: [],
    activeTab: null,
    scrollTop: 0,
  },
  onPageScroll(event: any) {
    const scrollTop = event.scrollTop;
    this.setData({ scrollTop });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options: any) {
    const { matchId, eventId } = options;
    this.data.eventId = eventId;
    this.data.matchId = matchId;
    await this.getTeamInfoByMatchId(matchId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  async getTeamInfoByMatchId(matchId: number) {
    await axios({
      url: 'https://appengine.wmpvp.com/dota/event/getTeamInfoByMatchId',
      data: { matchId }
    }).then((res: IResult<any>) => {
      const result = res.data.result;
      result.matchTime = formatDateTime(result.matchTime, true);
      const matchStatusList = result.matchStatusList;
      const matchId = matchStatusList[matchStatusList.length - 1].matchId;
      this.setData({ matchResult: res.data.result, activeTab: matchId });
      this.getSteamIdByNid(matchId);
    })
  },
  async getSteamIdByNid(nid: number) {
    await axios({
      url: 'https://appengine.wmpvp.com/dota/event/getSteamIdByNid',
      data: { nid, type: 5 }
    }).then((res: IResult<any>) => {
      const matchId = res.data.result;
      this.getMatches(matchId);
    });
  },
  formatDuration(duration: number) {
    const mins = parseInt((duration / 60).toString());
    const seconds = duration % 60;
    return `${mins} : ${seconds}`;
  },
  getItems(items: any = [], total = 6) {
    const length = items.length;
    const list = [];
    for (let i = 0; i < total - length; i++) {
      list.push({ isEmpty: true });
    }
    return items.concat(list);
  },
  getHeroesList(players: [], matchResult: any, extraResult: any) {
    const heroList = players.map((item: any) => {
      const extra = this.getGold(extraResult, item.hero_id);
      return {
        ...item,
        items: this.getItems(item.items),
        hero_damage: formatMillimeter(item.hero_damage),
        nickname: (matchResult.playerDTOS || []).find((playerItem: any) => playerItem.steamId === item.steam_id64)?.name || item.nickname,
        initGold: extra.gold,
        isExpand: false,
        gem: extra?.gem,
        observer: extra?.observer,
        sentry: extra?.sentry,
        killList: extra.killList,
        campsStacked: extra.campsStacked,
        gold: formatMillimeter(extra.gold),
        role: (extraResult?.players || []).find((subItem: any) => subItem.heroId === item.hero_id)?.role || ''
      }
    });
    return heroList;
  },
  getGold(extraResult: any, heroId: number) {
    const list = (extraResult?.players || []).find((heroItem: any) => heroItem.heroId === heroId)?.playerDataPerMinutes || [];
    return list.length > 0 ? list[list.length - 1] : {};
  },
  getMatches(matchId: number) {
    axios({
      url: 'https://api.wmpvp.com/api/v1/dota2/matches',
      method: 'POST',
      data: {
        platform: 'admin',
        matchId,
      }
    }).then((res: IResult<any>) => {
      const result = res.data.data[0].data;
      const extraResult = res.data.data[1].data;
      const matchResult = this.data.matchResult as any || {};
      const radiantHeroList = this.getHeroesList(result.players.slice(0, 5), matchResult, extraResult) as any;
      const direHeroList = this.getHeroesList(result.players.slice(5, 10), matchResult, extraResult) as any;
      result.duration = this.formatDuration(result.duration);
      result.radiantWin = result.radiant_score > result.dire_score;
      result.radiant_total_gold = formatMillimeter(radiantHeroList.map((item: any) => item.initGold).reduce((a: number, b: number) => a + b));
      result.dire_total_gold = formatMillimeter(direHeroList.map((item: any) => item.initGold).reduce((a: number, b: number) => a + b));

      this.setData({
        activeMatch: res.data.data[0].data,
        radiantHeroList,
        direHeroList
      });
    })
  },
  tabsChange(event: IEvent) {
    const matchId = event.detail.name;
    this.getSteamIdByNid(matchId)
  }
})