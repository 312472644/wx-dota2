import { IEvent } from "../../../interface/index";

// components/match-detail/match-heroes.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    heroesList: Array,
    isWin: Boolean,
    totalKill: Number,
    totalGold: String,
    campText: String,
    uid: String,
  },
  observers: {
    heroesList: function (newValue) {
      this.setData({ dataList: newValue });
    },
    totalGold: function (newValue) {
      this.setData({ glod: Object.is(newValue, "NaN") ? 0 : newValue });
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    dataList: [],
    glod: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tapEvent(event: IEvent) {
      const currentItem = event.currentTarget.dataset.item;
      this.data.dataList.forEach((item: any) => {
        if (item.hero_id === currentItem.hero_id) {
          item.isExpand = !item.isExpand;
        }
      });
      this.setData({ dataList: this.data.dataList });
    }
  }
})
