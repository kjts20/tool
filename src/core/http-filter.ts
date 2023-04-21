import { isArr, isFunc, isUndefined } from '../type';
import { HttpResponse, IPageDataType } from './http-server';
import { TErrFunc } from './type';

// 分页过滤数据
export type TPageDataFilter<Item = any> = IPageDataType<Item> & {
    hasBeenLoad: boolean;
    isHasMore: boolean;
    errMsg?: string;
};

// 请求过滤参数
export interface IHttpServerFilter {
    error: TErrFunc;
}

/**
 *  请求分页数据修饰
 * @param pageData
 * @returns
 */
export const pageDecorate = function <ItemType = any>(pageData: IPageDataType<ItemType>): TPageDataFilter<ItemType> {
    const _pageData = pageData || {
        data: [],
        pageSize: 10,
        total: 0,
        pageNum: 0,
        current: 0,
        hasBeenLoad: true,
        isHasMore: false,
        errMsg: '分页数据获取错误'
    };
    const { data, total, pageNum, current } = _pageData;
    const gData: TPageDataFilter<ItemType> = {
        ..._pageData,
        hasBeenLoad: true,
        isHasMore: pageNum > current && total > 0,
        errMsg: isArr(data) ? null : '数据格式错误'
    };
    return gData;
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
        responsePromise: Promise<HttpResponse<IPageDataType<ItemType>>>,
        filterHanlder?: (data: IPageDataType<ItemType>) => IPageDataType<RItemType>
    ): Promise<IPageDataType<RItemType>> {
        return new Promise((resolve: (res: TPageDataFilter<RItemType>) => void, reject) => {
            responsePromise
                .then(res => {
                    const doResolve = pageData => {
                        resolve(pageDecorate(filterHanlder ? filterHanlder(pageData) : pageData));
                    };
                    if (res.success) {
                        doResolve(res.data);
                    } else if (isUndefined(res.success, res.code, res.errcode)) {
                        // 如果已经过滤掉请求信息
                        doResolve(res);
                    } else {
                        reject(res);
                    }
                })
                .catch(reject);
        });
    }

    // 响应统一处理
    unifyRemind<TData = any, RData = TData>(
        responsePromise: Promise<HttpResponse<TData>>,
        filterHanlder?: ((data: TData) => RData) | null,
        showTip = true
    ): Promise<RData> {
        return new Promise((resolve: (res: RData) => void, reject) => {
            responsePromise
                .then(res => {
                    if (res.success) {
                        resolve(filterHanlder ? filterHanlder(res.data) : (res.data as any));
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
