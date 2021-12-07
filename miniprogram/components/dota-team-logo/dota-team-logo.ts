import { IEvent } from "miniprogram/interface";

// components/dota-team-logo/dota-team-logo.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        avatar: {
            type: String
        },
        avatarText: {
            type: String
        },
        startTime: {
            type: String
        },
        width: {
            type: String,
            value: '25px'
        },
        height: {
            type: String,
            value: '25px'
        },
        tapInfo: {
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
      
    }
})
