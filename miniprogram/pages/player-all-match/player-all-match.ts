import { GameModeMap } from "../../map/index";
import { IEvent, IResult } from "../../interface/index";
import { dotaMindRequest, formatDateTime, getStorageHeroById, isRadiant } from "../../utils/index"

// pages/player-all-match/toAllHeroes.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    offset: 0,
    profile: {} as any,
    summary: null,
    matchList: [],
    gameMode: '',
    gameModeOptions: [
      { text: "全部比赛", value: '' },
      { text: "全英雄选择(BP)", value: 22 },
      { text: "队长模式", value: 2 },
      { text: "随机征召", value: 3 },
      { text: "单一征召", value: 4 },
      { text: "其他", value: 0 },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    const profile = JSON.parse(options.profile);
    this.setData({ profile });
    this.getMatchList();
    this.getSummary();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let offset = this.data.offset;
    offset = offset + 20;
    this.setData({ offset });
    this.getMatchList();
  },
  toMatchDetail(event: IEvent) {
    const match = event.currentTarget.dataset.match;
    const { avatarfull, account_id, name, steamid, personaname } = this.data.profile as any || {};
    wx.navigateTo({
      url: `../player-result-detail/player-result-detail?matchId=${match.match_id}&steamId=${account_id}&nickUrl=${avatarfull}&nickName=${name || personaname}&uid=${steamid}`
    });
  },
  gameModeChange(event: IEvent) {
    const gameMode = event.detail;
    this.setData({ gameMode, matchList: [] });
    this.getMatchList();
  },
  getMatchList() {
    let query = `/players/${this.data.profile.account_id}/matches?offset=${this.data.offset}&limit=20&significant=0&`;
    if (this.data.gameMode !== '') {
      query = query.concat('game_mode=' + this.data.gameMode);
    }
    dotaMindRequest(query).then((res: IResult<any>) => {
      const matchList = res.data.map((item: any) => {
        const heroInfo = getStorageHeroById(item.hero_id);
        return {
          ...item,
          win: isRadiant(item.player_slot) ? item.radiant_win : !item.radiant_win,
          gameModeName: GameModeMap.get(item.game_mode),
          heroName: heroInfo.name_loc,
          matchDate: formatDateTime(item.start_time * 1000, true),
          heroImageUrl: heroInfo.index_img,
        };
      });
      if (matchList.length > 0) {
        const initMatchList = this.data.matchList;
        this.setData({ matchList: initMatchList.concat(matchList) });
      }
    });
  },
  getSummary() {
    dotaMindRequest(`/players/${this.data.profile.account_id}/wl?`).then((res: IResult<any>) => {
      const { lose, win } = res.data;
      const total = lose + win;
      const summary: any = {
        total,
        win,
        lose,
        winRate: ((win / total) * 100).toFixed(2).concat('%'),
      };
      this.setData({ summary: summary });
    });
  }
})