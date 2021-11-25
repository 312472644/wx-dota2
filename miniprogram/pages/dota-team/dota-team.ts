import { IEvent, IResult } from "miniprogram/interface";

// pages/dota-team/dota-team.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        teamList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.getTeamList();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    getTeamList() {
        wx.showLoading({ title: '加载中...' });
        wx.request({
            url: 'https://api.opendota.com/api/teams',
            method: 'GET',
            success: (res: IResult<any>) => {
                const { data = [], statusCode } = res;
                if (statusCode === 200) {
                    this.setData({ teamList: (data as any).filter((item: any) => item.name && item.logo_url).splice(0, 100) })
                }
            },
            complete: () => {
                wx.hideLoading();
            }
        })
    }
})