import { IEvent, IResult } from "../../interface/index";
import { dotaMindRequest, getStorageHeroById } from "../../utils/index";

// pages/player-all-heroes/player-all-heroes.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountId: 0,
    profile: {} as any,
    heroList: [],
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
    const accountId = options.accountId;
    if(!accountId) {
      return;
    }
    this.setData({ accountId });
    this.getAllHeros();
  },
  gameModeChange(event: IEvent) {
    const gameMode = event.detail;
    this.setData({ gameMode });
    this.getAllHeros();
  },
  getAllHeros() {
    let query = `/players/${this.data.accountId}/heroes`;
    if (this.data.gameMode !== '') {
      query = query.concat('?game_mode=' + this.data.gameMode);
    }
    dotaMindRequest(query).then((res: IResult<any>) => {
      const heroList = res.data.map((el: any) => {
        const heroInfo = getStorageHeroById(el.hero_id);
        const { kda, gold_per_min, win, games, xp_per_min } = el;
        return {
          ...el,
          kda: kda.toFixed(1),
          gold_per_min: gold_per_min.toFixed(1),
          xp_per_min: xp_per_min.toFixed(1),
          winRate: ((win / games) * 100).toFixed(0).concat('%'),
          heroImageUrl: heroInfo.index_img,
        };
      });
      this.setData({ heroList });
    })
  },
})