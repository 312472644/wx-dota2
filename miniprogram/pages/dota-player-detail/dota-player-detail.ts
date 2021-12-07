import { ICustom, IResult, PageLoad } from "miniprogram/interface";
import { IHero, IProfile, IWL } from "miniprogram/interface/IPage";
import { axios, getHeroCNList } from "../../utils/index";
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
    accountId: string;
    activeTab: string;
    heroList: IHero[]
}

// pages/dota-player-detail/dota-player-detail.ts
Page<IData, ICustom>({

    /**
     * 页面的初始数据
     */
    data: {
        heroList: [],
        accountId: '898754153',
        playerInfo: {} as IPlayerInfo,
        recentMatchPageIndex: 1,
        activeTab: 'match',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(query: PageLoad<{ account_id: string }>) {
        if (!query.account_id) {
            return;
        }
        this.setData({ accountId: query.account_id })
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
        this.getHeroList();
        this.getPlayerInfo();
    },
    async getHeroList() {
        const heroList = await getHeroCNList();
        this.setData({ heroList: heroList as any })
    },
    // 获取队员输赢
    getWL() {
        return new Promise((resolve) => {
            axios({
                url: `https://api.opendota.com/api/players/${this.data.accountId}/wl`
            }).then((res: IResult<IWL>) => {
                const { data } = res;
                resolve(data);
            })
        });
    },
    // 获取队员信息
    getPlayerInfo() {
        axios({
            url: `https://api.opendota.com/api/players/${this.data.accountId}`,
            method: 'GET'
        }).then(async (res: IResult<IProfile>) => {
            const { data } = res;
            const { profile, leaderboard_rank } = data;
            const { avatarfull, name } = profile;
            const { win, lose } = await this.getWL();
            this.setData({
                playerInfo: {
                    logo_url: avatarfull,
                    name,
                    wins: win,
                    losses: lose,
                    rank: leaderboard_rank
                }
            })
        })
    }
})