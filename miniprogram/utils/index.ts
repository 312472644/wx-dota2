import { IAxiosOption, IResult } from "../interface/index";
import { IHeroResult } from "../interface/IPage";

/***
 * 通过标签和类名获取dom元素内容
 * @param tag dom标签
 * @param cls 样式名称
 * @param html dom内容
 */
const getTagByClassRegex = (tag: string, cls: string, html: string) => {
  var reg = new RegExp("<" + tag + "[^>]*class[\\s]?=[\\s]?['\"]" + cls + "[^'\"]*['\"][\\s\\S]*?<\/" + tag + ">", "g");
  return html.match(reg);
};

/***
 * 接口请求
 * @param loadText loading文案
 * @param option 请求参数
 */
const axios = (option: IAxiosOption, loadText = '加载中...'): Promise<IResult<any>> => {
  wx.showLoading({ title: loadText });
  return new Promise((resolve: any) => {
    const assignOption = Object.assign(option, {
      success: (res: IResult<any>) => {
        const { statusCode } = res;
        if (statusCode === 200) {
          resolve(res);
        } else {
          wx.showToast({ title: "获取数据失败", icon: "error" });
        }
      },
      complete() {
        wx.hideLoading();
      },
    });
    wx.request(assignOption as any);
  });
};

/***
 * 时间戳转换分秒
 * @param timeStamp 时间戳
 */
const transFormMS = (timeStamp: number) => {
  const mins = Math.floor(timeStamp / 60).toString().padStart(2, '0');
  const seconds = Math.floor(timeStamp % 60).toString().padStart(2, '0');
  return `${mins}:${seconds}`;
}

/***
 * 获取英雄列表中文
 */
const getHeroCNList = () => {
  return new Promise((resolve) => {
    wx.request({
      url: 'https://www.dota2.com.cn/datafeed/heroList?task=herolist',
      method: 'GET',
      success: (res: IResult<IHeroResult>) => {
        resolve(res.data.result.heroes || []);
      }
    })
  })
};

/***
 * 时间戳转换年月日 时分秒
 * @param timeStamp 时间戳
 * @param isNeedMS 是否需要时分秒
 */
const formatDateTime = (timeStamp: number, isNeedMS = false, separator = "-") => {
  const time = new Date(timeStamp);
  const year = time.getFullYear();
  const month = (time.getMonth() + 1).toString().padStart(2, '0');
  const day = time.getDate().toString().padStart(2, '0');
  const hours = time.getHours().toString().padStart(2, '0');
  const mins = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  return isNeedMS ? `${year}${separator}${month}${separator}${day} ${hours}:${mins}:${seconds}` : `${year}${separator}${month}${separator}${day}`;
};

/***
 * 获取dota max api公共查询参数
 */
const getDotaMaxQueryParam = () => {
  return {
    max_id: 0,
    game_type: "dota2",
    os_type: "Android",
    os_version: "5.1.1",
    version: "4.4.53",
    lang: "zh-cn",
    channel: "dotamax",
    x_app: "maxjia",
    x_client_type: "mobile",
    x_os_type: "Android",
  };
};

const formatMillimeter = (value: string = '0') => {
  return value.toString().replace(/\d(?=(\d{3})+$)/g, "$&,");
};

/***
 * dotaMind请求数据
 */
const dotaMindRequest = (queryParam: string) => {
  return axios({
    url: "https://apidota.gamesmind.com/handler",
    method: "POST",
    data: {
      route: "dota2router.dota2data.req",
      message: {
        "path": queryParam, "method": "GET", "json": {}
      }
    }
  })
};

const getHandlerParam = (queryParam: string) => {
  return {
    route: "dota2router.dota2data.req", message: {
      "path": queryParam, "method": "GET", "json": {}
    }
  }
};

/***
 * 从英雄列表通过heroId缓存中获取英雄详情
 * @param heroId 
 */
const getStorageHeroById = (heroId: number) => {
  let heroInfo = null;
  const heroListStr = wx.getStorageSync('heroList');
  if (heroListStr) { 
    const heroList = JSON.parse(heroListStr) || [];
    heroInfo = heroList.find((item: any) => item.id.toString() === heroId.toString());
  }
  return heroInfo;
}

/***
 * tabs请求数据，只进行第一网络请求
 * @param component 组件对象
 * @param dsName 组件数据源
 * @param getMethodName 获取组件数据方法名称
 */
const tabRequest = (component: any, dsName: string, getMethodName: any) => {
  const dataList = component.data[dsName];
  if (dataList.length === 0) {
    component[getMethodName]();
  }
};

/***
 * 是否是天辉
 * @param component 组件对象
 */
const isRadiant = (playerSlot: number) => { 
  return playerSlot >= 0 && playerSlot <= 127;
};

export {
  getTagByClassRegex,
  axios,
  transFormMS,
  getHeroCNList,
  formatDateTime,
  formatMillimeter,
  getDotaMaxQueryParam,
  tabRequest,
  getHandlerParam,
  dotaMindRequest,
  getStorageHeroById,
  isRadiant
};