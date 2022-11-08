import { IGoodCategoryList, IGoodDetail, IGoodResult, IGoodResultDetail } from "../../interface/IPage";
import { ICustom, IEvent, IResult } from "../../interface/index";
import { axios } from '../../utils/index';

interface IData {
    baseCategory: IGoodCategoryList[];
    upgradeCategory: IGoodCategoryList[];
    neutralCategory: IGoodCategoryList[];
    categoryDetail: IGoodResultDetail | null;
    currentCategoryDetail: IGoodDetail | null;
    dialogVisible: boolean;
    scrollTop: number;
}

// pages/hero-goods/hero-goods.ts
Page<IData, ICustom>({
    /**
     * 页面的初始数据
     */
    data: {
        baseCategory: [],
        upgradeCategory: [],
        neutralCategory: [],
        categoryDetail: null,
        currentCategoryDetail: null,
        dialogVisible: false,
        scrollTop: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},
    // 获取物品分类
    getCategory() {
        axios({
            url: "https://www.dota2.com.cn/itemscategory/json",
            method: 'GET',
        }).then((res: IResult<IGoodResult>) => {
            const { result } = res.data;
            this.setData({
                baseCategory: result.basic,
                upgradeCategory: result.upgrade,
                neutralCategory: result.neutral
            });
        });
    },
    // 获取物品详情
    getCategoryDetail() {
        axios({
            url: 'https://www.dota2.com.cn/items/json?callback=HeropediaDFReceive',
            method: 'GET',
        }).then((res: IResult<string>) => {
            const result = JSON.parse((res.data).replace('HeropediaDFReceive', '').replace('(', '').replace(')', '')) as IGoodResultDetail;
            this.setData({ categoryDetail: result });
        })
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
        const { baseCategory } = this.data;
        if (activeTab === 'goods' && baseCategory.length === 0) {
            this.getCategory();
            this.getCategoryDetail();
        }
    },
    onShareAppMessage() {
      return {
        title: 'Dota2 英雄物品',
        path: 'pages/dota-dictionary/dota-dictionary',
      }
    }
})