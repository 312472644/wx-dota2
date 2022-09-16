import { HeroAttackTypeImgMap, HeroAttackTypeMap, HeroComplexityMap, HeroTypeImgMap, HeroTypeMap } from "../../../map/index";
// components/hero-base/index.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        heroes: {
            type: Object
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        dialogVisible: false,
        message: null,
        heroBase: {},
        heroType: {},
        heroAttack: {},
        heroLoc: '',
        heroVideoUrl: '',
        heroTopImg: '',
        heroComplexity: ''
    },
    lifetimes: {
        ready() {
            const { heroes } = this.properties;
            const { attack_capability, primary_attr, hype_loc, top_video, top_img, complexity } = heroes;
            const heroLoc = hype_loc.replaceAll('<b>', '').replaceAll('</b>', '');
            this.setData({
                heroLoc,
                heroVideoUrl: top_video,
                heroTopImg: `https://images.weserv.nl/?url=${top_img}`,
                heroType: {
                    heroTypeUrl: HeroTypeImgMap.get(primary_attr),
                    heroTypeText: HeroTypeMap.get(primary_attr)
                },
                heroAttack: {
                    heroAttackUrl: HeroAttackTypeImgMap.get(attack_capability),
                    heroAttackText: HeroAttackTypeMap.get(attack_capability),
                },
                heroBase: heroes,
                heroComplexity: HeroComplexityMap.get(complexity)
            });
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        // 阅读完整背景
        readMoreBg() {
            const { heroes } = this.properties;
            this.setData({
                dialogVisible: true,
                message: heroes.bio_loc.replaceAll('<br>', '')
            })
        }
    }
})
