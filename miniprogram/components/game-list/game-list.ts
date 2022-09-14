// components/game-list/game-list.ts
import { IEvent, IResult } from "../../interface";
import { axios, formatDateTime } from "../../utils/index";

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
    initGameList: [],
    gameList: [],
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
    formatDate(dateStr: number) {
      const date = formatDateTime(dateStr, true);
      return {
        date: date.split(" ")?.[0],
        mins: date.split(" ")?.[1],
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
        const { eventId, eventLogo, eventName, matchDate } = item;
        if (!result) {
          list.push({
            anchor: `macth_${item.matchDate}`,
            eventId,
            eventLogo,
            eventName,
            matchDate,
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
            const { date, mins } = this.formatDate(item.matchTime);
            return {
              ...item,
              matchStartTime: mins,
              matchDate: date,
              eventId,
              eventLogo,
              eventName,
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
  },
});
