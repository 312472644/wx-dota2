import { IMatchDetail } from "miniprogram/interface/IPage";
import { GameModeMap } from "../../map/index";
import { transFormMS } from "../../utils/index";

// components/match-result/match-result.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    result: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    duration: '',
    gameMode: ''
  },
  observers: {
    result(newValue) {
      this.transFormParams(newValue);
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    transFormParams(result: IMatchDetail) {
      if (!result) {
        return;
      }
      const params = result;
      const { game_mode, duration } = params;
      const coastTime = transFormMS(duration);
      this.setData({ duration: coastTime, gameMode: GameModeMap.get(game_mode) })
    }
  }
})
