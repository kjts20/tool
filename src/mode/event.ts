/**
 * 多事件订阅发布
 */
import { generateRandomStr } from '../string';
import { isFunc, isObj } from '../type';

// 事件监听者字典
interface IEventListenerDict {
    [key: string]: Function;
}

const win = globalThis || window;

export class Event {
    // 事件监听者字典
    private _eventListenerDict: { [eventName: string]: IEventListenerDict } = {};
    // 事件广播
    private _broadcastChannelDict: { [eventName: string]: BroadcastChannel } = {};
    // 添加广播频道
    private addBroadcastChannel(event: string) {
        const that = this;
        const useBroadcastChannel = win?.BroadcastChannel;
        if (useBroadcastChannel) {
            const channel = this._broadcastChannelDict;
            if (!channel[event]) {
                // 创建广播
                const broadcast = new BroadcastChannel(event);
                channel[event] = broadcast;
                // 消息监听机制
                broadcast.onmessage = function (e) {
                    that.emit(event, e.data, e);
                };
            }
        }
    }
    // 移除广播频道
    private removeBroadcastChannel(event: string) {
        const channel = this._broadcastChannelDict;
        if (!channel[event]) {
            delete channel[event];
        }
    }
    private sendBroadcastMsg(event: string, msg: any) {
        const useBroadcastChannel = win?.BroadcastChannel;
        if (useBroadcastChannel) {
            const broadcast = this._broadcastChannelDict?.[event];
            if (broadcast) {
                broadcast.postMessage(msg);
            }
        }
    }

    /**
     *  订阅事件
     * @param event 事件名
     * @param fn 回调函数
     */
    on(event: string, listener: Function) {
        if (isFunc(listener)) {
            // 创建广播事件
            this.addBroadcastChannel(event);
            // 添加监听者
            if (!isObj(this._eventListenerDict[event])) {
                this._eventListenerDict[event] = {};
            }
            let uuid: string;
            do {
                uuid = generateRandomStr(10);
            } while (this._eventListenerDict[event][uuid]);
            this._eventListenerDict[event][uuid] = listener;
            return uuid;
        } else {
            console.error('监听者必须是一个函数：', listener);
            return null;
        }
    }

    /**
     * emit 触发方法
     * @param event 事件名
     * @param args 所有参数
     */
    emit(event, data) {
        const listeners = this._eventListenerDict[event];
        // 通知监听者
        if (isObj(listeners)) {
            for (const uuid in listeners) {
                const listener = listeners[uuid];
                if (isFunc(listener)) {
                    try {
                        listener(data);
                    } catch (err) {
                        console.error('函数=>', listener, '错误=>', err);
                    }
                }
            }
        }
        // 发送广播消息
        this.sendBroadcastMsg(event, data);
    }

    /**
     * 解除绑定
     * @param event 事件名
     * @param listener 监听者
     */
    off(event, ...uuidOrFuncs) {
        if (uuidOrFuncs.length <= 0) {
            // 删除所有监听
            this._eventListenerDict[event] = {};
        } else {
            // 删除多个监听
            const allListeners = this._eventListenerDict[event];
            for (const uuidOrFunc of uuidOrFuncs) {
                for (const uuid in allListeners) {
                    const listener = allListeners[uuid];
                    if (uuidOrFunc === listener || uuid === uuidOrFunc) {
                        delete allListeners[uuid];
                    }
                }
            }
            // 移除广播事件
            if (Object.keys(allListeners).length <= 0) {
                this.removeBroadcastChannel(event);
            }
        }
    }
}
