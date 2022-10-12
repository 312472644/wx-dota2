import { IEvent, IResult } from "../../../interface/index";
import { axios } from "../../../utils/index";

// components/schedule-detail/schedule-rank/schedule-rank.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    eventId: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    rankInfo: null,
    category: "players",
    tableList: [],
    categoryList: [
      { text: '选手榜', value: "players" },
      { text: '战队榜', value: "teams" },
      { text: '英雄榜', value: "heroes" }
    ],
    columnList: ['选手', '位置', 'KDA'],
    sidebarList: [],
    sidebar: 0,
    sidebarName: "",
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getRankInfo() {
      axios({
        url: `https://appengine.wmpvp.com/dota/event/getRankInfo?eventId=${this.properties.eventId}`
      }).then((res: IResult<any>) => {
        const rankInfo = res.data.result;
        const players = rankInfo.players;
        const scoreDetails = players.scoreDetails[0];
        this.setData({ rankInfo: res.data.result, sidebarList: scoreDetails.detail.slice(0, 50), sidebar: scoreDetails.type });
        this.getTableList();
      })
    },
    getTableList() {
      const category = this.data.category;
      const sidebar = this.data.sidebar;
      const sidebarName = this.data.sidebarName;
      const { personalDetail = [], scoreDetails = [] } = (this.data.rankInfo as any)[category];
      const scoreDetailsResult = scoreDetails.find((item: any) => item.type === sidebar);
      const tableList: any = scoreDetailsResult?.detail?.map((item: any) => {
        const player = personalDetail.find((el: any) => el.id === item.id);
        return { ...player, ...item, position: `${player.position}号位`, score: sidebarName.indexOf('率') > -1 ? `${item.score}%` : item.score }
      }).slice(0, 50);;
      this.setData({ sidebarList: scoreDetails, tableList });
    },
    getSidebarList() {
      const columnList = [];
      const category = this.data.category;
      if (category === 'players') {
        columnList.push(...['选手', '位置', 'KDA'])
      } else if (category === 'teams') {
        columnList.push(...['战队', 'KDA'])
      } else if (category === 'heroes') {
        columnList.push(...['英雄', '出场次数'])
      }
      this.setData({ columnList });
    },
    categoryEvent(event: IEvent) {
      const item = event.currentTarget.dataset.item;
      const players = (this.data.rankInfo as any)[item.value];
      const scoreDetails = players.scoreDetails[0];
      this.setData({ category: item.value, sidebarList: scoreDetails.detail.slice(0, 50), sidebar: scoreDetails.type });
      this.getSidebarList();
      this.getTableList();
    },
    sidebarEvent(event: IEvent) {
      const item = event.currentTarget.dataset.item;
      const columnList = this.data.columnList as any;
      columnList.pop();
      columnList.push(item.name);
      this.setData({ sidebar: item.type, columnList, sidebarName: item.name });
      this.getTableList();
    },
  }
})
