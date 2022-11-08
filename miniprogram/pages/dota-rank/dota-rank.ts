import { IEvent, IResult } from "../../interface/index";
import { IRankResult } from "../../interface/IPage";
import { axios, dotaMindRequest, getDotaMaxQueryParam, tabRequest } from "../../utils/index";
import BigNumber from 'bignumber.js';
import JsonBigInt from 'json-bigint';

// pages/rank/rank.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabName: "rank",
    rankList: [],
    scrollTop: 0,
    steamId: null,
    regionId: 'china',
    regionOptions: [
      { text: "国服", value: 'china' },
      { text: "美洲", value: 'americas' },
      { text: "欧洲", value: 'europe' },
      { text: "东南亚", value: 'se_asia' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() { },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getRankList();
  },
  changeEvent(event: IEvent) {
    const { detail } = event;
    this.setData({ tabName: detail.name });
    if (detail.name === 'version') {
      const versionComponent = this.selectComponent("#version");
      tabRequest(versionComponent, 'versionOptions', 'getVersionList');
    }
  },
  reginonChange(event: IEvent) {
    this.getRankList(event.detail);
  },
  getRankList(division: string = "china") {
    axios({
      url: `https://api.maxjia.com/api/player/ladder`,
      data: {
        division,
        ...getDotaMaxQueryParam(),
      },
      method: "GET",
    }).then((res: IResult<IRankResult>) => {
      const { status, result } = res.data;
      if (status === "ok") {
        const rankList = result.list
          .map((item: any) => {
            return {
              ...item,
              rank_img_url: item?.steam_id_info?.rank_img_url || null,
              avatar_url: item?.steam_id_info?.avatar_url || null,
            };
          })
          .splice(0, 100) as any;
        this.setData({ rankList });
      }
    });
  },
  onShareAppMessage() {
    return {
      title: 'Dota2 天梯排行',
      path: 'pages/dota-rank/dota-rank',
    }
  },
  async isValidSteamId(steamId: number) {
    let isValid = false;
    await dotaMindRequest(`/players/${steamId}/wl?`).then((res: IResult<any>) => {
      isValid = res.data.win > 0 || res.data.lose > 0;
    });
    return isValid;
  },
  async searchEvent(event: IEvent) {
    const steamId = event.detail;
    if (!steamId) {
      return;
    }
    if (!Number.isInteger(Number(steamId))) {
      wx.showToast({ icon: "none", title: "Steam ID格式不正确" });
      return;
    }
    const steam64Id = new BigNumber(steamId);
    const steam32Id = steam64Id.minus('76561197960265728').toNumber();
    const isValid = await this.isValidSteamId(steam32Id);
    if (isValid) {
      wx.navigateTo({
        url: `../../pages/game-player-detail/game-player-detail?steamId=${steam32Id}`
      });
    } else {
      wx.showToast({ icon: "none", title: "未找到该Steam ID数据" });
    }
  }
});
