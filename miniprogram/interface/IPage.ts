// 战队接口
export interface ITeam {
    logo_url: string, // logo地址
    losses: number, // 败场
    name: string, // 队名
    rating: number, // 等级分
    tag: string, // 标签
    team_id: number, // id
    wins: number, // 胜场
}

// 排名接口
export interface IRankResult {
    leaderboard: IRank[];
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