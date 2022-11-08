// pages/version-log/version-log.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    versionLogList: [
      {
        versionName: 'v1.2.0',
        versionDate: '2022-11-06',
        bugFixList: ['修复bug若干'],
        featureList: ['新增查询战绩功能','英雄技能页面新增天赋树','部分交互体验优化']
      },
      {
        versionName: 'v1.1.0',
        versionDate: '2022-11-06',
        bugFixList: ['修复赛事页面报错的bug'],
        featureList: ['新增其他页面，包括关于、联系作者、版本日志等功能','新增小程序转发功能']
      },
      {
        versionName: 'v1.0.0',
        versionDate: '2022-10-25',
        bugFixList: [],
        featureList: ['第一个版本上线~', '新增英雄物品功能', '新增赛事功能', '新增发现功能', '新增资讯功能']
      },
    ],
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})