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
HeroComplexityMap.set(1,'简单');
HeroComplexityMap.set(2,'中等');
HeroComplexityMap.set(3,'困难');

// 英雄定位
const RoleList: string[] = ['核心', '辅助', '爆发', '控制', '打野', '耐久', '逃生', '推进', '先手'];

export { HeroTypeMap, HeroTypeImgMap, HeroAttackTypeImgMap, HeroAttackTypeMap, RoleList, HeroComplexityMap };