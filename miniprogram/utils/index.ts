import { IAxiosOption, IResult } from "miniprogram/interface";
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
const formatDateTime = (timeStamp: number, isNeedMS = false) => {
    const time = new Date(timeStamp);
    const year = time.getFullYear();
    const month = (time.getMonth() + 1).toString().padStart(2, '0');
    const day = time.getDate().toString().padStart(2, '0');
    const hours = time.getHours().toString().padStart(2, '0');
    const mins = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return isNeedMS ? `${year}-${month}-${day} ${hours}:${mins}:${seconds}` : `${year}-${month}-${day}`;
};

export { getTagByClassRegex, axios, transFormMS, getHeroCNList, formatDateTime }