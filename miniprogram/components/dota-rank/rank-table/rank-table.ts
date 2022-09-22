import { IEvent } from "miniprogram/interface";

// components/rank-table/rank-table.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tableList: {
      type: Array,
    }
  },
  /**
   * 组件的初始数据
   */
  data: {},
  /**
   * 组件的方法列表
   */
  methods: {
    tapEvent(event: IEvent) {
      const item = event.currentTarget.dataset.item;
      const steamId = item.steam_id_info?.steam_id;
      if (!steamId) {
        wx.showToast({ icon: "none", title: "该玩家没有关联steam账号" });
        return;
      };
      wx.navigateTo({
        url: `../../pages/game-player-detail/game-player-detail?steamId=${steamId}`
      });
    },
  }
})
