// components/hero-preview/hero-preview.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        leftHero: {
            type: Object
        },
        rightHero: {
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
        previewHero(event: any) {
            const heroId = event.currentTarget.dataset.id;
            this.triggerEvent('perview', { heroId });
        }
    }
})
