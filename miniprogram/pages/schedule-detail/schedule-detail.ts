import { IResult } from "miniprogram/interface";
import { scheduleMapStatus } from "../../map/index";
import { axios, formatDateTime } from "../../utils/index";

// pages/schedule-detail/schedule-detail.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventSummary: null,
    eventId: 0,
    scrollTop: 0,
    activeTab: "overview",
    scheduleList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    const eventId = options.eventId;
    this.setData({ eventId })
    this.getEventSummary(eventId);
    this.getScheduleMatchList(eventId);
  },

  onPageScroll(event: any) {
    const scrollTop = event.scrollTop;
    this.setData({ scrollTop });
  },

  getEventSummary(eventId: number = 1330) {
    axios({
      url: `https://appengine.wmpvp.com/dota/event/getEventSummary?eventId=${eventId}`
    }).then((res: IResult<any>) => {
      const result = res.data.result;
      result.eventStartTime = formatDateTime(result.eventStartTime, false, ".");
      result.eventEndTime = formatDateTime(result.eventEndTime, false, ".");
      this.setData({ eventSummary: res.data.result })
    })
  },
  getScheduleList(list: any = []) {
    const scheduleList: any = [];
    list.forEach((item: any) => {
      item.initMatchTime = formatDateTime(item.matchTime, true).split(' ')[1];
      item.matchTime = formatDateTime(item.matchTime);
      item.matchStatus = scheduleMapStatus.get(item.matchStatus);
      const result = scheduleList.find((el: any) => formatDateTime(el.matchTime) === item.matchTime);
      if (result) {
        result.children.push(item);
      } else {
        scheduleList.push({
          matchTime: item.matchTime,
          children: [item]
        })
      }
    });
    return scheduleList;
  },
  getScheduleMatchList(eventId: number = 1330) {
    axios({
      url: `https://appengine.wmpvp.com/dota/event/getScheduleMatchList?eventId=${eventId}`
    }).then((res: IResult<any>) => {
      const scheduleList = this.getScheduleList(res.data.result) as any;
      this.setData({ scheduleList })
    })
  }
})