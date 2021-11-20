import { IResult } from "miniprogram/interface";
import { getTagByClassRegex } from '../../utils/index';

// pages/new-log-detail/new-log-detail.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '',
        date: '',
        html: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(option: any) {
        if (!option) {
            return;
        }
        const { title, date, href } = option;
        this.setData({ title, date })
        this.getNewDetail(href);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },
    getNewDetailList(data: string) {
        const detailDom = getTagByClassRegex('div', 'content', data as any);
        const list: string[] = [];
        const domList = (detailDom?.[0])?.match(/<(\S*)[^>]*>[^<]*/gi) || [];
        domList.forEach((item: string) => {
            if (item.indexOf('<p') > -1) {
                const pDom = item.replace(new RegExp("(i?)(\<p.*?style=['\"])([^\>]+\>)", "gmi"), `<p style="color:#333;font-size:12px;padding:4px 0">`);
                list.push(pDom);
            } else if (item.indexOf('<h2') > -1) {
                const h2Dom = item.replace(new RegExp("(i?)(\<h2.*?style=['\"])([^\>]+\>)", "gmi"), `<h2 style="color:#000;font-size:14px;padding:2px 0;margin:0">`);
                list.push(h2Dom);
            } else if (item.indexOf('<span') > -1) {
                const spanDom = item.replace(new RegExp("(i?)(\<span.*?style=['\"])([^\>]+\>)", "gmi"), `<span style="color:#000;font-size:12px;display:block">`);
                list.push(spanDom);
            } else if (item.indexOf('<img') > -1) {
                const imgDom = item.match(new RegExp("(i?)(\<img.*?src=['\"])([^\>]+\>)", "gmi"))?.[0];
                const imgUrl = imgDom?.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match: string, capture: string) => {
                    const imgList = capture.split('//');
                    return imgList.length > 1 ? `https://images.weserv.nl/?url=${imgList[1]}` : match;
                }) || '';
                if (imgUrl?.indexOf('https') > -1) {
                    list.push(`<img src=${imgUrl} style="width:100%;padding:6px 0 3px 0" />`);
                }
            }
            else {
                list.push(item);
            }
        });
        return list;
    },
    getNewDetail(url: string) {
        wx.showLoading({ title: '加载中...' });
        wx.request({
            url,
            method: 'GET',
            success: (res: IResult<any>) => {
                const { statusCode, data } = res;
                if (statusCode === 200) {
                    const newDetailList = this.getNewDetailList(data as any) || [];
                    this.setData({
                        html: newDetailList.join('').toString().replaceAll('<br/>', '')
                    })
                }
            },
            complete() {
                wx.hideLoading();
            }
        })
    }
})