// pages/hero-detail/hero-detail.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(option: any) {
        if (!option) {
            return;
        }
        // wx.setNavigationBarTitle({ title: option.name })
        // this.getHeroDetail(option.id);
    },
    // 获取英雄技能详情
    getHeroDetail(heroId: number) {
        wx.showLoading({ title: '加载中...' });
        wx.request({
            url: `https://www.dota2.com.cn/datafeed/hero?hero_id=${heroId}`,
            method: "GET",
            success: (res) => {
                console.log('res', res);
            },
            complete() {
                wx.hideLoading();
            }
        })
        console.log('heroId', heroId);
    }
})