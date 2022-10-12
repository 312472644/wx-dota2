import { IEvent } from "../../../interface/index";

// components/log-item/log-item.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        logList: {
            type: Array
        },
        isFinshed: {
            type: Boolean
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
        goNewsDetail(event: IEvent) {
            const { currentTarget } = event;
            this.triggerEvent('click', currentTarget.dataset.news);
        }
    }
})
