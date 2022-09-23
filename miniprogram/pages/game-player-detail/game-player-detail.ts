import { IEvent, IResult } from "miniprogram/interface";
import { axios, getHandlerParam, tabRequest } from "../../utils/index";

// pages/game-player-detail/game-player-detail.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    steamId: 0,
    gamePlayerInfo: null,
    activeTab: 'aggregate-data'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    const steamId = options.steamId;
    this.setData({ steamId });
    this.getPlayerDetail(steamId);
  },

  onChange(event: IEvent) { 
    const tabName = event.detail.name;
    if(tabName === 'recent-performance') {
      const component = this.selectComponent("#recent-performance");
      tabRequest(component, 'performanceList', 'getPerformance');
    } else if (tabName === 'recent-player') {
      const component = this.selectComponent("#recent-player");
      tabRequest(component, 'peerList', 'getPeerList');
    }
    this.setData({ activeTab: tabName });
  },

  getPlayerDetail(steamId: number) { 
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