import { IEvent, IResult } from "../../interface";

interface INews {
    title?: string;
    content?: string;
    date?: string;
    img?: string;
    href?: string;
}
// pages/upgrade-log/upgrade-log.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageIndex: 1,
        isLoadIng: false,
        activeTab: 'news_update',
        newList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        let pageIndex = this.data.pageIndex;
        pageIndex++;
        this.setData({
            pageIndex,
            isLoadIng: true
        })
        this.getNews(pageIndex);
    },
    onReady() {
        this.getNews();
    },
    // 正则获取新闻列表
    getNewList(data: string) {
        const newList: INews[] = [];
        const herfList = Array.from(this.getTagByClassRegex('a', 'item', data) || []);
        herfList.forEach((item: any) => {
            // 获取所有闭合标签内容
            const messageDomList = item.match(/<(\S*)[^>]*>[^<]*<\/(\1)>/gi);
            const news: INews = {};
            const img = item.match(/\bsrc\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i)?.[1];
            const newHerf = item.match(/\href\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i)?.[1];
            if (messageDomList.length > 0) {
                const title = this.getTagByClassRegex('h2', 'title', messageDomList?.[0])?.[0]?.match(/>(.+)</)?.[1];
                const content = this.getTagByClassRegex('p', 'content', messageDomList?.[1])?.[0]?.match(/>(.+)</)?.[1];
                const date = this.getTagByClassRegex('p', 'date', messageDomList?.[2])?.[0]?.match(/>(.+)</)?.[1];
                news.title = title;
                news.content = content;
                news.date = date;
            }
            news.img = img;
            news.href = newHerf;
            newList.push(news);
        });
        return newList;
    },
    getNews(pageIndex: number = 1, activeName: 'news_update' | 'announcement' = 'news_update') {
        const { isLoadIng, newList = [] } = this.data;
        if (!isLoadIng && pageIndex > 1) {
            return;
        }
        wx.showLoading({ title: "加载中..." });
        wx.request({
            url: this.getRequestUrl(pageIndex, activeName),
            method: 'GET',
            success: (res: IResult<any>) => {
                const { data, statusCode } = res;
                if (statusCode === 200) {
                    const newResultList = this.getNewList(data as any);
                    this.setData({ newList: newList.concat(newResultList as any) });
                }
            },
            complete: () => {
                wx.hideLoading();
                this.setData({ isLoadIng: false })
            }
        })
    },
    // 通过标签和类名获取dom元素内容
    getTagByClassRegex(tag: string, cls: string, html: string) {
        var reg = new RegExp("<" + tag + "[^>]*class[\\s]?=[\\s]?['\"]" + cls + "[^'\"]*['\"][\\s\\S]*?<\/" + tag + ">", "g");
        return html.match(reg);
    },
    // 获取请求地址
    getRequestUrl(pageIndex = 1, tabName: 'news_update' | 'announcement') {
        let requestUrl = '';
        if (tabName === 'news_update') {
            requestUrl = pageIndex === 1 ? 'https://www.dota2.com.cn/news/gamepost/news_update/index.htm' : `https://www.dota2.com.cn/news/gamepost/index${pageIndex}.htm`;
        } else if (tabName === 'announcement') {
            requestUrl = `https://www.dota2.com.cn/news/announcement/index${pageIndex}.htm`;
        }
        return requestUrl;
    },
    changeEvent(event: IEvent) {
        const { detail } = event;
        this.setData({
            pageIndex: 1,
            isLoadIng: false,
            newList: []
        })
        this.getNews(1, detail.name);
    }
})