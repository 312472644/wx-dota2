import { IEvent } from "miniprogram/interface";
import { tabRequest } from "../../utils/index";

// pages/team-match.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    loadComplete: false,
    activeTab: "match",
    showFilter: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() { },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.activeTab === "schedule" && !this.data.loadComplete) {
      const scheduleComponent = this.selectComponent("#schedule");
      let pageNum = this.data.pageNum;
      this.setData({ pageNum: pageNum + 1 });
      scheduleComponent.getScheduleList(pageNum + 1);
    }
  },

  loadComplete() {
    this.setData({ loadComplete: true });
  },
  changeEvent(value: IEvent) {
    const { name } = value.detail;
    this.setData({ activeTab: name });
    if (name === 'schedule') {
      const scheduleComponent = this.selectComponent("#schedule");
      tabRequest(scheduleComponent, 'scheduleList', 'getScheduleList');
    } else if (name === 'rank') {
      const rankComponent = this.selectComponent("#rank");
      tabRequest(rankComponent, 'teamList', 'getTeamList')
    }
  },
  filterTapEvent() {
    this.setData({ showFilter: !this.data.showFilter });
  },
  closeEvent() {
    this.setData({ showFilter: false });
  },
});