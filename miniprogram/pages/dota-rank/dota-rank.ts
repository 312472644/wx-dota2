import { ICustom, IEvent, IResult } from "miniprogram/interface";
import { IRank, IRankResult } from "miniprogram/interface/IPage";
import { axios } from "../../utils/index";

interface IData {
    tabName: string;
    rankList: IRank[]
}

// pages/rank/rank.ts
Page<IData, ICustom>({

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
        axios({
            url: `http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=${tabName}&leaderboard=0`,
            method: 'GET'
        }).then((res: IResult<IRankResult>) => {
            const rankList = res.data.leaderboard.splice(0, 100);
            this.setData({ rankList })
        })
    }
})