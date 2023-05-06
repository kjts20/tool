/*
 * @Description: 时间工具
 * @Author: wkj
 * @Date: 2020-07-07 11:42:45
 * @LastEditTime: 2022-11-10 21:08:26
 * @LastEditors: wkj wkj@kjwoo.cn
 */

import { isNum, isStr } from './type';

// 转换为时间对象
const toDateObj = function (date) {
    if (/^\d{8}$/.test(date)) {
        date = (date + '').replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');
    } else if (/^\d{0,1}\d{3}$/.test(date)) {
        date = new Date().getFullYear() + (date + '').replace(/^(\d{0,1})(\d)(\d{2})$/, (_, $1, $2, $3) => `-${$1.length > 0 ? '' : '0'}${$2}-${$3}`);
    }
    let newDate = new Date(date);
    if (isNaN(newDate.getTime())) {
        return new Date(0);
    } else {
        return newDate;
    }
};

// 转换为时间格式
export const toDateTime = function (date, time?, format = 'YY-MM-DD hh:mm:ss') {
    const dateObj = toDateObj(date);
    if (isStr(time) || isNum(time)) {
        // 处理ios不支持问题
        var timeS = 0;
        (time + '').replace(/^(\d+)(\d{2})$/, function (_, _h, _m) {
            var h = parseInt(_h);
            h = isNaN(h) ? 0 : h >= 0 && h <= 23 ? h : 0;
            timeS += h * 3600;
            var m = parseInt(_m);
            m = isNaN(m) ? 0 : m >= 0 && m <= 59 ? m : 0;
            timeS += m * 60;
            return '';
        });
        // 处于东8区，时间快8个小时
        timeS -= 8 * 3600;
        return date2str(dateObj.getTime() + timeS * 1000, format);
    } else {
        return date2str(dateObj, format);
    }
};

//时间转字符串
export const date2str = function (date, format = 'YY-MM-DD hh:mm:ss') {
    date = toDateObj(date);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    if (isNaN(year)) {
        return '';
    } else {
        let get2LenStr = val => (val >= 10 ? val : '0' + val);
        let timeStr = format
            .replace(/YY/g, year)
            .replace(/Y/g, (year + '').slice(2))
            .replace(/MM/g, get2LenStr(month))
            .replace(/M/g, month)
            .replace(/DD/g, get2LenStr(day))
            .replace(/D/g, day)
            .replace(/hh/g, get2LenStr(h))
            .replace(/h/g, h)
            .replace(/mm/g, get2LenStr(m))
            .replace(/m/g, m)
            .replace(/ss/g, get2LenStr(s))
            .replace(/s/g, s);
        return timeStr;
    }
};

//现在时间
export const now = function (format = 'YY-MM-DD') {
    return date2str(new Date(), format);
};

//获取当前时间
export const getCurrentTimeStr = (format = 'YY-MM-DD hh:mm') => {
    return date2str(new Date(), format);
};

//获取当前时间戳
export const getCurrentStamp = () => {
    return new Date().getTime();
};

//时间戳转字符串
export const timestamp2str = (timestamp, format) => {
    return date2str(new Date(timestamp), format);
};

//时间戳转日期
export const timestamp2dateStr = timestamp => {
    return date2str(new Date(timestamp), 'YY-MM-DD');
};

//时间戳转日期时间
export const timestamp2datetimeStr = timestamp => {
    return date2str(timestamp, 'YY-MM-DD hh:mm:ss');
};

//时间字符串转日期
export const timeStr2dateStr = timeStr => {
    return date2str(timeStr, 'YY-MM-DD');
};

//字符串转时间戳
export const dateStr2Timestamp = timeStr => {
    return toDateObj(timeStr).getTime();
};

//时间字符串转日期
export const timeStr2datetimeStr = time2str => {
    return date2str(time2str, 'YY-MM-DD hh:mm:ss');
};

// 字符串或者时间戳转时间对象(个性化转成时间)
export const personalize2DateStr = (timeStr, format = 'YY年MM月DD日') => {
    return date2str(timeStr, format);
};

//距离现在秒数
export const toCurrentSeconds = timeStr => {
    return (getCurrentStamp() - dateStr2Timestamp(timeStr)) / 1000;
};

// ===================== 范围 =========================

// 一天开始时间
const dayStartStr = ' 00:00:00';
const dayEndStr = ' 23:59:59';
// 获取一天毫秒数
const dayMilliseconds = 24 * 60 * 60 * 1000;

// 日时间范围
export const getDayRange = function (day = 0, startDate = new Date()) {
    const startDateYmd = date2str(startDate, 'YY-MM-DD');
    const range: Array<string> = [startDateYmd + dayStartStr, startDateYmd + dayEndStr];
    const dayYmd = timestamp2str(startDate.getTime() + day * dayMilliseconds, 'YY-MM-DD');
    if (day < 0) {
        // 计算过去时间，那么调整开始时间
        range[0] = dayYmd + dayStartStr;
    } else {
        // 计算未来时间，那么调整结束时间
        range[1] = dayYmd + dayEndStr;
    }
    return range;
};

/**
 * 生成日范围
 * @param startTime 开始日期
 * @param endTime 开始日期
 */
export const genDayRange = function (startYmd, endYmd) {
    return [date2str(startYmd, 'YY-MM-DD') + dayStartStr, date2str(endYmd, 'YY-MM-DD') + dayEndStr];
};
