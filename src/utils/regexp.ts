/*
 * @Author: wkj（wkj.kjwoo.cn）
 * @Date: 2022-12-07 22:24:31
 * @LastEditTime: 2023-07-08 11:24:36
 * @Description: 正则工具
 */

// 单标签
const sigleHtmlTag = ['img', 'link', 'hr', 'br', 'input'];

/**
 * 替换空格
 * @param str
 * @param replaceText
 * @returns
 */
export const replaceSpace = function (str, replaceText = '&ensp;') {
    // 处理单标签（严格模式）
    let goal = str.replace(/<[a-z0-9-]+.*?\/>/gi, $0 => encodeURIComponent($0));
    // 处理非严谨的单标签写法
    sigleHtmlTag.forEach(it => {
        goal = goal.replace(new RegExp(`<${it}\.*?>`, 'gi'), $0 => encodeURIComponent($0));
    });
    // 替换双标签
    goal = goal.replace(/<([a-z0-9-]+)(.*?)>(.*?)<\/\1\s*>/gi, ($0, $1, $2, $3) => `<${$1}${$2}>${$3.replace(/\s/g, replaceText)}</${$1}>`);
    // 对编码的数据进行解码
    return decodeURIComponent(goal);
};
