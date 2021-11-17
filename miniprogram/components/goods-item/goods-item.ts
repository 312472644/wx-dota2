import { IEvent } from "miniprogram/interface";

// components/goods-item/goods-item.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title: {
            type: String,
            value: ''
        },
        categoryList: {
            type: Object
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        perviewCategory(event: IEvent) {
            const { currentTarget } = event;
            this.triggerEvent('category', currentTarget.dataset)
        }
    }
})
