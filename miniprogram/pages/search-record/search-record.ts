import { IEvent, IResult } from "../../interface/index";
import { dotaMindRequest } from "../../utils/index";
import { BigNumber } from "bignumber.js";

// pages/search-record/search-record.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.setRecordList();
  },
  setRecordList() {
    const searchRecord = wx.getStorageSync('searchRecord');
    if (searchRecord) {
      this.setData({ recordList: JSON.parse(searchRecord) });
    }
  },
  clearRecord() {
    const _this = this;
    wx.showModal({
      content: '是否删除历史记录?',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('searchRecord');
          _this.setData({ recordList: [] });
        }
      }
    });
  },
  setStorage(value: any) {
    let searchRecord = wx.getStorageSync('searchRecord');
    if (!searchRecord) {
      const list = [value];
      wx.setStorageSync('searchRecord', JSON.stringify(list));
    } else {
      searchRecord = JSON.parse(searchRecord) || [];
      const flag = searchRecord.some((item: string) => item === value);
      if (!flag) {
        searchRecord.push(value);
      }
      wx.setStorageSync('searchRecord', JSON.stringify(searchRecord));
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
      this.setStorage(steamId);
      wx.navigateTo({
        url: `../../pages/game-player-detail/game-player-detail?steamId=${steam32Id}`
      });
    } else {
      wx.showToast({ icon: "none", title: "未找到该Steam ID数据" });
    }
  },
  tagTapEvent(event: IEvent) {
    const steamId = event.currentTarget.dataset.item;
    const steam64Id = new BigNumber(steamId);
    const steam32Id = steam64Id.minus('76561197960265728').toNumber();
    wx.navigateTo({
      url: `../../pages/game-player-detail/game-player-detail?steamId=${steam32Id}`
    });
   }
})