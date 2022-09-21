import { IEvent, IResult } from "miniprogram/interface";
import { IRankResult } from "miniprogram/interface/IPage";
import { axios, getDotaMaxQueryParam, tabRequest } from "../../utils/index";

// pages/rank/rank.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabName: "rank",
    rankList: [],
    scrollTop: 0,
    regionId: 'china',
    regionOptions: [
      { text: "国服", value: 'china' },
      { text: "美洲", value: 'americas' },
      { text: "欧洲", value: 'europe' },
      { text: "东南亚", value: 'se_asia' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() { },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getRankList();
  },
  changeEvent(event: IEvent) {
    const { detail } = event;
    this.setData({ tabName: detail.name });
    if (detail.name === 'version') {
      const versionComponent = this.selectComponent("#version");
      tabRequest(versionComponent, 'versionOptions', 'getVersionList');
    }
  },
  reginonChange(event: IEvent) {
    this.getRankList(event.detail);
  },
  getRankList(division: string = "china") {
    axios({
      url: `https://api.maxjia.com/api/player/ladder`,
      data: {
        division,
        ...getDotaMaxQueryParam(),
      },
      method: "GET",
    }).then((res: IResult<IRankResult>) => {
      const { status, result } = res.data;
      if (status === "ok") {
        const rankList = result.list
          .map((item: any) => {
            return {
              ...item,
              rank_img_url: item?.steam_id_info?.rank_img_url || null,
              avatar_url: item?.steam_id_info?.avatar_url || null,
            };
          })
          .splice(0, 100) as any;
        this.setData({ rankList });
      }
    });
  },
});
