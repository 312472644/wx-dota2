// 战队接口
export interface ITeam {
  code: number;
  message: string;
  result: [];
}

// 排名接口
export interface IRankResult {
  msg: string;
  result: {
    list: [];
    ranking_distribution: [];
  };
  status: string;
  version: string;
}

export interface IRank {
    rank: number; // 排名
    name: string; // 名称
    team_tag?: string; // 队伍名称
}

// 英雄列表接口
export interface IHeroResult {
    result: {
        heroes: IHero[]
    };
    status: string;
}

export interface IHero {
    id: number;
    complexity: number; // 难度
    primary_attr: number; // 属性
    name: string; // 名称
    name_loc: string; // 中文名
    name_english_loc: string; // 英文名
    crops_img: string;
    index_img: string; // 英雄头像地址
    top_img: string; // 完整图片
    top_video: string; // 视频介绍
    primary_img?: string; // 属性图片地址
}

// 获取物品列表
export interface IGoodResult {
    result: IGoodCategory;
    status: string;
}

export interface IGoodCategory {
    basic: IGoodCategoryList[]; // 基础分类
    neutral: IGoodCategoryList[]; // 合成分类
    upgrade: IGoodCategoryList[]; // 中立物品
}

export interface IGoodCategoryList {
    name: string;
    items: {
        cost?: number; // 蓝耗
        img: string;
        item_id: string;
        name: string; // 英文名称
        name_loc: string; // 中文名称
        sort_value: string;
    }
}

// 物品详情
export interface IGoodResultDetail {
    itemdata: {
        [k: string]: IGoodDetail;
    }
}

export interface IGoodDetail {
    attrib?: string; // 介绍
    cd?: string;
    cost?: string;
    desc: string;
    dname: string;
    img: string;
    lore?: string;
    mc?: string;
    notes?: string;
}

export interface IHeroDetail {
    result: {
        heroes: any
    };
    status: string;
}

// 比赛接口
export interface IMatch {
    duration: number; // 时长
    league_name: string;
    leagueid: number;
    match_id: number;
    opposing_team_id: number;
    opposing_team_logo: string;
    opposing_team_name: string;
    radiant: boolean;
    radiant_win: boolean;
    start_time: number;
}

// 玩家接口
export interface IPlayer {
    account_id: number;
    games_played: number;
    is_current_team_member: boolean;
    name: string;
    wins: number;
}

// 队伍英雄接口
export interface ITeamHero {
    games_played: number;
    hero_id: number;
    localized_name: string;
    wins: number;
}

// 队员信息
export interface IProfile {
    leaderboard_rank: number;
    profile: {
        account_id: number;
        avatar: string;
        avatarfull: string;
        name: string;
        personaname: string;
        profileurl: string;
        steamid: string;
    }
}

// 近期比赛接口
export interface IRecentMacth {
    match_id: number;
    assists: number;
    deaths: number;
    duration: number;
    game_mode: number; // 游戏模式
    hero_id: number;
    kills: number;
    party_size: number;
    player_slot: number;
    radiant_win: number;
    start_time: number;
    lobby_type: number; // 游戏类型
}

// 分类统计
export interface ICategoryTotal {
    field: string;
    n: number;
    sum: number;
}

// 输赢接口
export interface IWL {
    win: number;
    lose: number;
}

// 玩家常用英雄接口
export interface IPlayerHero {
    against_games: number; // 对方游戏场数
    against_win: number; // 对方胜率
    games: number; // 次数
    hero_id: string;
    last_played: number; // 游戏时间
    win: number; // 胜场
    with_games: number; // 己方游戏场数
    with_win: number; // 己方胜率
}

// 比赛详情接口
export interface IMatchDetail {
    dire_score: number; //最终得分
    dire_team: IMatchTeam;
    dire_team_id: Number;
    duration: number; // 耗时
    first_blood_time: number; // 一血产生时间
    game_mode: number;
    human_players: number;
    lobby_type: number;
    match_id: number;
    picks_bans: []; //选择和禁用
    players: []; //玩家列表
    radiant_score: number;
    radiant_team: IMatchTeam;
    radiant_team_id: number;
    radiant_win: number;
    start_time: number;
}

export interface IMatchTeam {
    logo_url: string;
    name: string;
    tag: string;
    team_id: number;
}