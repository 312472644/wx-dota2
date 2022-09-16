import { RoleList } from "../../../map/index";

// components/hero-status/index.ts
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
        heroLogo: '',
        damage: '',
        roleList: [],
        statusList: [],
    },
    lifetimes: {
        ready() {
            const { heroes } = this.properties;
            const { index_img, damage_min, damage_max, role_levels } = heroes;
            this.setData({
                heroLogo: `https://images.weserv.nl/?url=${index_img}`,
                damage: `${damage_min}-${damage_max}`
            });
            this.getRoleList(role_levels);
            this.getStatusList(heroes);
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        // 获取定位列表
        getRoleList(roleList: number[] = []) {
            const resultList = roleList.map((item: number, index: number) => {
                return {
                    label: RoleList[index],
                    value: item / 3 * 100
                }
            });
            this.setData({ roleList: resultList as any })
        },
        // 获取状态列表
        getStatusList(heroes: any) {
            const { damage_min, damage_max, movement_speed, attack_rate, magic_resistance, attack_range, sight_range_day, sight_range_night, projectile_speed } = heroes;
            const statusList = [
                { label: '攻击力', value: `${damage_min}-${damage_max}` },
                { label: '防御', value: heroes.armor.toFixed(1) },
                { label: '移速', value: movement_speed },
                { label: '攻击间隔', value: attack_rate.toFixed(1) },
                { label: '魔抗', value: `${magic_resistance}%` },
                { label: '攻击范围', value: attack_range },
                { label: '视野(白/夜)', value: `${sight_range_day}/${sight_range_night}` },
                { label: '攻击距离', value: projectile_speed }
            ];
            this.setData({
                statusList: statusList as any
            })
        }
    }
})
