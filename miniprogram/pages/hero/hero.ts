import { HeroTypeEnum, HeroComplexEnum, PropEnum } from "../../enum/index";
import { IEvent, IResult } from "../../interface";
import { HeroTypeMap } from "../../utils/util";
import { IHero } from "./interface";

// pages/hero/hero.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    attrList: [
      { label: "全部属性", value: PropEnum.All },
      { label: "力量", value: HeroTypeEnum.Power },
      { label: "智力", value: HeroTypeEnum.Intellect },
      { label: "敏捷", value: HeroTypeEnum.Agile },
    ],
    complexList: [
      { label: "全部难度", value: PropEnum.All },
      { label: "简单", value: HeroComplexEnum.Simple },
      { label: "中等", value: HeroComplexEnum.Normal },
      { label: "困难", value: HeroComplexEnum.Hard },
    ],
    attrValue: PropEnum.All, // 属性值
    complexValue: PropEnum.All, // 难度值
    heroName: '', // 英雄名称
    initHeroList: [], // 初始化列表
    heroList: [], // 查询列表
    isFirstLoad: false, // 是否第一次加载
    scrollTop: 0, // 滚动距离
    isShowTop: false // 是否现实滚动顶部按钮
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getHeroList();
  },
  setValue(propName: string, propValue: string) {
    this.setData({ [propName]: propValue });
    const { attrValue, complexValue, heroName } = this.data;
    this.filterHeroList(heroName, attrValue, complexValue);
  },
  bindInputEvent(event: IEvent) {
    this.setValue('heroName', event.detail.value);
  },
  selectAttrChange(event: IEvent) {
    this.setValue('attrValue', event.detail.value);
  },
  selectComplexChange(event: IEvent) {
    this.setValue('complexValue', event.detail.value);
  },
  // 过滤英雄列表
  filterHeroList(heroName: string, attrValue: string, complexValue: string) {
    let heroList: IHero[] = this.data.initHeroList;
    // 过滤英雄名
    if (heroName) {
      heroList = heroList.filter((item) => {
        return item.name_loc.indexOf(heroName) > -1;
      });
    }
    // 过滤英雄属性
    if (attrValue !== PropEnum.All) {
      heroList = heroList.filter((item) => {
        return item.primary_attr.toString() == attrValue;
      });
    }
    // 过滤难度
    if (complexValue !== PropEnum.All) {
      heroList = heroList.filter((item) => {
        return item.complexity.toString() == complexValue;
      });
    }
    this.setData({
      heroList: heroList as any
    });
  },
  // 获取英雄列表
  getHeroList() {
    wx.showLoading({ title: '加载中...' });
    wx.request({
      url: "https://www.dota2.com.cn/datafeed/heroList?task=herolist",
      method: "GET",
      success: (res: IResult<{ heroes: IHero[] }>) => {
        const { data, statusCode } = res;
        if (statusCode === 200) {
          const { result } = data;
          if (result) {
            const { heroes = [] } = result;
            result.heroes.forEach(item => {
              item.index_img = `https://images.weserv.nl/?url=${item.index_img}`;
              item.primary_img = HeroTypeMap.get(item.primary_attr);
            });
            this.setData({
              heroList: heroes as any,
              initHeroList: heroes as any
            });
          }
        } else {
          wx.showToast({
            title: "获取数据失败",
            icon: "error"
          });
        }
      },
      complete: () => {
        this.setData({
          isFirstLoad: true
        });
        wx.hideLoading();
      },
    })
  },
  // 回到顶部
  bindGoTop() {
    this.setData({ scrollTop: 0 })
  },
  // 滚动事件
  bindscrollEvent(event: any) {
    const scrollTop = event.detail.scrollTop;
    if (scrollTop > 200 && !this.data.isShowTop) {
      this.setData({ isShowTop: true });
    } else if (scrollTop <= 200 && this.data.isShowTop) {
      this.setData({ isShowTop: false });
    }
  },
  // 跳转至英雄详情界面
  goHeroDetail(event: IEvent) {
    const heroInfo = event.currentTarget.dataset.hero;
    wx.navigateTo({
      url: `../hero-detail/hero-detail?id=${heroInfo.id}&name=${heroInfo.name_loc}`
    });
  }
});
