import { isArr, isFunc, isStr } from "../type";

/**
 * 多事件订阅发布
 */
class NotifyEvent {
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
                        console.warn('该方法已经监听过了，无需重复监听', event)
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
                        console.error("函数=>", listener, '错误=>', err);
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

export default NotifyEvent;

