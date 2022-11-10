import { isNum } from "./type.utils";

/**
 * 将金额转换为带逗号格式
 * @param num  金额
 * @param decimal 小数点位数
 */
export const moneyFormt = function (num, decimal = 2) {
    let numbers = '';
    numbers = typeof num === 'number' ? num.toFixed(decimal) : Number(num).toFixed(decimal)
    numbers = numbers.indexOf('.') < 0 ? numbers + '.' : numbers
    let newNumber = numbers.replace(/(\d)(?=(\d{3})+\.)/g, '$1,').replace(/\.$/, '');
    return newNumber
}

/**
 * 分转化为元（将金额转换为带逗号格式）
 * @param num  金额
 * @param decimal 小数点位数
 */
export const fee2yuan = function (fee, decimal = 2) {
    const totalFee = isNum(fee) ? fee : 0;
    const yuanStr = (totalFee / 100).toFixed(decimal);
    return yuanStr.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

// 分转换为金额
export const fee2Money = function (fee, decimal = 2) {
    if (isNum(fee)) {
        const yuan = fee / 100;
        const wanUnit = 10000;
        const baiUnit = 100;
        if (yuan > wanUnit) {
            return (yuan / wanUnit).toFixed(decimal) + '万';
        } else if (yuan > baiUnit) {
            return Math.floor(yuan);
        } else {
            return yuan.toFixed(decimal);
        }
    } else {
        return '-';
    }
}