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