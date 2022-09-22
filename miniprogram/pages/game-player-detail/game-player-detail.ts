import { IEvent, IResult } from "miniprogram/interface";
import { axios, getHandlerParam } from "../../utils/index";

// pages/game-player-detail/game-player-detail.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    steamId: 0,
    gamePlayerInfo: null,
    activeTab: 'recent-performance'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    const steamId = options.steamId;
    this.setData({ steamId: 98887913 });
    this.getPlayerDetail(steamId);
  },

  onChange(event: IEvent) { 
    this.setData({ activeTab: event.detail.name });
  },

  getPlayerDetail(steamId: number = 98887913) { 
    axios({
      url: "https://apidota.gamesmind.com/handler",
      method: 'POST',
      data: getHandlerParam(`/players/${steamId}`),
    }).then((res: IResult<any>) => {
      const result = res.data;
      this.setData({ gamePlayerInfo: result });
     })
  }
})