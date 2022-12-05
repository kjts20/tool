/**
 * 对promise进行过滤
 * @param responsePromise promise对象
 * @param filterHanlder 过滤函数
 * @returns
 */
export const promiseFilter = function <T = any, R = any>(responsePromise: Promise<T>, filterHanlder?: (data: T) => any): Promise<R> {
    return new Promise((resolve: (res: R) => void, reject) => {
        responsePromise
            .then(res => {
                resolve(filterHanlder ? filterHanlder(res) : res);
            })
            .catch(reject);
    });
};
