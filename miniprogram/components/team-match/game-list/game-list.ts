// components/game-list/game-list.ts
import { IEvent, IResult } from "../../../interface";
import { axios, formatDateTime, transFormMS } from "../../../utils/index";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showFilter: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollIntoView: "",
    eventId: "",
    status: "",
    originList: [],
    initGameList: [],
    gameList: [],
    gameHeroList: [],
    gameOptions: [],
    statusList: [
      { text: "全部状态", value: "" },
      { text: "未开始", value: "1" },
      { text: "进行中", value: "2" },
      { text: "已结束", value: "3" },
    ],
  },
  lifetimes: {
    ready() {
      this.getGameList();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    statusEvent(event: IEvent) {
      const { status } = event.currentTarget.dataset;
      this.setData({ status: status.value });
    },
    matchChangeEvent(event: IEvent) {
      const eventId = event.detail;
      this.setData({ eventId });
    },
    getWeek(date: string) {
      const day = new Date(date).getDay();
      const mapDay: any = {
        0: '周日',
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六',
      };
      return mapDay[day];
    },
    formatDate(dateStr: number) {
      const date = formatDateTime(dateStr, true);
      const dateList = date.split(" ");
      const mins = dateList?.[1].split(":");
      mins.pop();
      return {
        week: this.getWeek(date),
        date: `${dateList?.[0]}`,
        mins: mins.join(" : ")
      };
    },
    formatStatus(status: number) {
      const map = new Map();
      map.set(1, "未开始");
      map.set(2, "进行中");
      map.set(3, "已结束");
      return map.get(status);
    },
    cancelEvent() {
      this.triggerEvent("close");
    },
    getHeroList(matchId: number, result = []) {
      const originList = this.data.initGameList;
      originList.forEach((item: any) => {
        if (item.matchId === matchId) {
          item.showHeros = !item.showHeros;
          item.heroList = item.heroList.length > 0 ? item.heroList : result;
        }
      });
      this.setData({ gameList: this.getCategoryList(originList) as any });
    },
    getMatchHeroes(event: IEvent) {
      const team = event.currentTarget.dataset.team;
      if (team.matchStatus !== 3) {
        return;
      }
      const originList = this.data.initGameList;
      const result = originList.find(
        (item: any) => item.matchId === team.matchId
      ) as any;
      if (result.heroList.length > 0) {
        this.getHeroList(team.matchId);
        return;
      } else {
        axios({
          url: `https://gwapi.pwesports.cn/eventcenter/app/dota/match/detail?matchId=${team.matchId}`,
        }).then((res: IResult<any>) => {
          const result = res.data.result;
          this.getHeroList(team.matchId, result);
        });
      }
    },
    confirmEvent() {
      const initGameList = this.data.initGameList;
      let resultList = initGameList.filter(
        (item: any) => item.eventId === this.data.eventId
      );
      if (this.data.status) {
        resultList = resultList.filter(
          (item: any) => item.matchStatus.toString() === this.data.status
        );
      }
      const gameList = (this.getCategoryList(resultList) || []) as any;
      this.setData({
        gameList,
      });
      this.cancelEvent();
    },
    getQueryTime() {
      const date = new Date();
      const years = date.getFullYear();
      const mothon = date.getMonth() + 1;
      const days = [1, 3, 5, 7, 8, 10, 12].includes(mothon) ? 31 : 30;
      const mothonStr = `${years}-${mothon.toString().padStart(2, "0")}`;
      return {
        startTime: `${mothonStr}-01 00:00:00`,
        endTime: `${mothonStr}-${days} 23:59:59`,
      };
    },
    getCategoryList(dataList = []) {
      const list: any[] = [];
      dataList.forEach((item: any) => {
        const result = list.find(
          (subItem) => subItem.matchDate === item.matchDate
        );
        const { eventId, eventLogo, eventName, matchDate,week } = item;
        if (!result) {
          list.push({
            anchor: `macth_${item.matchDate}`,
            eventId,
            eventLogo,
            eventName,
            matchDate,
            week,
            children: [item],
          });
        } else {
          result.children.push(item);
        }
      });
      return list;
    },
    getGameList() {
      axios({
        url:
          "https://gwapi.pwesports.cn/eventcenter/dota/event/getEventListByPeriod",
        data: this.getQueryTime(),
      }).then((res: IResult<any>) => {
        const { message, result = [] } = res.data;
        if (message === "success") {
          const {
            eventId,
            eventLogo,
            eventName,
            matchDTOList = [],
          } = result[0];
          const gameOptions = result.map((item: any) => {
            return {
              text: item.eventName,
              value: item.eventId,
            };
          });
          const gameList = matchDTOList.map((item: any) => {
            const { date, mins, week } = this.formatDate(item.matchTime);
            return {
              ...item,
              matchStartTime: mins,
              matchDate: date,
              eventId,
              eventLogo,
              eventName,
              showHeros: false,
              heroList: [],
              week: week,
              matchTime: transFormMS(item.matchTime),
              statusText: this.formatStatus(item.matchStatus),
            };
          });
          const list = this.getCategoryList(gameList);
          this.setData({
            eventId: gameOptions[0].value,
            gameList: list as any,
            initGameList: JSON.parse(JSON.stringify(gameList)),
            gameOptions,
            scrollIntoView: `macth_${formatDateTime(+new Date())}`,
          });
        }
      });
    },
    toMatchDetail(event: IEvent) {
      const team = event.currentTarget.dataset.team;
      if (team.matchStatus !== 3) {
        wx.showToast({ title: '比赛还在进行中或未开始', icon: 'none' });
        return;
      }
      wx.navigateTo({
        url: `../../pages/match-detail/match-detail?eventId=${team.eventId}&matchId=${team.matchId}`,
      });
    },
  },
});
