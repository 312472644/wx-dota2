import { IHeroDetail } from "miniprogram/interface/IPage";
import { ICustom, IEvent, IResult } from "../../interface";
import { axios } from "../../utils/index";

interface IData {
  heroes: any
  heroId: number
}

// pages/hero-detail/hero-detail.ts
Page<IData, ICustom>({

  /**
   * 页面的初始数据
   */
  data: {
    heroId:0,
    heroes: null
  },
  onReady() {
    wx.showShareMenu({ withShareTicket: true });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option: any) {
    if (!option) {
      return;
    }
    wx.setNavigationBarTitle({ title: option.name });
    this.setData({ heroId: option.id });
    this.getHeroDetail(option.id);
  },
  // 获取英雄技能详情
  getHeroDetail(heroId: number) {
    axios({
      url: `https://www.dota2.com.cn/datafeed/hero?hero_id=${heroId}`,
      method: "GET",
    }).then((res: IResult<IHeroDetail>) => {
      this.setData({ heroes: res.data.result.heroes });
    });
  },
  // 英雄预览
  perviewHero(event: IEvent) {
    const { detail } = event;
    const heroId = detail.heroId;
    this.setData({ heroes: null });
    this.getHeroDetail(heroId);
  },
  toHeroStrategy() { 
    wx.navigateTo({
      url: `../../pages/hero-strategy/hero-strategy?heroId=${this.data.heroId}`
    });
  }
})