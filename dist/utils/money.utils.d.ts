/**
 * 将金额转换为带逗号格式
 * @param num  金额
 * @param decimal 小数点位数
 */
declare const moneyFormt: (num: any, decimal?: number) => string;
/**
 * 分转化为元（将金额转换为带逗号格式）
 * @param num  金额
 * @param decimal 小数点位数
 */
declare const fee2yuan: (fee: any, decimal?: number) => string;
declare const fee2Money: (fee: any, decimal?: number) => string | number;

export { fee2Money, fee2yuan, moneyFormt };
