// pages/dota-team-detail/dota-team-detail.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        team: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(option: any) {
        if (!option) {
            return;
        }
        console.log(JSON.parse(option.team));
        // console.log(JSON.parse(option));
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    // 获取比赛列表
    getMatchList() {
        
     },
    // 获取英雄列表
    getHeroList() { },
    // 获选选手列表
    getPlayerList() { }
})