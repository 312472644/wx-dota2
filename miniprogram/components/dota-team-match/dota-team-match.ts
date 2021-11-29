import { IResult } from "miniprogram/interface";
import { IMatch } from "miniprogram/interface/IPage";
import { axios } from "../../utils/index";

// components/dota-team-match/dota-team-match.ts
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
        matchList: []
    },
    lifetimes: {
        ready() {
            this.getMatchList();
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getMatchList() {
            const teamId = this.properties.teamId;
            axios({
                url: `https://api.opendota.com/api/teams/${teamId}/matches`,
                method: 'GET'
            }).then((res: IResult<IMatch[]>) => {
                const list = (res.data || []).splice(0, 20)
                const matchList = list.map(item => {
                    const { duration, radiant, radiant_win } = item;
                    return {
                        ...item,
                        radiant: radiant ? '天辉' : '夜魇',
                        radiant_win: radiant ? radiant_win : !radiant_win,
                        duration: this.getDuration(duration)
                    }
                });
                this.setData({
                    matchList: matchList as any
                })
            })
        },
        // 时长转化
        getDuration(duration: number) {
            const mins = Math.floor(duration / 60).toString().padStart(2, '0');
            const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
            return `${mins}:${seconds}`;
        }
    }
})
