import { IResult } from "miniprogram/interface";

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
const axios = (option: any, loadText = '加载中...'): Promise<IResult<any>> => {
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
        wx.request(assignOption);
    });
};

export { getTagByClassRegex, axios }