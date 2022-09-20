import { IEvent } from "miniprogram/interface";

// components/schedule-detail/schedule-overview/schedule-overview.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    teamList: Array
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toTeamDetail(event: IEvent) {
      const teamId = event.currentTarget.dataset.team.id;
      wx.navigateTo({
        url: `../../pages/team-detail/team-detail?teamId=${teamId}`
      })
    }
  }
})
