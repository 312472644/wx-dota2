import { IResult } from "miniprogram/interface";
import { IHero, IRecentMacth } from "miniprogram/interface/IPage";
import { GameModeMap, GameTypeMap } from "../../map/index";
import { axios, formatDateTime, getHeroCNList, transFormMS } from "../../utils/index"

// components/recent-match-list/recent-match-list.ts
Component({
    options: {
        pureDataPattern: /_/
    },
    /**
     * 组件的属性列表
     */
    properties: {
        pageIndex: {
            type: Number,
            value: 1
        },
        accountId: {
            type: String
        }
    },
    observers: {
        pageIndex(newValue: number) {
            const { _totalMatchList, _totalPage, _pageSize, matchList } = this.data;
            if (newValue <= _totalPage) {
                wx.showLoading({ title: '加载中...' });
                const list = _totalMatchList.slice((newValue - 1) * _pageSize, newValue * _pageSize);
                setTimeout(() => {
                    wx.hideLoading();
                    this.setData({ matchList: matchList.concat(this.transFormRecentList(list) as any) });
                }, 300);
            } else if (newValue > _totalPage && newValue > 1) {
                this.setData({ isloadComplete: true });
            }
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        _totalMatchList: [],
        _pageIndex: 1,
        _pageSize: 20,
        _totalPage: 0,
        _heroList: [],
        matchList: [],
        isloadComplete: false
    },
    lifetimes: {
        async ready() {
            await this.getHeroList();
            this.getRecentList();
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        async getHeroList() {
            const heroList = await getHeroCNList();
            this.setData({ _heroList: heroList as any })
        },
        getRecentList() {
            axios({
                url: `https://api.opendota.com/api/players/${this.properties.accountId}/matches?significant=0`,
                method: 'GET'
            }).then((res: IResult<IRecentMacth[]>) => {
                const { data } = res;
                const pageSize = this.data._pageSize;
                const list = data.slice(0, pageSize);
                const matchList = this.transFormRecentList(list) as any;
                this.setData({
                    matchList: matchList,
                    _totalMatchList: data as any,
                    _totalPage: Math.ceil(data.length / pageSize)
                })
            })
        },
        transFormRecentList(matchList: IRecentMacth[] = []) {
            const heroList = this.data._heroList as IHero[];
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
