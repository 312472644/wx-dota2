import { IResult } from "miniprogram/interface";
import { axios, formatDateTime } from "../../../utils/index";

// components/team-data/team-data.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    teamInfo: Object,
    teamId: Number,
  },

  /**
   * 组件的初始数据
   */
  data: {
    teamHonor: null,
    transferList: [],
  },
  lifetimes: {
    ready() {
      this.getTransferList();
      this.getHonorList();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getHonorList() {
      const teamId = this.properties.teamId;
      axios({
        url: `https://appengine.wmpvp.com/dota/team/getExtendInfo?teamId=${teamId}`,
      }).then((res: IResult<any>) => {
        const { teamHonor } = res.data.result;
        this.setData({ teamHonor });
      });
    },
    getTransferList() {
      const teamId = this.properties.teamId;
      axios({
        url: `https://appengine.wmpvp.com/dota/team/getTransferList?teamId=${teamId}`,
        data: {
          pageNum: 1,
          pageSize: 20,
        },
      }).then((res: IResult<any>) => {
        const {result} = res.data;
        const list = result.map((item: any) => {
          return {
            ...item,
            joinTime: item.joinTime ? formatDateTime(item.joinTime) : "-",
          };
        });
        this.setData({ transferList: list });
      });
    },
  },
});
