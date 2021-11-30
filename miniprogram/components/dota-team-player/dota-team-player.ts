import { IEvent, IResult } from "miniprogram/interface";
import { IPlayer } from "miniprogram/interface/IPage";
import { axios } from "../../utils/index";

// components/dota-team-hero/dota-team-hero.ts
Component({
    options: {
        pureDataPattern: /_/,
    },
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
        isAllPlayer: false,
        allPlayerList: [],
        currentPlayerList: [],
        playerList: [],
        _unloadList: [],
        isDelete: false
    },
    lifetimes: {
        ready() {
            this.getPlayerList();
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onChange(event: IEvent) {
            const { detail } = event;
            const { allPlayerList, currentPlayerList } = this.data;
            const list = detail ? this.getPorgess(allPlayerList) : currentPlayerList;
            this.setData({ isAllPlayer: detail, playerList: list as any });
        },
        getPlayerList() {
            const teamId = this.properties.teamId || 15;
            axios({
                url: `https://api.opendota.com/api/teams/${teamId}/players`
            }).then((res: IResult<IPlayer[]>) => {
                const { data } = res;
                const dataList = data.filter(item => item.name !== null);
                const playerList = dataList.filter(item => item.is_current_team_member && item.name !== null);
                // 战队可能解散默认显示所有队员
                if (playerList.length < 5) {
                    this.setData({
                        playerList: this.getPorgess(dataList) as any,
                        isDelete: true,
                        isAllPlayer: true
                    })
                } else {
                    const list = this.getPorgess(playerList) as any;
                    this.setData({
                        playerList: list,
                        currentPlayerList: list,
                        allPlayerList: dataList as any
                    });
                }
            });
        },
        getPorgess(playerList: IPlayer[] = []) {
            const maxPlayed = this.getMaxPlayed(playerList);
            const list = playerList.map((item) => {
                const { games_played, wins, account_id } = item;
                const winText = ((wins / games_played) * 100).toFixed(1);
                return {
                    playedRate: ((games_played / maxPlayed) * 100).toFixed(1).concat('%'),
                    winText,
                    winRate: winText.concat('%'),
                    avatar: `https://www.opendota.com/assets/images/dota2/players/${account_id}.png`,
                    ...item
                }
            });
            return list;
        },
        // 获取最大值
        getMaxPlayed(playerList: IPlayer[]) {
            const playedList = playerList.map((item) => item.games_played);
            const maxPlayed = Math.max(...playedList);
            return maxPlayed;
        },
    }
})
