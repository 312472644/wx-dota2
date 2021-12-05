import { IResult } from "miniprogram/interface";
import { IHero, ITeamHero } from "miniprogram/interface/IPage";
import { axios } from "../../utils/index";

// components/dota-team-hero/dota-team-hero.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        teamId: {
            type: Number
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        heroList: []
    },
    lifetimes: {
        ready() {
            this.getDotaTeamHeroList();
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getDotaTeamHeroList() {
            const teamId = this.properties.teamId || 15;
            axios({
                url: `https://api.opendota.com/api/teams/${teamId}/heroes?`,
                method: 'GET'
            }).then(async (res: IResult<ITeamHero[]>) => {
                const { data } = res;
                const result = await this.getCNHeroList();
                const cnHeroList = result.data.result.heroes;
                this.setData({
                    heroList: this.getPorgess(data, cnHeroList) as any
                });
            });
        },
        getCNHeroList() {
            return axios({
                url: 'https://www.dota2.com.cn/datafeed/heroList?task=herolist',
                method: 'GET'
            });
        },
        getPorgess(heroList: ITeamHero[], cnHeroList: IHero[]) {
            const maxPlayed = this.getMaxPlayed(heroList);
            const list = heroList.map((item) => {
                const { games_played, wins, hero_id } = item;
                const winText = ((wins / games_played) * 100).toFixed(1);
                const hero = cnHeroList.find((item) => item.id === hero_id);
                return {
                    playedRate: ((games_played / maxPlayed) * 100).toFixed(1).concat('%'),
                    winText,
                    winRate: winText.concat('%'),
                    avatar:`https://images.weserv.nl/?url=${hero?.index_img}`,
                    name: hero?.name_loc,
                    ...item
                }
            });
            return list;
        },
        // 获取最大值
        getMaxPlayed(heroList: ITeamHero[]) {
            const list = heroList.map((item) => item.games_played);
            const maxPlayed = Math.max(...list);
            return maxPlayed;
        },
    }
})
