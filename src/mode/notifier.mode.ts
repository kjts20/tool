/*
 * @Author: wkj（wkj.kjwoo.cn）
 * @Date: 2022-12-07 22:24:31
 * @LastEditTime: 2023-07-08 12:46:11
 * @Description:
 */
/**
 * 监听听者模式
 *  场景：
 */
import { generateRandomStr } from '../utils/string';
import { isFunc, isStr } from '../utils/type';

export class Notifier {
    // 监听者
    private _listenerList: { uuid: string; callback: Function; options?: object }[] = [];

    // 添加监听者
    addListener(callback, options?) {
        if (isFunc(callback)) {
            const uuid = generateRandomStr();
            this._listenerList.push({
                uuid,
                callback,
                options
            });
            return uuid;
        } else {
            console.error('监听者必须是一个函数：', callback);
            return null;
        }
    }

    // 移除监听者
    removeListener(uuid) {
        if (isStr(uuid)) {
            this._listenerList = this._listenerList.filter(it => it.uuid !== uuid);
        }
    }

    // 通知监听者
    notify(...args) {
        this._listenerList.forEach(it => {
            if (isFunc(it.callback)) {
                it.callback(...args, it.options);
            }
        });
    }
}
