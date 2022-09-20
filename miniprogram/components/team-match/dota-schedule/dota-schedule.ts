// components/dota-schedule/dota-schedule.ts
import { IEvent, IResult } from "../../../interface";
import { axios, formatDateTime } from "../../../utils/index";
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    scheduleList: [],
  },
  lifetimes: {
    created() {
      this.getScheduleList();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getScheduleList(pageNum = 1) {
      axios({
        url: "https://appengine.wmpvp.com/dota/event/getEventList",
        data: {
          type: 0,
          pageNum,
          pageSize: 20,
        },
      }).then((res: IResult<any>) => {
        const { result = [], message } = res.data;
        if (message === "success") {
          const list = result.map((item: any) => {
            return {
              ...item,
              startTime: formatDateTime(item.eventStartTime),
              endTime: formatDateTime(item.eventEndTime),
            };
          });
          if (list.length > 0) {
            this.setData({ scheduleList: this.data.scheduleList.concat(list) });
          } else {
            this.triggerEvent("loadComplete");
          }
        }
      });
    },
    toScheduleDetail(event: IEvent) {
      const schedule = event.currentTarget.dataset.schedule;
      wx.navigateTo({
        url: `../../pages/schedule-detail/schedule-detail?eventId=${schedule.id}`
      })
    }
  },
});
