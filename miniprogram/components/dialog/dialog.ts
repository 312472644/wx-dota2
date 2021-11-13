// components/dialog/dialog.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        visible: {
            type: Boolean
        },
        categoryDetail: {
            type: Object
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        desc: '',
        notes: '',
        attrib: '',
        lore: ''
    },
    lifetimes: {
        ready() {
            this.getCategoryDesc();
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getCategoryDesc() {
            // 技能属性描述
            const { categoryDetail } = this.properties;
            if (!categoryDetail) {
                return;
            }
            const { desc, lore, notes, attrib } = categoryDetail;
            const categoryDesc = `<div class='category-top'>${desc.replaceAll('<h1>', '').replaceAll('</h1>', '').replace(/\\n/g, '<br>')}</div>`;
            const notesDesc = `<div class='category-top'>${notes}</div>`;
            const attribDesc = `<div class='category-top'>${attrib}</div>`;
            this.setData({
                desc: categoryDesc,
                notes: notesDesc,
                attrib: attribDesc,
                lore
            });
        },
        closeDialog() {
            this.triggerEvent('close');
        }
    }
})
