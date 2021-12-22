import { ICustom, IResult, PageLoad } from "miniprogram/interface";
import { IMatchDetail } from "miniprogram/interface/IPage";
import { axios } from "../../utils/index";

// pages/match-detail/match-detail.ts
interface IData {
  matchResult: any;
}

Page<IData, ICustom>({

  /**
   * 页面的初始数据
   */
  data: {
    matchResult: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query: PageLoad<{ matchId: string }>) {
    // if (!query.matchId) {
    //   return;
    // }
    // this.getMatchData(query.matchId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getMatchData();
  },
  // 获取比赛详情数据
  getMatchData(mathcId: number = 6333084462) {
    axios({
      url: `https://api.opendota.com/api/matches/${mathcId}`
    }).then((res: IResult<IMatchDetail>) => {
      const { data } = res;
      this.setData({ matchResult: data });
    })
  }
})