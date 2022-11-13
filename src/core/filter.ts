import { isUndefined } from '../type';
import { HttpResponse } from './http-server';
import { TErrFunc } from './type';

// 请求过滤参数
export interface IHttpServerFilter {
    error: TErrFunc;
}

// 请求过滤
export class ResponseFilter {
    constructor(options: IHttpServerFilter) {
        const { error } = options;
        if (error) {
            this.error = error;
        }
    }
    // 错误函数
    error: IHttpServerFilter['error'] = console.error;

    // 对响应数据进行过滤
    filter(responsePromise: Promise<HttpResponse>, filterHanlder?: (data) => any): Promise<any> {
        return new Promise((resolve: (res: HttpResponse) => void, reject) => {
            responsePromise
                .then(res => {
                    if (res.success) {
                        resolve(filterHanlder ? filterHanlder(res.data) : res.data);
                    } else if (isUndefined(res.success, res.code, res.errcode)) {
                        // 如果已经过滤掉请求信息
                        resolve(filterHanlder ? filterHanlder(res) : res);
                    } else {
                        reject(res);
                    }
                })
                .catch(reject);
        });
    }

    // 响应统一处理
    unifyRemind(responsePromise: Promise<HttpResponse>, filterHanlder?: ((data) => any) | null, showTip = true): Promise<any> {
        return new Promise((resolve: (res: HttpResponse) => void, reject) => {
            responsePromise
                .then(res => {
                    if (res.success) {
                        resolve(filterHanlder ? filterHanlder(res.data) : res.data);
                    } else {
                        if (showTip) {
                            if (res.code === 230) {
                                for (const it of res.data) {
                                    this.error(it.message || '系统开小差了～', res);
                                    break;
                                }
                            } else {
                                this.error(res.msg || '系统开小差了～', res);
                            }
                        }
                        reject(res);
                    }
                })
                .catch(err => {
                    if (showTip) {
                        this.error(err.msg || '系统开小差了～', err);
                    }
                    reject(err);
                });
        });
    }
}
