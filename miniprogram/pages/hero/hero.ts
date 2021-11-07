import { HeroTypeEnum, HeroComplexEnum, PropEnum } from "../../enum/index";
import { IEvent } from "../../interface";
// pages/hero/hero.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    attrList: [
      { label: "全部属性", value: PropEnum.All },
      { label: "力量", value: HeroTypeEnum.Power },
      { label: "智力", value: HeroTypeEnum.Intellect },
      { label: "敏捷", value: HeroTypeEnum.Agile },
    ],
    complexList: [
      { label: "全部难度", value: PropEnum.All },
      { label: "简单", value: HeroComplexEnum.Simple },
      { label: "中等", value: HeroComplexEnum.Normal },
      { label: "困难", value: HeroComplexEnum.Hard },
    ],
    attrValue: PropEnum.All, // 属性值
    complex: PropEnum.All // 难度值
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
  onReachBottom() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() { },
  bindInputEvent(e: any) {
    console.log("inupt", e.detail.value);
  },
  // 属性change事件
  selectAttrChange(event: IEvent) {
    console.log('value', event.detail.value);
  },
  selectComplexChange(event: IEvent) {
    console.log('value', event.detail.value);
  }
});
