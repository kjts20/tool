// 过万处理
export const overTenThousand = function (num) {
    var newNum = parseInt(num);
    if (isNaN(newNum)) {
        return 0;
    } else {
        const len = (newNum + '').length;
        if (len > 8) {
            return (newNum / 10000 / 10000).toFixed(2) + '亿';
        } else if (len > 4) {
            return (newNum / 10000).toFixed(2) + '万';
        } else {
            return newNum;
        }
    }
};
