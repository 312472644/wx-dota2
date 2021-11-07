// 列表通用接口
export interface IOption {
  label: string;
  value: any;
  disable?: boolean;
}

// 组件参数通用接口
export interface IProperty {
  [x: string]: IPropertyList;
}

// 组件参数列表通用接口
export interface IPropertyList {
  type: any; // 属性的类型
  value?: any; // 属性的初始值
  optionalTypes?: Array<any>; // 属性的类型（可以指定多个）
  observer?: (newVal: any, oldVal: any) => void; //属性值变化时的回调函数
}

export interface IEvent {
  type: string; // 事件类型
  currentTarget: {
    dataset: any;
    id: string;
  }
  detail: any;
}