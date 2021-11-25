import { IEvent, IResult } from "miniprogram/interface";
import { axios } from "../../utils/index";

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
        axios({
            url: 'https://api.opendota.com/api/teams',
            method: 'GET',
        }).then((res: IResult<any>) => {
            const { data = [], statusCode } = res;
            if (statusCode === 200) {
                this.setData({ teamList: (data as any).filter((item: any) => item.name && item.logo_url).splice(0, 100) })
            }
        });
    },
    toDotaTeamDetail(event: IEvent) {
        const { currentTarget } = event;
        const { team } = currentTarget.dataset;
        wx.navigateTo({
            url: `../dota-team-detail/dota-team-detail?team=${JSON.stringify(team)}`
        })
    }
})