import { ICustom, IEvent, IResult } from "miniprogram/interface";
import { ITeam } from "miniprogram/interface/IPage";
import { axios, formatDateTime } from "../../utils/index";

interface IData {
    teamList: ITeam[]
}
// pages/dota-team/dota-team.ts
Page<IData, ICustom>({

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
        }).then((res: IResult<ITeam[]>) => {
            const { data = [] } = res;
            const list = data.filter((item: ITeam) => item.name && item.logo_url).splice(0, 100);
            const teamList = list.map(item => {
                return {
                    ...item,
                    lastMatchTime: formatDateTime(item.last_match_time * 1000)
                }
            });
            this.setData({ teamList: teamList })
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