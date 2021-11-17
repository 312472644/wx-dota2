import { IResult } from "../../interface";

// pages/upgrade-log/upgrade-log.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        html: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.getNews();
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
    onReady() {

    },
    getNews() {
        wx.request({
            url: 'https://www.dota2.com.cn/news/gamepost/news_update/index.htm',
            method: 'GET',
            success: (res: IResult<any>) => {
                const { data, statusCode } = res;
                if (statusCode === 200) {
                    console.log('html', data);
                    this.setData({ html: data as any })
                }
            }
        })
    }
})