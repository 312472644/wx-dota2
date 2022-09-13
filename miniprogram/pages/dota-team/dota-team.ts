import { ICustom, IEvent, IResult } from "miniprogram/interface";
import { ITeam } from "miniprogram/interface/IPage";
import { axios, getDotaMaxQueryParam } from "../../utils/index";

interface IData {
  teamList: ITeam[];
}
// pages/dota-team/dota-team.ts
Page<IData, ICustom>({
  /**
   * 页面的初始数据
   */
  data: {
    teamList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getTeamList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},
  getTeamList() {
    axios({
      url: "https://api.maxjia.com/api/team/list/",
      method: "GET",
      data: {
        offset: 0,
        limit: 100,
        ...getDotaMaxQueryParam(),
      },
    }).then((res: IResult<ITeam>) => {
      const { result = [] } = res.data;
      const list = result.splice(0, 100).map((item: any) => {
        return {
          ...item,
          mmr_percent: parseFloat(item.mmr_percent),
        };
      });
      this.setData({ teamList: list });
    });
  },
  toDotaTeamDetail(event: IEvent) {
    const { currentTarget } = event;
    const { team } = currentTarget.dataset;
    wx.navigateTo({
      url: `../dota-team-detail/dota-team-detail?team=${JSON.stringify(team)}`,
    });
  },
});
