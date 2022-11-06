import { ICustom, IEvent, IResult } from "../../interface/index";
import { getTagByClassRegex, axios } from '../../utils/index';

interface INews {
    title?: string;
    content?: string;
    date?: string;
    img?: string;
    href?: string;
}

interface IData {
    pageIndex: number;
    isLoadIng: boolean;
    isFinshed: boolean;
    activeTab: string;
    newList: INews[]
}

// pages/upgrade-log/upgrade-log.ts
Page<IData, ICustom>({

    /**
     * 页面的初始数据
     */
    data: {
        pageIndex: 1,
        isLoadIng: false,
        isFinshed: false,
        activeTab: 'news_update',
        newList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() { },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        const { isFinshed, pageIndex } = this.data;
        if (isFinshed) {
            return;
        }
        const pageNum = pageIndex + 1;
        this.setData({
            pageIndex: pageNum,
            isLoadIng: true
        })
        this.getNews(pageNum);
    },
    onReady() {
        this.getNews();
    },
    // 正则获取新闻列表
    getNewList(data: string) {
        const newList: INews[] = [];
        const herfList = Array.from(getTagByClassRegex('a', 'item', data) || []);
        herfList.forEach((item: any) => {
            // 获取所有闭合标签内容
            const messageDomList = item.match(/<(\S*)[^>]*>[^<]*<\/(\1)>/gi);
            const news: INews = {};
            const img = item.match(/\bsrc\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i)?.[1];
            const newHerf = item.match(/\href\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i)?.[1];
            if (messageDomList.length > 0) {
                const title = getTagByClassRegex('h2', 'title', messageDomList?.[0])?.[0]?.match(/>(.+)</)?.[1].replaceAll('&mdash;', '—');
                const content = getTagByClassRegex('p', 'content', messageDomList?.[1])?.[0]?.match(/>(.+)</)?.[1].replaceAll('&ldquo;', '"').replaceAll('&rdquo;', '"');;
                const date = getTagByClassRegex('p', 'date', messageDomList?.[2])?.[0]?.match(/>(.+)</)?.[1];
                news.title = title;
                news.content = content;
                news.date = date;
            }
            news.img = img;
            news.href = newHerf;
            newList.push(news);
        });
        this.setData({ isFinshed: herfList.length === 0 });
        return newList;
    },
    getNews(pageIndex: number = 1) {
        const { isLoadIng, newList = [], activeTab } = this.data;
        if (!isLoadIng && pageIndex > 1) {
            return;
        }
        axios({
            url: this.getRequestUrl(pageIndex, activeTab),
            method: 'GET',
            complete: () => {
                wx.hideLoading();
                this.setData({ isLoadIng: false });
            }
        }).then((res: IResult<string>) => {
            const newResultList = this.getNewList(res.data);
            this.setData({ newList: newList.concat(newResultList) });
        });
    },

    // 获取请求地址
    getRequestUrl(pageIndex = 1, tabName: string) {
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
            newList: [],
            activeTab: detail.name,
            isFinshed: false
        })
        this.getNews(1);
    },
    goNewsDetail(event: IEvent) {
        const { detail = {} } = event;
        const { href, title, date } = detail;
        wx.navigateTo({
            url: `../new-log-detail/new-log-detail?href=${href}&title=${title}&date=${date}`
        });
    },
    onShareAppMessage() {
      return {
        title: 'Dota2 天梯排行',
        path: 'pages/new-log/new-log',
      }
    }
})