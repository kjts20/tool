/**
 * 多事件订阅发布
 */
import { isArr, isFunc, isStr } from '../type';

/**
 * @deprecated
 *  请使用 Event类代替
 *  丢弃原因：
 *      1、监听时候使用的函数内存指针保存，如果一个函数需要绑定多次情况，那么就无法做到
 *      2、解除绑定需要传入原函数，弊端：使用匿名函数，无法解除绑定；那么函数需要声明为具名函数才能操作
 *  推荐使用：Event代替
 *     推荐点1、添加监听会自动生成uuid，并且不校验是否该函数是否受用过
 *     推荐点2、解除绑定可以使用原函数也可以使用uuid
 */
export class NotifyEvent {
    // 事件监听者字典
    private _eventListenerDict: { [eventName: string]: Array<Function> } = {};

    /**
     *  订阅事件
     * @param event 事件名
     * @param fn 回调函数
     */
    on(event, listener: Function) {
        if (isFunc(listener)) {
            if (isStr(event + '')) {
                if (!isArr(this._eventListenerDict[event])) {
                    this._eventListenerDict[event] = [];
                } else {
                    if (this._eventListenerDict[event].filter(it => it === listener).length > 0) {
                        console.warn('该方法已经监听过了，无需重复监听', event);
                        return false;
                    }
                }
                this._eventListenerDict[event].push(listener);
                return true;
            } else {
                console.error('事件名不合法：', event);
                return false;
            }
        } else {
            console.error('监听者必须是一个函数：', listener);
            return false;
        }
    }

    /**
     * emit 触发方法
     * @param event 事件名
     * @param args 所有参数
     */
    emit(event, ...args) {
        const listeners = this._eventListenerDict[event];
        if (isArr(listeners) && listeners.length > 0) {
            for (const listener of listeners) {
                if (isFunc(listener)) {
                    try {
                        listener(...args);
                    } catch (err) {
                        console.error('函数=>', listener, '错误=>', err);
                    }
                }
            }
        }
    }

    /**
     * 解除绑定
     * @param event 事件名
     * @param listener 监听者
     */
    off(event, ...listeners) {
        if (listeners.length <= 0) {
            // 删除所有监听
            this._eventListenerDict[event] = [];
        } else {
            // 删除多个监听
            const allListeners = this._eventListenerDict[event];
            const len = isArr(allListeners) ? allListeners.length : 0;
            for (let i = len - 1; i >= 0; i--) {
                const listener = allListeners[i];
                for (const fn of listeners) {
                    if (listener === fn) {
                        allListeners.splice(i, 1);
                    }
                }
            }
        }
    }
}
