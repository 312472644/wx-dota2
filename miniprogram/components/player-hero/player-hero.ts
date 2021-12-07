import { IResult } from "miniprogram/interface";
import { IHero, IPlayerHero } from "miniprogram/interface/IPage";
import { axios, formatDateTime } from "../../utils/index";

// components/player-hero/player-hero.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        accountId: {
            type: String
        },
        heroList: {
            type: Array
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        playerHeroList: []
    },
    lifetimes: {
        ready() {
            this.getPlayerHeroList();
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getPlayerHeroList() {
            const accountId = this.properties.accountId || 898754153;
            axios({
                url: `https://api.opendota.com/api/players/${accountId}/heroes`,
                method: 'GET'
            }).then((res: IResult<IPlayerHero[]>) => {
                const { data } = res;
                const list = this.transFormPlayerHeroList(data.slice(0, 20));
                this.setData({
                    playerHeroList: list as any
                })
            })
        },
        transFormPlayerHeroList(data: IPlayerHero[] = []) {
            const heroList = this.properties.heroList as IHero[];
            const list = data.map(item => {
                const { hero_id, games, win, with_games, with_win, against_games, against_win, last_played } = item;
                const heroResult = heroList.find(item => item.id.toString() === hero_id);
                const { name_loc, index_img } = heroResult as IHero;
                return {
                    heroName: name_loc,
                    avatar: `https://images.weserv.nl/?url=${index_img}`,
                    games,
                    withGames: with_games,
                    winRate: `${((win / games) * 100).toFixed(1)}%`,
                    withWinRate: `${((with_win / with_games) * 100).toFixed(1)}%`,
                    againstGames: against_games,
                    againstWinRate: `${((against_win / against_games) * 100).toFixed(1)}%`,
                    startTime: formatDateTime(last_played * 1000)
                }
            });
            return list;
        }
    }
})
