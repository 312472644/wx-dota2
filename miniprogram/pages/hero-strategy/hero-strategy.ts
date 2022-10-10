import { IResult } from "miniprogram/interface";
import { axios, transFormMS } from "../../utils/index";

// pages/hero-strategy/hero-strategy.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    strategyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option: any) {
    wx.setNavigationBarTitle({ title: '英雄攻略' });
    this.getStrategyList(option.heroId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  getStrategyList(heroId: number = 8) {
    axios({
      url: `https://api.wmpvp.com/api/v1/dota2/hero/match?heroId=${heroId}`
    }).then((res: IResult<any>) => {
      const strategyList = res.data.data.map((item: any) => {
        const lastInventory = item.lastInventory.map((el: any) => {
          return {
            ...el,
            time: transFormMS(el.time)
          }
        });
        return { ...item, lastInventory }
      });
      this.setData({ strategyList });
    })
  }
})