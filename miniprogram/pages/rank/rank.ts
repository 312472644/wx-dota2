import { IEvent, IResult } from "miniprogram/interface";

// pages/rank/rank.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabName: 'china',
        rankList: []
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
        this.getRankList();
    },

    changeEvent(event: IEvent) {
        const { detail } = event;
        this.setData({ tabName: detail.name });
        this.getRankList(detail.name);
    },
    getRankList(tabName: string = 'china') {
        wx.showLoading({ title: '加载中...' });
        wx.request({
            url: `http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=${tabName}&leaderboard=0`,
            method: 'GET',
            success: (res: IResult<any>) => {
                const { data, statusCode } = res;
                if (statusCode === 200) {
                    this.setData({ rankList: (data as any).leaderboard.splice(0, 100) })
                } else {
                    wx.showToast({ title: "获取数据失败", icon: "error" });
                }
            },
            complete: () => {
                wx.hideLoading();
            }
        })
    }
})