/*
 * @Author: wkj（wkj.kjwoo.cn）
 * @Date: 2023-07-08 12:31:37
 * @LastEditTime: 2023-07-08 12:32:25
 * @Description: 字符串工具
 */
import { strConst } from '../constant/stringConst';

/**
 * 切割为字符串组
 * @param str
 * @param delimiter
 * @returns
 */
const strSplit = function (str, delimiter = strConst.SPACE) {
    return ((str || strConst.EMPTY) + strConst.EMPTY).split(delimiter);
};

/**
 * 生成className
 * @param classNames 使用的class
 * @returns
 */
export const toClassName = function (...classNames) {
    let classNameArr: Array<string> = [];
    for (const className of classNames) {
        if (className) {
            classNameArr = [...classNameArr, ...strSplit(className, strConst.SPACE)];
        }
    }
    return classNameArr.filter(it => it).join(strConst.SPACE);
};
