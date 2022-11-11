/*
 * @Description: 样式转换文件
 * @Author: wkj
 * @Date: 2020-09-24 17:50:43
 * @LastEditTime: 2022-11-10 21:08:28
 * @LastEditors: wkj wkj@kjwoo.cn
 */
import { camelToKebab } from './string';

const _addUnitAttr = [
    'height',
    'minHeight',
    'width',
    'minWidth',
    'padding',
    'paddingTop',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',
    'margin',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
    'top',
    'left',
    'right',
    'bottom'
];
const addUnitAttr = [..._addUnitAttr, ..._addUnitAttr.map(it => camelToKebab(it)).filter(it => !_addUnitAttr.includes(it))];

// 转换成样式字符串
export const toStyleStr = (styleObj, unit = 'rpx') => {
    if (Array.isArray(styleObj)) {
        return styleObj.join(';');
    } else {
        if (typeof styleObj === 'object' && styleObj !== null) {
            let style: string[] = [];
            for (const k in styleObj) {
                if (typeof k === 'string') {
                    let val = styleObj[k];
                    if (val !== undefined) {
                        if (typeof val === 'number') {
                            if (addUnitAttr.includes(k)) {
                                val = val + unit;
                            }
                        }
                        style.push(`${camelToKebab(k)}:${val}`);
                    }
                }
            }
            return style.length > 0 ? style.join(';') + ';' : '';
        } else {
            return styleObj;
        }
    }
};

// 把样式字符串转换为对象
export const toStyleObj = styleStr => {
    if (typeof styleStr === 'string' && styleStr !== '') {
        const styleItemRe = /^\s*(.*?)\s*:\s*(.*?)\s*$/;
        const style = {};
        for (const it of styleStr.split(';')) {
            if (styleItemRe.test(it)) {
                let [_, key, val] = it.match(styleItemRe) || [];
                style[key.replace(/\-([a-z])/g, (_, lc) => lc.toUpperCase())] = val;
            }
        }
        return style;
    } else {
        return {};
    }
};

//在父容器中沾满并居中样式生成
export const fixContainer = function (parentWidth, parentHeight, childWidth, childHeight) {
    const pw = parseFloat(parentWidth);
    const ph = parseFloat(parentHeight);
    const cw = parseFloat(childWidth);
    const ch = parseFloat(childHeight);
    if (!isNaN(pw) && !isNaN(ph) && !isNaN(cw) && !isNaN(ch)) {
        const parentRate = ph / pw;
        const childRate = ch / cw;
        if (!isNaN(parentRate) && !isNaN(childRate)) {
            let width = 0;
            let height = 0;
            if (parentRate > childRate) {
                // 宽占满
                width = pw;
                height = (pw / cw) * ch;
            } else {
                // 高占满
                height = ph;
                width = (ph / ch) * cw;
            }
            return toStyleStr(
                {
                    height,
                    width
                },
                'px'
            );
        }
    }
    return '';
};
