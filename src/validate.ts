import { isDate, isEmail, isIdcard, isPhone, isUrl } from './string';
import { isArr, isFunc, isNum, isObj, isStr, isUndefined } from './type';

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

// 校验规则
export const validateRequired = function (val, row: IObject, column: IColumn) {
    if (!isUndefined(val) && val != null && isStr(val + '')) {
        return null;
    } else {
        return `${column.title}是必填项`;
    }
};

// 大于0
export const validateGtZero = function (val, row: IObject, column: IColumn) {
    if (!isUndefined(val) && val != null && isStr(val + '')) {
        const newVal = Number(val);
        if (isNum(newVal) && newVal > 0) {
            return null;
        } else {
            return `${column.title}是必须大于0`;
        }
    } else {
        return `${column.title}是必填项`;
    }
};
// 大于等于0
export const validateGteZero = function (val, row: IObject, column: IColumn) {
    if (!isUndefined(val) && val != null && isStr(val + '')) {
        const newVal = Number(val);
        if (isNum(newVal) && newVal >= 0) {
            return null;
        } else {
            return `${column.title}是必须大于等于0`;
        }
    } else {
        return `${column.title}是必填项`;
    }
};

// 手机号验证
export const validatePhone = function (val, row: IObject, column: IColumn) {
    if (isPhone(val)) {
        return null;
    } else {
        return `手机号格式不正确`;
    }
};

// 手机号验证
export const validateEmail = function (val, row: IObject, column: IColumn) {
    if (isEmail(val)) {
        return null;
    } else {
        return `邮箱格式不正确`;
    }
};

// 日期校验
export const validateDate = function (val, row: IObject, column: IColumn) {
    if (isDate(val)) {
        return null;
    } else {
        return `日期格式不正确`;
    }
};

// 链接校验
export const validateUrl = function (val, row: IObject, column: IColumn) {
    if (isUrl(val)) {
        return null;
    } else {
        return `链接格式不正确`;
    }
};

// 链接校验
export const validateIdCard = function (val, row: IObject, column: IColumn) {
    if (isIdcard(val)) {
        return null;
    } else {
        return `链接格式不正确`;
    }
};
