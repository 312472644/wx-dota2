import { IResult } from "miniprogram/interface";
import { IHero, IRecentMacth } from "miniprogram/interface/IPage";
import { GameModeMap, GameTypeMap } from "../../map/index";
import { axios, formatDateTime, transFormMS } from "../../utils/index";

// components/player-record/player-record.ts
Component({
    options: {
        pureDataPattern: /_/
    },
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
        _heroList: [],
        recordList: []
    },
    lifetimes: {
        ready() {
            this.getRecordList();
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getRecordList() {
            const accountId = this.properties.accountId || 898754153;
            axios({
                url: `https://api.opendota.com/api/players/${accountId}/matches?sort=kills&limit=20`,
                method: 'GET'
            }).then((res: IResult<IRecentMacth[]>) => {
                const { data } = res;
                const recordList = this.transFormRecordList(data) as any;
                this.setData({ recordList })
            })
        },
        transFormRecordList(matchList: IRecentMacth[] = []) {
            const heroList = this.properties.heroList as IHero[];
            const list = matchList.map(item => {
                const { hero_id, duration, assists, deaths, kills, player_slot, radiant_win, game_mode, match_id, lobby_type, start_time } = item;
                const heroResult = heroList.find(item => item.id === hero_id);
                const { name_loc, index_img } = heroResult as IHero;
                return {
                    kills,
                    heroName: name_loc,
                    avatar: `https://images.weserv.nl/?url=${index_img}`,
                    gameDuration: transFormMS(duration),
                    kda: `${kills} / ${deaths} / ${assists}`,
                    radiantText: player_slot > 127 ? '夜魇' : '天辉',
                    radiantWin: player_slot > 127 ? !radiant_win : radiant_win,
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
