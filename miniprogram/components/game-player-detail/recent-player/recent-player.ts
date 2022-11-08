import { IEvent, IResult } from "../../../interface/index"
import { dotaMindRequest, formatDateTime } from "../../../utils/index"

// components/game-player-detail/recent-player/recent-player.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    steamId: Number,
  },

  /**
   * 组件的初始数据
   */
  data: {
    loadComplete: false,
    peerList: []
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getPeerList() { 
      dotaMindRequest(`/players/${this.properties.steamId}/peers`).then((res: IResult<any>) => { 
        const peerList = (res.data || []).map((item:any) => {
          return {
            ...item,
            lastPlayed: formatDateTime((item.last_played * 1000), true),
            winRate: ((item.with_win / item.with_games)*100).toFixed(1).concat('%')
          }
        });
        this.setData({ peerList, loadComplete: true });
      });
    },
    toPlayerDetail(event: IEvent) {
      const accountId = event.currentTarget.dataset.player.account_id;
      wx.navigateTo({
        url: `../../pages/game-player-detail/game-player-detail?steamId=${accountId}`
      });
    }
  }
})
