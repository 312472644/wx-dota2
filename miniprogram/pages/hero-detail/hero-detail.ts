import { IEvent, IResult } from "../../interface";
import { axios } from "../../utils/index";

// pages/hero-detail/hero-detail.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
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
        this.getHeroDetail(option.id);
    },
    // 获取英雄技能详情
    getHeroDetail(heroId: number) {
        axios({
            url: `https://www.dota2.com.cn/datafeed/hero?hero_id=${heroId}`,
            method: "GET",
        }).then((res: IResult<any>) => {
            this.setData({ heroes: res.data.result.heroes });
        });
    },
    // 英雄预览
    perviewHero(event: IEvent) {
        const { detail } = event;
        const heroId = detail.heroId;
        this.setData({ heroes: null });
        this.getHeroDetail(heroId);
    }
})