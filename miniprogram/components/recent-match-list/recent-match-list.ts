import { IResult } from "miniprogram/interface";
import { IHero, IRecentMacth } from "miniprogram/interface/IPage";
import { GameModeMap, GameTypeMap } from "../../map/index";
import { axios, formatDateTime, getHeroCNList, transFormMS } from "../../utils/index"

// components/recent-match-list/recent-match-list.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        matchList: []
    },
    lifetimes: {
        ready() {
            this.getRecentList();
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        async getRecentList(accountId = 898754153) {
            const heroList = await getHeroCNList();
            axios({
                url: `https://api.opendota.com/api/players/${accountId}/matches?significant=0`,
                methods: 'GET'
            }).then((res: IResult<IRecentMacth[]>) => {
                const { data } = res;
                const list = data.splice(0, 20);
                const matchList = this.transFormRecentList(list, heroList as IHero[]) as any;
                this.setData({
                    matchList: matchList
                })
            })
        },
        transFormRecentList(matchList: IRecentMacth[] = [], heroList: IHero[] = []) {
            const list = matchList.map(item => {
                const { hero_id, duration, assists, deaths, kills, player_slot, radiant_win, game_mode, match_id, lobby_type, start_time } = item;
                const heroResult = heroList.find(item => item.id === hero_id);
                const { name_loc, index_img } = heroResult as IHero;
                return {
                    heroName: name_loc,
                    avatar: `https://images.weserv.nl/?url=${index_img}`,
                    gameDuration: transFormMS(duration),
                    kda: `${kills} / ${deaths} / ${assists}`,
                    radiantText: player_slot > 127 ? '天辉' : '夜魇',
                    radiantWin: player_slot > 127 ? radiant_win : !radiant_win,
                    gameMode: `${GameModeMap.get(game_mode)}`,
                    gameType: GameTypeMap.get(lobby_type),
                    matchId: match_id,
                    startTime: formatDateTime(start_time * 1000)
                };
            });
            return list;
        }
    }
})
