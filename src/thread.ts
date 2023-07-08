/*
 * @Author: wkj（wkj.kjwoo.cn）
 * @Date: 2023-07-04 21:26:23
 * @LastEditTime: 2023-07-04 21:26:27
 * @Description: 线程相关工具
 */
export const sleep = function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
