import { ICustom, PageLoad } from "miniprogram/interface";
import { ITeam } from "miniprogram/interface/IPage";

interface IData {
    team: ITeam;
}
// pages/dota-team-detail/dota-team-detail.ts
Page<IData, ICustom>({

    /**
     * 页面的初始数据
     */
    data: {
        team: {
            logo_url: "https://steamcdn-a.akamaihd.net/apps/dota2/images/team_logos/15.png",
            losses: 898,
            name: "PSG.LGD",
            rating: 1598.17,
            tag: "PSG.LGD",
            team_id: 15,
            wins: 1460,
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(query: PageLoad<ITeam>) {
        if (!query) {
            return;
        }
        // console.log(JSON.parse(option.team));
        // console.log(JSON.parse(option));
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
    getPlayerList() { }
})