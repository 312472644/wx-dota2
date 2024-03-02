import { IGoodCategoryList, IGoodDetail, IGoodResult, IGoodResultDetail } from "../../interface/IPage";
import { ICustom, IEvent, IResult } from "../../interface/index";
import { axios, formatDateTime } from '../../utils/index';
import Notify from '@vant/weapp/notify/notify';

interface IData {
  baseCategory: IGoodCategoryList[];
  upgradeCategory: IGoodCategoryList[];
  neutralCategory: IGoodCategoryList[];
  categoryDetail: IGoodResultDetail | null;
  currentCategoryDetail: IGoodDetail | null;
  dialogVisible: boolean;
  scrollTop: number;
  show: boolean
}

let rewardedVideoAd: any = null;
let heroDetail: any = null;
let hasShowNotify = false;
let cacheExpired = {
  date: '',
  viewCount: 0
};

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
    scrollTop: 0,
    show: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let cache = wx.getStorageSync('expired');
    if (cache) {
      cacheExpired = JSON.parse(cache);
    }
    this.loadAdvertisement();
  },
  onHide() {
    heroDetail = null;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },
  loadAdvertisement() {
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createRewardedVideoAd) {
      rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-0e7dba7b5213adfb' })
      rewardedVideoAd.onLoad(() => { })
      rewardedVideoAd.onError((err) => {
        console.log('创建插屏广告失败', err)
      })
      rewardedVideoAd.onClose((res) => {
        const { isEnded } = res;
        if (isEnded) {
          cacheExpired.date = formatDateTime(+new Date(), false);
          cacheExpired.viewCount++;
          wx.setStorageSync('expired', JSON.stringify(cacheExpired));
          wx.navigateTo({
            url: `../hero-detail/hero-detail?id=${heroDetail.id}&name=${heroDetail.name_loc}`
          });
        } else {
          wx.showToast({ title: '请观看完视频', icon: 'error' });
        }
      })

    }
  },
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
  handleHero(data: IEvent) {
    const { detail } = data;
    heroDetail = detail;
    if (cacheExpired.date !== formatDateTime(+new Date(), false)) {
      cacheExpired.viewCount = 0;
    }
    // 每天观看三次视频即可免费查看
    if (cacheExpired.date === formatDateTime(+new Date(), false) && cacheExpired.viewCount >= 3) {
      wx.navigateTo({
        url: `../hero-detail/hero-detail?id=${heroDetail.id}&name=${heroDetail.name_loc}`
      });
    } else {
      if (!hasShowNotify) {
        Notify({
          type: 'primary', message: '每天观看三次视频即可免费查看'
        });
      }
      hasShowNotify = true;
      rewardedVideoAd.show();
    }

  },
  onShareAppMessage() {
    return {
      title: 'Dota2 英雄物品',
      path: 'pages/dota-dictionary/dota-dictionary',
    }
  }
})