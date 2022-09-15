import { IResult } from "miniprogram/interface";
import { axios } from "../../utils/index";

// pages/team-detail/team-detail.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    teamId: 0,
    teamInfo: null,
    scrollTop: 0,
    offsetTop: 90,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    const { teamId } = options;
    this.setData({ teamId });
    this.getTeamDetail(teamId);
  },
  onPageScroll(event: any) {
    const scrollTop = event.scrollTop;
    this.setData({ scrollTop });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},
  getTeamDetail(teamId: string = "3505") {
    axios({
      url: `https://appengine.wmpvp.com/dota/team/getDotaTeamSummary?teamId=${teamId}`,
    }).then((res: IResult<any>) => {
      const { result } = res.data;
      this.setData({ teamInfo: result });
    });
  },
});
