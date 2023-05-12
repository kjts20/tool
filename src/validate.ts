import { isDate, isDateStr, isEmail, isIdcard, isPhone, isUrl } from './string';
import { isArr, isFunc, isNum, isObj, isStr, isUndefined, getLen } from './type';

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
