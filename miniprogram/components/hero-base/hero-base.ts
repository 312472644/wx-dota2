// components/hero-base/index.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {

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
        // 阅读完整背景
        readMoreBg() {
            wx.showModal({
                title: "背景",
                content: `也许有人会问：“这个世界是如何形成的？”在所有现存世界中，为什么这个世界的属性如此奇特，如此多样化，其中的生物，文化和传说更是数不胜数呢？“答案，”有人低语道，“就在于巨神们。”`,
                confirmText: "关闭"
            })
        }
    }
})
