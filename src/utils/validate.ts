import { trim } from './string';
import { isArr, isFunc, isNum, isObj, isStr, isUndefined } from './type';

// 正则判断字符串格式(非空)
const judgeFormat = function (str, re: RegExp): boolean {
    if (isStr(str)) {
        if (re && isFunc(re.test)) {
            return re.test(trim(str));
        } else {
            console.error('无法校验格式=>', re, str);
            throw new Error('正则错误，无法校验格式');
        }
    } else {
        return false;
    }
};

// 是否电子邮件
export const isEmail = function (str) {
    return judgeFormat(str, /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/);
};

// 判断是否为手机号
export const isPhone = function (str) {
    return judgeFormat(str, /^[1][3,4,5,7,8,9][0-9]{9}$/);
};

// 判断是否为电话号码
export const isTel = function (str) {
    return judgeFormat(str, /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/);
};

// 判断是否URL格式
export const isUrl = function (str) {
    return judgeFormat(
        str,
        /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
    );
};

// [公网判断]判断是否URL格式
export const isPublicUrl = function (str) {
    return judgeFormat(
        str,
        /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
    );
};

// 验证日期格式
export const isDate = function (value) {
    return !/Invalid|NaN/.test(new Date(value).toString());
};

// 日期格式校验
export const isDateStr = function (str) {
    return /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])\s+([0-5][0-9]):([0-5][0-9]):([0-5][0-9]).*?$/.test(str);
};

// 验证ISO类型的日期格式
export const isDateISO = function (value) {
    return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
};

// 验证身份证号码
export const isIdcard = function (value) {
    return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value);
};

// 对象类型
export interface IObject {
    [key: string]: any;
    [key: number]: any;
}

// 校验类型
export type TValidate = (val, row: IObject, column: IColumn) => string | null;

// 字段类型
export interface IColumn {
    // 显示的标题
    title: string;
    // 字段名
    column: string;
    // 校验（返回非空字符串那么就是错误信息）
    validate?: Array<TValidate> | TValidate;
}

/**
 *
 * @param columns 字段
 * @param formData
 */
export const validateForm = function (columns: Array<IColumn>, formData) {
    if (isArr(columns)) {
        const data = isObj(formData) ? formData : {};
        const errDict = {};
        columns.forEach(it => {
            const column = it.column;
            const validates: Array<TValidate> = Array.isArray(it.validate) ? it.validate : it.validate ? [it.validate] : [];
            for (const validate of validates) {
                if (isFunc(validate)) {
                    const res = validate(data[column], data, it);
                    if (isStr(res)) {
                        errDict[column] = res;
                        break;
                    }
                }
            }
        });
        return errDict;
    } else {
        throw new Error('字段数据为空');
    }
};

// 是否必填
const isNotNull = val => !isUndefined(val) && val != null && isStr(val + '');

// 校验规则
export const validateRequired = function (val, row: IObject, column: IColumn) {
    if (isNotNull(val)) {
        return null;
    } else {
        return `${column.title}是必填项`;
    }
};

// 大于0
export const validateGtZero = function (val, row: IObject, column: IColumn) {
    if (isNotNull(val)) {
        const newVal = Number(val);
        if (isNum(newVal) && newVal > 0) {
            return null;
        } else {
            return `${column.title}是必须大于0`;
        }
    } else {
        return null;
    }
};

// 大于等于0
export const validateGteZero = function (val, row: IObject, column: IColumn) {
    if (isNotNull(val)) {
        const newVal = Number(val);
        if (isNum(newVal) && newVal >= 0) {
            return null;
        } else {
            return `“${column.title}”必须大于等于0`;
        }
    } else {
        return null;
    }
};

// 整数
export const validateInt = function (val, row: IObject, column: IColumn) {
    if (isNotNull(val)) {
        const num = Number(val);
        if (!isNaN(num) && Math.ceil(num) === num) {
            return null;
        } else {
            return `“${column.title}”必须是一个整数`;
        }
    } else {
        return null;
    }
};

// 数字
export const validateNum = function (val, row: IObject, column: IColumn) {
    if (isNotNull(val)) {
        if (!isNaN(Number(val))) {
            return null;
        } else {
            return `“${column.title}”必须是一个数字`;
        }
    } else {
        return null;
    }
};

// 手机号验证
export const validatePhone = function (val, row: IObject, column: IColumn) {
    if (isNotNull(val)) {
        if (isPhone(val)) {
            return null;
        } else {
            return `手机号格式不正确`;
        }
    } else {
        return null;
    }
};

// 手机号验证
export const validateEmail = function (val, row: IObject, column: IColumn) {
    if (isNotNull(val)) {
        if (isEmail(val)) {
            return null;
        } else {
            return `邮箱格式不正确`;
        }
    } else {
        return null;
    }
};

// 日期校验
export const validateDate = function (val, row: IObject, column: IColumn) {
    if (isNotNull(val)) {
        if (isDateStr(val)) {
            return null;
        } else {
            return `日期格式不正确`;
        }
    } else {
        return null;
    }
};

// 日期范围校验
export const validateDateRange = function (val, row: IObject, column: IColumn) {
    if (isArr(val)) {
        const [startDate, endDate] = val;
        if (isNotNull(startDate) && !isDateStr(startDate)) {
            return `开始日期格式不正确`;
        }
        if (isNotNull(endDate) && !isDateStr(endDate)) {
            return `结束日期格式不正确`;
        }
        return null;
    } else {
        return `日期范围格式不正确`;
    }
};

// 整数数组
export const validateIntArr = function (val, row: IObject, column: IColumn) {
    if (isArr(val)) {
        for (const it of val) {
            if (!/^\d+$/.test(it)) {
                return '不是整数数组';
            }
        }
        return null;
    } else {
        return `非数组格式`;
    }
};

// 数组判断
export const validateArrRequired = function (val, row: IObject, column: IColumn) {
    if (isArr(val)) {
        if (val.length > 0) {
            return null;
        } else {
            return `${column.title}是必填项`;
        }
    } else {
        return `非数组格式`;
    }
};

// 链接校验
export const validateUrl = function (val, row: IObject, column: IColumn) {
    if (isNotNull(val)) {
        if (isUrl(val)) {
            return null;
        } else {
            return `链接格式不正确`;
        }
    } else {
        return null;
    }
};

// 链接校验
export const validateIdCard = function (val, row: IObject, column: IColumn) {
    if (isNotNull(val)) {
        if (isIdcard(val)) {
            return null;
        } else {
            return `链接格式不正确`;
        }
    } else {
        return null;
    }
};
