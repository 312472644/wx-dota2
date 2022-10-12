import { IEvent } from "../../../interface/index";

// components/schedule-detail/schedule-list/schedule-list.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    eventId: Number,
    scheduleList: Array
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
    toScheduleDetail(event: IEvent) {
      const { matchId } = event.currentTarget.dataset.schedule;
      wx.navigateTo({
        url: `../../pages/match-detail/match-detail?eventId=${this.properties.eventId}&matchId=${matchId}`
      })
    },
    toAwayTeamDetail(event: IEvent) {
      const teamId = event.currentTarget.dataset.team.awayId;
      wx.navigateTo({
        url: `../../pages/team-detail/team-detail?teamId=${teamId}`
      })
    },
    toHomeTeamDetail(event: IEvent) {
      const teamId = event.currentTarget.dataset.team.homeId;
      wx.navigateTo({
        url: `../../pages/team-detail/team-detail?teamId=${teamId}`
      })
    }
  }
})
