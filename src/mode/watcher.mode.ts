import { isFunc, isNum } from '../type';

// 观察者模式
export class WatcherMode {
    // 通知对象
    private notifyer = (...args) => 0;
    // 观察时间
    private watchTime = 3000;

    // 构造方法
    constructor(cb, time = 3000) {
        if (isFunc(cb)) {
            this.notifyer = cb;
            if (isNum(time)) {
                this.watchTime = time;
            } else {
                console.warn('观察时间不合法：', time);
            }
        } else {
            throw new Error('通知对象找不到');
        }
    }

    // 观察定时器
    private watcherTimer;
    private watcherLongpressTimer;

    // 开始观察(一次回调)
    public start(...args) {
        this.stop();
        this.watcherTimer = setTimeout(() => {
            if (isFunc(this.notifyer)) {
                this.notifyer(...args);
            } else {
                console.error('通知错误：通知人不合法=>', this.notifyer);
            }
        }, this.watchTime);
        return this;
    }

    // 停止观察
    public stop() {
        clearTimeout(this.watcherTimer);
        return this;
    }

    // 观察者之长按定时回调
    public startLongpress(...args) {
        this.stopLongPress();
        this.notifyLongPress(...args);
        this.watcherLongpressTimer = setInterval(() => {
            this.notifyLongPress(...args);
        }, this.watchTime);
        return this;
    }

    // 停止长按
    public stopLongPress() {
        clearInterval(this.watcherLongpressTimer);
        return this;
    }

    // 通知长按
    private notifyLongPress(...args) {
        if (isFunc(this.notifyer)) {
            this.notifyer(...args);
        } else {
            console.error('通知错误：通知人不合法=>', this.notifyer);
        }
    }
}
