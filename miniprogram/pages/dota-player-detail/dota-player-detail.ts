import { ICustom, IResult } from "miniprogram/interface";
import { IProfile } from "miniprogram/interface/IPage";
import { axios } from "../../utils/index";
interface IPlayerInfo {
    logo_url: string;
    wins: number;
    losses: number;
    name: string;
    rank: number;
}

interface IData {
    playerInfo: IPlayerInfo;
    recentMatchPageIndex: number;
    activeTab: string;
}

// pages/dota-player-detail/dota-player-detail.ts
Page<IData, ICustom>({

    /**
     * 页面的初始数据
     */
    data: {
        playerInfo: {} as IPlayerInfo,
        recentMatchPageIndex: 1,
        activeTab: 'category',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

    },
    onReachBottom() {
        if (this.data.activeTab === 'match') {
            const { recentMatchPageIndex } = this.data;
            const pageIndex = recentMatchPageIndex + 1;
            this.setData({
                recentMatchPageIndex: pageIndex
            });
        }
    },
    onReady() {
        this.getPlayerInfo();
    },
    // 获取队员信息
    getPlayerInfo() {
        axios({
            url: 'https://api.opendota.com/api/players/898754153',
            method: 'GET'
        }).then((res: IResult<IProfile>) => {
            const { data } = res;
            const { profile, leaderboard_rank } = data;
            const { avatarfull, name } = profile;
            this.setData({
                playerInfo: {
                    logo_url: avatarfull,
                    name,
                    wins: 0,
                    losses: 0,
                    rank: leaderboard_rank
                }
            })
        })
    }
})