import { IEvent, IResult } from "../../interface";

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
        wx.showLoading({ title: '加载中...' });
        wx.request({
            url: `https://www.dota2.com.cn/datafeed/hero?hero_id=${heroId}`,
            method: "GET",
            success: (res: IResult<any>) => {
                const { data, statusCode } = res;
                if (statusCode === 200) {
                    const { result } = data;
                    this.setData({ heroes: result.heroes });
                } else {
                    wx.showToast({
                        title: "获取数据失败",
                        icon: "error"
                    });
                }
            },
            complete() {
                wx.hideLoading();
            }
        })
    },
    // 英雄预览
    perviewHero(event: IEvent) {
        const { detail } = event;
        const heroId = detail.heroId;
        this.setData({ heroes: null });
        this.getHeroDetail(heroId);
    }
})