/*
 * @Author: wkj（wkj.kjwoo.cn）
 * @Date: 2023-07-08 12:25:42
 * @LastEditTime: 2023-07-08 12:28:59
 * @Description: 数组常量
 */

/**
 * 0-9的字符串数组
 */
export const numList = '0'
    .repeat(10)
    .split('')
    .map((_, i) => i + '');

/**
 * A-Z字符串数组
 */
export const letterUpperList = '0'
    .repeat(26)
    .split('')
    .map((_, i) => String.fromCharCode(i + 65));

/**
 * a-z字符串数组
 */
export const letterLowerList = '0'
    .repeat(26)
    .split('')
    .map((_, i) => String.fromCharCode(i + 97));
