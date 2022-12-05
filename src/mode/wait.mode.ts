/**
 * 等待器
 * 1、触发事件之后，稍等片刻再执行
 * 注： 如果上一次事件未回调，再次触发事件，那么将取消上次事件
 */
import { generateRandomStr } from '../string';
import { isNum, isObj } from '../type';

interface IWaiter {
    uuid?: string;
    callback: Function;
    options?: Object;
}

export class WaiterMode {
    // 等待时间
    private time = 1000;

    // 通知函数(可以是单个可以是多个)
    private Waiters = {};
    // 定时任务记录
    private timer: any;

    constructor(callback?: Function, waitTime = 1000) {
        this.time = isNum(waitTime) ? waitTime : 1000;
        if (typeof callback === 'function') {
            this.addWaiter({ callback });
        }
    }

    public addWaiter(it: IWaiter) {
        if (typeof it === 'object' && it !== null && typeof it.callback === 'function') {
            const uuid = generateRandomStr();
            this.Waiters[uuid] = {
                callback: it.callback,
                options: it.options
            };
            return uuid;
        } else {
            console.error('添加通知者格式不正确：', it);
            return '';
        }
    }
    public removeWaiter(uuid: string) {
        delete this.Waiters[uuid];
    }

    // 发送消息
    public send(...messages) {
        if (typeof this.Waiters === 'object' && Object.keys(this.Waiters).length > 0) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                for (const uuid in this.Waiters) {
                    const { callback, options } = this.Waiters[uuid] || {};
                    if (typeof callback === 'function') {
                        callback(
                            {
                                interval: this.time,
                                ...(isObj(options) ? options : {})
                            },
                            ...messages
                        );
                    }
                }
            }, this.time);
        }
    }
}
