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
  };
  target: {
    id: string;
    dataset: any;
  };
  detail: any;
  changedTouches: ITouches[]
}

interface ITouches {
  clientX: number; // x轴位置
  clientY: number;
  pageX: number;
  pageY: number;
}

// 接口请求数据
export interface IResult<T> {
  cookies: any;
  data: T;
  errMsg: string;
  statusCode: number;
}

//Page onLoad 接定义
export type PageLoad<T> = T & Record<string, string | undefined>;

export interface ICustom {
  [k: string]: any;
};