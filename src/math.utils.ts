// 求数组和
export const arrSum = function (arr: any[], itemCb?) {
    let sum = 0;
    if (!Array.isArray(arr)) {
        arr = [arr];
    }
    const itemDeal = typeof itemCb === 'function' ? itemCb : Number;
    for (const it of arr) {
        let val = itemDeal(it);
        if (!isNaN(val)) {
            sum += val;
        }
    }
    return sum;
};

// 求数组平均数
export const arrAverage = function (arr: number[]) {
    const sum = arrSum(arr);
    if (Array.isArray(arr)) {
        return sum / arr.length;
    } else {
        return sum;
    }
};
