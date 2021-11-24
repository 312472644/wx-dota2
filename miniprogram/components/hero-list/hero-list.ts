import { HeroComplexEnum, HeroTypeEnum, PropEnum } from "../../enum/index";
import { IEvent, IResult } from "../../interface";
import { IHero } from "./interface";

// components/hero-list/hero-list.ts
Component({
    options: {
        pureDataPattern: /^_/
    },
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        _initHeroList: [], // 初始化列表,
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
        heroList: [], // 查询列表
        isFirstLoad: false, // 是否第一次加载
        scrollTop: 0, // 滚动距离
        isShowTop: false // 是否现实滚动顶部按钮
    },
    lifetimes: {
        ready() {
            this.getHeroList();
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        setValue(propName: string, propValue: string) {
            this.setData({ [propName]: propValue });
            const { attrValue, complexValue, heroName } = this.data;
            this.filterHeroList(heroName, attrValue, complexValue);
        },
        searchEvent(event: IEvent) {
            this.setValue('heroName', event.detail);
        },
        selectAttrChange(event: IEvent) {
            this.setValue('attrValue', event.detail.value);
        },
        selectComplexChange(event: IEvent) {
            this.setValue('complexValue', event.detail.value);
        },
        // 过滤英雄列表
        filterHeroList(heroName: string, attrValue: string, complexValue: string) {
            let heroList: IHero[] = this.data._initHeroList;
            // 过滤英雄名
            if (heroName) {
                heroList = heroList.filter((item) => item.name_loc.indexOf(heroName) > -1);
            }
            // 过滤英雄属性
            if (attrValue !== PropEnum.All) {
                heroList = heroList.filter((item) => item.primary_attr.toString() == attrValue);
            }
            // 过滤难度
            if (complexValue !== PropEnum.All) {
                heroList = heroList.filter((item) => item.complexity.toString() == complexValue);
            }
            this.setData({
                heroList: this.getCategoryHero([...heroList]) as any
            });
        },
        // 获取英雄分类列表
        getCategoryHero(heroes: IHero[] = []) {
            // 力量英雄
            const powerHeroList = heroes.filter((item: IHero) => item.primary_attr.toString() === HeroTypeEnum.Power) || [];
            // 智力英雄
            const intellectHeroList = heroes.filter((item: IHero) => item.primary_attr.toString() === HeroTypeEnum.Intellect) || [];
            // 敏捷英雄
            const AgileHeroList = heroes.filter((item: IHero) => item.primary_attr.toString() === HeroTypeEnum.Agile) || [];
            const heroList = [
                {
                    name: '力量',
                    list: powerHeroList
                }, {
                    name: '智力',
                    list: intellectHeroList
                }, {
                    name: '敏捷',
                    list: AgileHeroList
                }];
            const hasNotEmpty = heroList.some((item) => item.list.length > 0);
            return hasNotEmpty ? heroList : [];
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
                            });
                            this.setData({
                                heroList: this.getCategoryHero(heroes as IHero[]) as any,
                                _initHeroList: heroes as any
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
                    this.setData({ isFirstLoad: true });
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
    }
})