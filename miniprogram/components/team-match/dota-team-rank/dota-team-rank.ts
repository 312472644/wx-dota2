import { IEvent, IResult } from "../../../interface/index";
import { ITeam } from "../../../interface/IPage";
import { axios } from "../../../utils/index";

// components/dota-team/dota-team.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    teamList: [],
    regionId: 0,
    regionOptions: [
      { text: "全球", value: 0 },
      { text: "北美", value: 1 },
      { text: "南美", value: 2 },
      { text: "欧洲", value: 3 },
      { text: "独联体", value: 4 },
      { text: "中国", value: 5 },
      { text: "东南亚", value: 6 },
    ],
  },
  /**
   * 组件的方法列表
   */
  methods: {
    reginonChange(value: IEvent) {
      this.getTeamList(value.detail);
    },
    getTeamList(regionId = 0) {
      axios({
        url: `https://appengine.wmpvp.com/dota/team/getTiRank?regionId=${regionId}`,
        method: "GET",
      }).then((res: IResult<ITeam>) => {
        const { code, result } = res.data;
        if (code === 1) {
          this.setData({ teamList: result });
        }
      });
    },
    toDotaTeamDetail(event: IEvent) {
      const { currentTarget } = event;
      const { team } = currentTarget.dataset;
      wx.navigateTo({
        url: `../../pages/team-detail/team-detail?teamId=${team.teamId}`,
      });
    }
  },
});
