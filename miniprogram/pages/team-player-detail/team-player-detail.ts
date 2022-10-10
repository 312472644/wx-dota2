import { IResult } from "miniprogram/interface";
import { axios, formatDateTime } from "../../utils/index";

// pages/team-player-detail/team-player-detail.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playerInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    const playerId = options.playerId;
    this.getPlayerDetail(playerId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  formatHonor(rank: string) {
    const map: any = {
      "1": {
        medal: '../../assets/common/gold.png',
        honorText: '冠军'
      },
      "2": {
        medal: '../../assets/common/silver.png',
        honorText: '亚军'
      },
      "3": {
        medal: '../../assets/common/bronze.png',
        honorText: '季军'
      }
    };
    return map[rank];
  },
  getPlayerDetail(playerId: number) {
    axios({
      url: `https://appactivity.wmpvp.com/steamcn/app/dota/event/new/playerMaterial?namiId=${playerId}`
    }).then((res: IResult<any>) => {
      const playerInfo = res.data.result;
      const recentHonor = playerInfo.dotaHonorLists.filter((item: any) => item.ranking <= 3)[0];
      if (recentHonor) {
        const recentHonorInfo = this.formatHonor(recentHonor.ranking) || {};
        playerInfo.recentHonor = `${recentHonor.eventNameZH} ${recentHonorInfo.honorText}` || '';
      }
      playerInfo.dotaHonorLists = playerInfo.dotaHonorLists.map((item: any) => {
        const result = this.formatHonor(item.ranking);
        return {
          ...item,
          medal: result?.medal,
          honorText: result?.honorText
        };
      }).filter((item: any) => item.ranking <= 3);
      playerInfo.dotaHonorLists.sort((a: any, b: any) => parseInt(a.ranking) - parseInt(b.ranking));
      playerInfo.transferList = playerInfo.transferList.map((item: any) => {
        return {
          ...item,
          startTime: item.startTime > 0 ? formatDateTime(item.startTime) : '-',
          endTime: item.endTime > 0 ? formatDateTime(item.endTime) : '-',
        };
      })
      this.setData({ playerInfo: res.data.result })
    })
  }
})