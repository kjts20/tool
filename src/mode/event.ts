/**
 * 多事件订阅发布
 */
import { generateRandomStr } from "../string";
import { isFunc, isObj } from "../type";

// 事件监听者字典
interface IEventListenerDict {
    [key: string]: Function
}

export class Event {
    // 事件监听者字典
    private _eventListenerDict: { [eventName: string]: IEventListenerDict } = {};

    /**
     *  订阅事件
     * @param event 事件名
     * @param fn 回调函数
     */
    on(event:string, listener: Function) {
        if (isFunc(listener)) {
            if (!isObj(this._eventListenerDict[event])) {
                this._eventListenerDict[event] = {};
            }
            let uuid:string;
            do{
               uuid = generateRandomStr(10); 
            }while(this._eventListenerDict[event][uuid]);
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
    emit(event, ...args) {
        const listeners = this._eventListenerDict[event];
        if(isObj(listeners)){
            for (const uuid in listeners) {
                const listener = listeners[uuid]; 
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
                    if(uuidOrFunc === listener || uuid === uuidOrFunc){
                        delete allListeners[uuid];
                    }
                }
            }
        }
    }
}


