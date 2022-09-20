import { IEvent, IResult } from "miniprogram/interface";
import { scheduleMapStatus } from "../../map/index";
import { axios, formatDateTime } from "../../utils/index";

// pages/team-detail/team-detail.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    teamId: 0,
    teamInfo: null,
    scrollTop: 0,
    pageNum: 1,
    scheduleList: [],
    active: 'overview'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    const { teamId } = options;
    this.setData({ teamId });
    this.getTeamDetail(teamId);
    this.getTeamParticipatedEventList(teamId);
  },
  onReachBottom() {
    if (this.data.active === 'schedule') {
      let pageNum = this.data.pageNum;
      pageNum++;
      this.setData({ pageNum });
      this.getTeamParticipatedEventList(this.data.teamId, pageNum);
    }
  },
  onPageScroll(event: any) {
    const scrollTop = event.scrollTop;
    this.setData({ scrollTop });
  },
  onChange(event: IEvent) { 
    this.setData({ active: event.detail.name });
  },
  getTeamDetail(teamId: string) {
    axios({
      url: `https://appengine.wmpvp.com/dota/team/getDotaTeamSummary?teamId=${teamId}`,
    }).then((res: IResult<any>) => {
      const { result } = res.data;
      result.establishTime = formatDateTime(result.establishTime);
      result.totalBonus = result.totalBonus.toString().replace(/\d(?=(\d{3})+$)/g, "$&,");
      this.setData({ teamInfo: result });
    });
  },
  getScheduleList(list: any = [], eventsList: any = []) {
    const scheduleList: any = [];
    list.forEach((item: any) => {
      const event = eventsList.find((eventItem: any) => item.eventId === eventItem.id)
      item.initMatchTime = formatDateTime(item.matchTime, true).split(' ')[1];
      item.matchTime = formatDateTime(item.matchTime);
      item.matchStatus = scheduleMapStatus.get(item.matchStatus);
      item.eventName = event?.eventName;
      item.eventId = event?.id;
      const result = scheduleList.find((el: any) => formatDateTime(el.matchTime) === item.matchTime);
      if (result) {
        result.children.push(item);
      } else {
        scheduleList.push({
          coverUrl: event?.coverUrl,
          eventName: event?.eventName,
          eventId: event?.id,
          matchTime: item.matchTime,
          children: [item]
        })
      }
    });
    return scheduleList;
  },
  getTeamParticipatedEventList(teamId: number, pageNum = 1) {
    axios({
      url: `https://appengine.wmpvp.com/dota/team/getTeamParticipatedEventList`,
      data: {
        teamId,
        pageNum,
        pageSize: 20,
        type: 0
      }
    }).then((res: IResult<any>) => {
      const eventsList = res.data.result.events;
      const matchList = res.data.result.matchList;
      const scheduleList = this.getScheduleList(matchList, eventsList);
      this.setData({ scheduleList: this.data.scheduleList.concat(scheduleList) })
    })
  }
});
