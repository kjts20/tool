/**
 * 对promise进行过滤
 * @param responsePromise promise对象
 * @param filterHanlder 过滤函数
 * @returns
 */
export const promiseFilter = function <T = any, R = any>(responsePromise: Promise<T>, filterHanlder?: (data: T) => R): Promise<R> {
    return new Promise((resolve: (res: R) => void, reject) => {
        responsePromise
            .then(res => {
                resolve(filterHanlder ? filterHanlder(res) : (res as any));
            })
            .catch(reject);
    });
};

/**
 * 统一为成功返回
 * @param responsePromise
 * @param filterHanlder
 * @returns
 */
export interface Ipromise2ResolveData<D> {
    data: D;
    err: any;
}
export const promise2Resolve = function <T = any, R = any>(responsePromise: Promise<T>, filterHanlder: (data: Ipromise2ResolveData<T>) => R): Promise<R> {
    return new Promise((resolve: (res: R) => void) => {
        responsePromise
            .then(res => {
                const data = {
                    data: res,
                    err: null
                };
                resolve(filterHanlder ? filterHanlder(data) : (data as any));
            })
            .catch(error => {
                const data = {
                    data: null,
                    err: error
                };
                resolve(filterHanlder ? filterHanlder(data) : (data as any));
            });
    });
};
