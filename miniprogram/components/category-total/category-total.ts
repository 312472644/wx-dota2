import { IResult } from "miniprogram/interface";
import { ICategoryTotal } from "miniprogram/interface/IPage";
import { axios } from "../../utils/index"

// components/category-total/category-total.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        accountId: {
            type: String
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        totalList: []
    },
    lifetimes: {
        ready() {
            this.getTotalList();
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getTotalList() {
            axios({
                url: `https://api.opendota.com/api/players/${this.properties.accountId}/totals`,
                method: 'GET'
            }).then((res: IResult<ICategoryTotal[]>) => {
                const { data } = res;
                const list = data.map(item => {
                    return {
                        value: item.sum.toString().replace(/(?=\B(\d{3})+$)/g, ','),
                        ...item
                    }
                });
                this.setData({ totalList: list as any });
            })
        }
    }
})
