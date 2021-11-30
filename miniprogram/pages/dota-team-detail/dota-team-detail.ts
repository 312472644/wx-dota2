import { ICustom, IEvent, PageLoad } from "miniprogram/interface";
import { ITeam } from "miniprogram/interface/IPage";

interface IData {
    team: ITeam | null;
    activeTab: string;
}
// pages/dota-team-detail/dota-team-detail.ts
Page<IData, ICustom>({

    /**
     * 页面的初始数据
     */
    data: {
        team: null,
        activeTab: 'base'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(query: PageLoad<ITeam>) {
        if (!query) {
            return;
        }
        this.setData({
            team: JSON.parse(query.team as string)
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    // 获取比赛列表
    getMatchList() {

    },
    // 获取英雄列表
    getHeroList() { },
    // 获选选手列表
    getPlayerList() { },
    onChange(event: IEvent) {
        const { detail } = event;
        this.setData({
            activeTab: detail.name
        })
    }
})