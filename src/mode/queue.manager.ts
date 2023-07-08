/*
 * @Author: wkj（wkj.kjwoo.cn）
 * @Date: 2022-12-07 22:24:31
 * @LastEditTime: 2023-07-08 12:45:38
 * @Description: 队列管理器
 */
import { generateRandomStr } from '../utils/string';
import { isArr, isNum, isObj, isUndefined } from '../utils/type';

// 消费者options对象
export interface IConsumerProps {
    // 消费途径（频道）
    channel: string;
    // 消费目标
    target?: string;
    // 其他的键
    [key: string]: any;
}

// 消费者callback对象
type TConsumerCallback = (options: IConsumerProps, ...args: any[]) => void;

// 消费者结构
interface IConsumer {
    uuid?: string;
    callback: TConsumerCallback;
    options: IConsumerProps;
}

// 消费者字典
interface IConsumerDict {
    [key: string]: IConsumer;
}

// 消息类型
type TMessageItem = [IConsumerProps, any[]];

// 队列管理者
export class QueueManager {
    // 消费间隔
    private time = 500;

    // 通知函数(可以是单个可以是多个)
    private consumers: IConsumerDict = {};
    // 记录消息
    private messages: Array<TMessageItem> = [];
    // 定时任务记录
    private timer: any;

    // 添加监听者
    public addConsumer(it: IConsumer) {
        if (typeof it === 'object' && it !== null && typeof it.callback === 'function') {
            const uuid = generateRandomStr();
            this.consumers[uuid] = {
                callback: it.callback,
                options: it.options
            };
            return uuid;
        } else {
            throw new Error('添加通知者格式不正确');
        }
    }
    public removeConsumer(uuid: string) {
        delete this.consumers[uuid];
    }

    // 开始工作
    public start(time?: number) {
        if (isNum(time)) {
            this.time = time;
        }
        if (!isArr(this.messages)) {
            this.messages = [];
        }
        clearInterval(this.timer);
        const doConsumer = () => {
            const message = this.messages.pop();
            if (message) {
                this.sendMessage(message);
            }
        };
        // 启动时候就开始消费数据
        doConsumer();
        // 消费以后的数据
        this.timer = setInterval(doConsumer, this.time);
    }

    // 结束工作
    public stop() {
        this.messages = [];
        clearInterval(this.timer);
    }

    // 发送消息
    private sendMessage(message: TMessageItem) {
        if (message && isObj(this.consumers)) {
            for (const uuid in this.consumers) {
                const it = this.consumers[uuid];
                if (typeof it === 'object' && it !== null && typeof it.callback === 'function') {
                    const [messageOptions, args] = message;
                    const options = it.options;
                    if (options.channel === messageOptions.channel) {
                        try {
                            it.callback(
                                {
                                    interval: this.time,
                                    ...options,
                                    ...messageOptions
                                },
                                ...args
                            );
                        } catch (error) {
                            console.error('[队列]-消费者执行错误', { customer: it, error });
                        }
                    }
                }
            }
        }
    }

    // 发送消息
    public push(presetOptions: IConsumerProps, ...args) {
        this.messages.unshift([presetOptions, args]);
    }
}
