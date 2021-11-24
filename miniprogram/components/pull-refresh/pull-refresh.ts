// components/pull-refresh/pull-refresh.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        threshold: {
            type: Number,
            value: 500
        }
    },
    options: {
        pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
    },
    /**
     * 组件的初始数据
     */
    data: {
        complete: false,
        isStopRefresh: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        stopRefresh() {
            this.setData({ isStopRefresh: true })
        }
    },
})
