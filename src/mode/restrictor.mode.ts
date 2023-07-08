import { generateRandomStr } from '../string';
import { isObj } from '../type';

interface INotifyer {
    uuid?: string;
    callback: Function;
    options?: Object;
}

// 限流器
export class RestrictorMode {
    // 限流时间
    private time = 500;

    // 通知函数(可以是单个可以是多个)
    private notifyers = {};
    // 记录消息
    private messages: any;
    // 定时任务记录
    private timer: any;

    constructor(callback?) {
        if (typeof callback === 'function') {
            this.addNotifyer({ callback });
        } else {
            console.warn('没有通知函数，之后记得绑定哦');
        }
    }

    public addNotifyer(it: INotifyer) {
        if (typeof it === 'object' && it !== null && typeof it.callback === 'function') {
            const uuid = generateRandomStr();
            this.notifyers[uuid] = {
                callback: it.callback,
                options: it.options
            };
            return uuid;
        } else {
            console.error('添加通知者格式不正确：', it);
            return '';
        }
    }
    public removeNotifyer(uuid: string) {
        delete this.notifyers[uuid];
        console.log('已经移除通知者', uuid);
    }

    public start(time) {
        let t = parseInt(time);
        if (!isNaN(t)) {
            this.time = t;
        }
        this.messages = null;
        this.timer = setInterval(() => {
            this.trySendMessage({
                stop: false
            });
        }, this.time);
    }
    public stop(isSendData = false) {
        this.messages = null;
        clearInterval(this.timer);
        if (isSendData === true) {
            this.trySendMessage(
                {
                    stop: true
                },
                []
            );
        }
    }

    // 试图发送消息
    private trySendMessage(options?, msgArr?: any[]) {
        const messages = Array.isArray(msgArr) ? msgArr : this.messages;
        this.messages = null;
        if (Array.isArray(messages)) {
            if (typeof this.notifyers === 'object' && Object.keys(this.notifyers).length > 0) {
                for (const uuid in this.notifyers) {
                    const it = this.notifyers[uuid];
                    if (typeof it === 'object' && it !== null && typeof it.callback === 'function') {
                        it.callback(
                            {
                                interval: this.time,
                                ...(isObj(options) ? options : {})
                            },
                            ...messages,
                            it.options
                        );
                    }
                }
            }
        } else {
            // console.log('消息为空，无须发送');
        }
    }

    // 记录
    public push(...args) {
        this.messages = args;
    }
}
