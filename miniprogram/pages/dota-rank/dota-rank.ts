import { ICustom, IEvent, IResult } from "miniprogram/interface";
import { IRank, IRankResult } from "miniprogram/interface/IPage";
import { axios, getDotaMaxQueryParam } from "../../utils/index";

interface IData {
  tabName: string;
  rankList: IRank[];
  scrollTop: number;
}

// pages/rank/rank.ts
Page<IData, ICustom>({
  /**
   * 页面的初始数据
   */
  data: {
    tabName: "china",
    rankList: [],
    scrollTop: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getRankList();
  },
  changeEvent(event: IEvent) {
    const { detail } = event;
    this.setData({ tabName: detail.name, scrollTop: 0 });
    this.getRankList(detail.name);
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
          .splice(0, 100);
        this.setData({ rankList });
      }
    });
  },
});
