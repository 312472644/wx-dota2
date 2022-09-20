// 英雄类型图片
const HeroTypeImgMap: Map<number, string> = new Map();
HeroTypeImgMap.set(0, '../../assets/common/power.png'); // 力量
HeroTypeImgMap.set(1, '../../assets/common/agile.png'); // 敏捷
HeroTypeImgMap.set(2, '../../assets/common/intellect.png'); // 智力 

// 英雄类型
const HeroTypeMap: Map<number, string> = new Map();
HeroTypeMap.set(0, '力量'); // 力量
HeroTypeMap.set(1, '敏捷'); // 敏捷
HeroTypeMap.set(2, '智力'); // 智力 

// 英雄攻击类型图片
const HeroAttackTypeImgMap: Map<number, string> = new Map();
HeroAttackTypeImgMap.set(1, '../../assets/common/melee.svg'); // 近战
HeroAttackTypeImgMap.set(2, '../../assets/common/ranged.svg'); // 远程

//  英雄攻击类型
const HeroAttackTypeMap: Map<number, string> = new Map();
HeroAttackTypeMap.set(1, '近战'); // 近战
HeroAttackTypeMap.set(2, '远程'); // 远程

// 英雄难度
const HeroComplexityMap: Map<number, string> = new Map();
HeroComplexityMap.set(1, '简单');
HeroComplexityMap.set(2, '中等');
HeroComplexityMap.set(3, '困难');

// 英雄定位
const RoleList: string[] = ['核心', '辅助', '爆发', '控制', '打野', '耐久', '逃生', '推进', '先手'];

// 游戏模式
const GameModeMap: Map<number, string> = new Map();
GameModeMap.set(0, '未知');
GameModeMap.set(1, '全英雄选择');
GameModeMap.set(2, '队长模式');
GameModeMap.set(3, '随机征召');
GameModeMap.set(4, '单一征召');
GameModeMap.set(5, '全英雄随机');
GameModeMap.set(6, '开局');
GameModeMap.set(7, '夜魇暗潮');
GameModeMap.set(8, '反队长模式');
GameModeMap.set(9, '小贪魔节');
GameModeMap.set(10, '教程');
GameModeMap.set(11, '单中模式');
GameModeMap.set(12, '生疏模式');
GameModeMap.set(13, '英雄限定');
GameModeMap.set(14, '勇士令状');
GameModeMap.set(15, '自定义游戏');
GameModeMap.set(16, '队长征召');
GameModeMap.set(17, '平衡征召');
GameModeMap.set(18, '技能征召');
GameModeMap.set(19, '活动');
GameModeMap.set(20, '全随机死亡竞赛模式');
GameModeMap.set(21, '1v1 中路 solo');
GameModeMap.set(22, '全英雄选择(BP)');
GameModeMap.set(23, '加速模式');
GameModeMap.set(24, '突变');

// 游戏类型
const GameTypeMap: Map<number, string> = new Map();
GameTypeMap.set(0, '普通');
GameTypeMap.set(1, '练习赛');
GameTypeMap.set(2, '锦标赛');
GameTypeMap.set(3, '教程');
GameTypeMap.set(4, '合作对抗机器人');
GameTypeMap.set(5, '天梯组队匹配');
GameTypeMap.set(6, '天梯单排');
GameTypeMap.set(7, '天梯');
GameTypeMap.set(8, '中路对单');
GameTypeMap.set(9, '勇士联赛');

const scheduleMapStatus = new Map();
scheduleMapStatus.set(1,'未开始');
scheduleMapStatus.set(2,'进行中');
scheduleMapStatus.set(3, '已结束');

export { HeroTypeMap, HeroTypeImgMap, HeroAttackTypeImgMap, HeroAttackTypeMap, RoleList, HeroComplexityMap, GameModeMap, GameTypeMap, scheduleMapStatus };