import { IEvent, IResult } from "miniprogram/interface";
import { axios } from "../../utils/index";

// components/team-overview/team-overview.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    teamId: String,
    playerList: Array,
  },

  /**
   * 组件的初始数据
   */
  data: {
    matchId: "1",
    matchDetail: null,
    matchOptions: [],
  },
  lifetimes: {
    ready() {
      this.getMatchOptions();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getMatchOptions() {
      const teamId = this.properties.teamId;
      axios({
        url: `https://appengine.wmpvp.com/dota/team/getEventSimplifyInfoList?teamId=${teamId}`,
      }).then((res: IResult<any>) => {
        const { result = [] } = res.data;
        const matchOptions = result.map((item: any) => {
          return {
            text: item.eventName,
            value: item.id,
          };
        });
        const matchId = matchOptions[0].value;
        this.setData({ matchOptions, matchId });
        this.getMatchDetail(teamId, matchId);
      });
    },
    getMatchDetail(teamId: number | string, eventId: string) {
      axios({
        url: "https://appengine.wmpvp.com/dota/team/getEventStat",
        data: {
          teamId,
          eventId,
        },
      }).then((res: IResult<any>) => {
        this.setData({ matchDetail: res.data.result });
      });
    },
    bindChange(event: IEvent) {
      const eventId = event.detail;
      const teamId = this.properties.teamId;
      this.getMatchDetail(teamId, eventId);
    },
  },
});
