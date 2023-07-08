import { isArr, isFunc, isStr, isUndefined } from '../utils/type';
import { HttpResponse, IPageDataType } from './http-server';
import { TErrFunc } from './type';

// 分页数据结果
export interface IResultPaging<IDateItem = any> {
    paging: Omit<IPageDataType, 'data'> & {
        success: boolean;
        error: boolean;
        fail: boolean;
        msg: string;
        hasMore: boolean;
        empty: boolean;
    };
    data: IPageDataType<IDateItem>['data'];
}

// 请求过滤参数
export interface IHttpServerFilter {
    error: TErrFunc;
}

/**
 * 默认分页数据
 */
export const defaultPaging = {
    pageSize: 10,
    pageNum: 0,
    total: 0,
    current: 1,
    hasMore: true,
    success: false,
    error: false,
    fail: false,
    empty: false,
    msg: '初始化分页'
};

/**
 *  请求分页数据修饰
 * @param pageData
 * @returns
 */
export const pageDecorate = function <ItemType = any>(
    success: boolean,
    fail: boolean,
    error: boolean,
    msg: string,
    pageData: IPageDataType<ItemType>
): IResultPaging<ItemType> {
    const { data: _data, pageSize = 10, pageNum = 0, total = 0, current = 1 } = pageData;
    const data = isArr(_data) ? [..._data] : [];
    return {
        paging: {
            pageSize,
            pageNum,
            total,
            current,
            hasMore: pageNum > current && total > 0,
            success,
            error,
            fail,
            empty: !(data.length > 0 && total > 0),
            msg: isArr(_data) ? msg : '数据格式错误'
        },
        data
    };
};

// 请求过滤
export class ResponseFilter {
    constructor(options: IHttpServerFilter) {
        const { error } = options;
        if (error) {
            this.error = error;
        }
    }
    // 错误函数
    private error: IHttpServerFilter['error'] = console.error;

    // 设置错误函数
    setErrorFunc(errorFunc: IHttpServerFilter['error']) {
        if (isFunc(errorFunc)) {
            this.error = errorFunc;
        }
    }

    // 对响应数据进行过滤
    filter<TData = any, RData = TData>(responsePromise: Promise<HttpResponse<TData>>, filterHanlder?: (data: TData) => RData): Promise<RData> {
        return new Promise((resolve: (res: RData) => void, reject) => {
            responsePromise
                .then(res => {
                    if (res.success) {
                        resolve(filterHanlder ? filterHanlder(res.data) : (res.data as any));
                    } else if (isUndefined(res.success, res.code, res.errcode)) {
                        // 如果已经过滤掉请求信息
                        resolve(filterHanlder ? filterHanlder(res as any) : (res as any));
                    } else {
                        reject(res);
                    }
                })
                .catch(reject);
        });
    }

    // 对响应数据进行过滤
    pageFilter<ItemType = any, RItemType = ItemType>(
        getPagingService: Promise<HttpResponse<IPageDataType<ItemType>>>,
        filterHanlder?: (data: IPageDataType<ItemType>) => IPageDataType<RItemType>
    ): Promise<IResultPaging<RItemType>> {
        return new Promise((resolve: (res: IResultPaging<RItemType>) => void) => {
            try {
                getPagingService
                    .then(res => {
                        const { success, fail, error, msg, data } = res;
                        const newData = (filterHanlder && isFunc(filterHanlder) ? filterHanlder : d => d)(data);
                        resolve(pageDecorate<RItemType>(success, fail, error, msg, newData));
                    })
                    .catch(err => {
                        console.error('获取分页数据错误1：', err);
                        resolve(pageDecorate<RItemType>(false, false, true, err?.msg || err || '获取分页数据错误', [] as any));
                    });
            } catch (err) {
                console.error('获取分页数据错误2：', err);
                resolve(pageDecorate<RItemType>(false, false, true, err?.msg || err || '获取分页数据错误', [] as any));
            }
        });
    }

    /**
     * 操作
     * @param responsePromise
     * @param filterHanlder
     * @returns
     */
    processing<TData = any, RData = TData>(responsePromise: Promise<HttpResponse<TData>>, filterHanlder?: (data: TData) => RData): Promise<RData> {
        return new Promise((resolve: (res: RData) => void, reject) => {
            responsePromise
                .then(res => {
                    const { data, success } = res;
                    if (success) {
                        if (filterHanlder) {
                            resolve(filterHanlder(data));
                        } else {
                            resolve(data as any);
                        }
                    } else {
                        if (res.code === 230) {
                            for (const it of res.data as any) {
                                reject(it.message || '系统开小差了～');
                                break;
                            }
                        } else {
                            reject(res.msg || '系统开小差了～');
                        }
                    }
                })
                .catch(err => {
                    reject(err.msg || isStr(err) ? err : '系统开小差了～');
                });
        });
    }

    // 响应统一处理
    unifyRemind<TData = any, RData = TData>(
        responsePromise: Promise<HttpResponse<TData>>,
        filterHanlder?: (data: TData) => RData,
        showTip = true
    ): Promise<RData> {
        return new Promise((resolve: (res: RData) => void, reject) => {
            responsePromise
                .then(res => {
                    const { data, success } = res;
                    if (success) {
                        if (filterHanlder) {
                            resolve(filterHanlder(data));
                        } else {
                            resolve(data as any);
                        }
                    } else {
                        if (showTip) {
                            if (res.code === 230) {
                                // 校验时候
                                for (const it of res.data as any) {
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
