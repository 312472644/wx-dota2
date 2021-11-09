// 英雄类型
const HeroTypeMap: Map<number, string> = new Map();
HeroTypeMap.set(0, '../../assets/common/power.png'); // 力量
HeroTypeMap.set(1, '../../assets/common/agile.png'); // 敏捷
HeroTypeMap.set(2, '../../assets/common/intellect.png'); // 智力 

// 英雄攻击类型
const HeroAttackTypeMap: Map<number, string> = new Map();
HeroAttackTypeMap.set(1, '../../assets/common/melee.svg'); // 近战
HeroAttackTypeMap.set(2, '../../assets/common/ranged.svg'); // 远程
export { HeroTypeMap, HeroAttackTypeMap };