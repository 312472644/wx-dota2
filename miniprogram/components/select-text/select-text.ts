import { PropEnum } from "../../enum/index";
import { IProperty, IPropertyList } from "../../interface/index";

interface ISelectText extends IProperty {
  dataList: IPropertyList;
}
Component<{}, ISelectText, {}>({
  /**
   * 组件的属性列表
   */
  properties: {
    dataList: { type: [], value: [] },
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    activeKey: PropEnum.All,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapEvent(event: any) {
      const currentValue = event.currentTarget.dataset.value;
      this.setData({ activeKey: currentValue });
      this.triggerEvent("change", { value: currentValue })
    },
  },
  lifetimes: {
    ready() {
      this.setData({
        list: this.properties.dataList,
      });
    }
  },
});
