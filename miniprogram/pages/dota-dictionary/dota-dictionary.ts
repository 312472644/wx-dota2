import { IEvent, IResult } from "../../interface";

// pages/hero-goods/hero-goods.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        baseCategory: null,
        upgradeCategory: null,
        neutralCategory: null,
        categoryDetail: {},
        currentCategoryDetail: null,
        dialogVisible: false,
        scrollTop: 0,
        activeTab: 'hero'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        // this.getCategory();
        // this.getCategoryDetail();
    },
    // 获取物品分类
    getCategory() {
        wx.showLoading({ title: '加载中...' });
        wx.request({
            url: "https://www.dota2.com.cn/itemscategory/json",
            method: 'GET',
            success: (res: IResult<any>) => {
                const { data, statusCode } = res;
                if (statusCode === 200) {
                    const { result } = data;
                    this.setData({
                        baseCategory: result.basic,
                        upgradeCategory: result.upgrade,
                        neutralCategory: result.neutral
                    });
                }
            },
            complete: () => {
                wx.hideLoading();
            }
        })
    },
    // 获取物品详情
    getCategoryDetail() {
        wx.request({
            url: 'https://www.dota2.com.cn/items/json?callback=HeropediaDFReceive',
            method: 'GET',
            success: (res: IResult<any>) => {
                const { data, statusCode } = res;
                if (statusCode === 200) {
                    const result = JSON.parse((data as any).replace('HeropediaDFReceive', '').replace('(', '').replace(')', ''));
                    this.setData({ categoryDetail: result });
                }
            }
        });
    },
    // 预览物品
    perviewCategory(event: IEvent) {
        let currentCategoryDetail = null;
        const category = event.detail.category;
        const categoryDetail = this.data.categoryDetail as any;
        for (const prop in categoryDetail) {
            for (const key in categoryDetail[prop]) {
                const { id } = categoryDetail[prop][key];
                if (id === category.item_id) {
                    currentCategoryDetail = categoryDetail[prop][key];
                    break;
                }
            }
        }
        this.setData({
            currentCategoryDetail,
            dialogVisible: true
        })
    },
    closeDialog() {
        this.setData({
            currentCategoryDetail: null,
            dialogVisible: false
        })
    },
    changeEvent(event: IEvent) {
        const { detail } = event;
        const activeTab = detail.name;
        if (activeTab === 'goods' && !this.data.baseCategory) {
            this.getCategory();
            this.getCategoryDetail();
        }
        this.setData({ scrollTop: 0, activeTab });
    }
})