import { isArr, isFunc, isNum, isObj, isStr } from '../type';
import { mergeUrl } from '../url';
import { trim } from '../string';

// 获取请求头部
const getHeader = function (...headers) {
    let useHeader = {};
    for (const header of headers) {
        useHeader = { ...useHeader, ...(isObj(header) ? header : {}) };
    }
    return useHeader;
};

//请求方式
enum EMethodType {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PUT = 'PUT'
}

// 响应的数据格式
export interface IResponse<DataType = any> {
    msg: string;
    errcode: 0 | 1;
    code: number;
    data: DataType;
}

// 请求状态
export interface IStatus {
    success: boolean;
    fail: boolean;
    error: boolean;
    timeout: boolean;
}

// http响应状态
export type HttpResponse<DataType = any> = IResponse<DataType> & IStatus;

// 分页数据格式
export interface IPageDataType<Item = any> {
    pageSize: number; //每页条数
    current: number; // 当前页数
    total: number; // 总共条数
    pageNum: number; //总页数
    data: Array<Item>; // 数据
}

// 统一响应处理
export const unifiedResponse = function (response?: IResponse) {
    if (!response) {
        response = {
            errcode: 1,
            code: 500,
            data: null,
            msg: '系统错误'
        };
    }
    const { code, errcode, msg } = response;
    const httpResponse: HttpResponse = {
        ...response,
        success: true,
        fail: false,
        error: false,
        timeout: false
    };
    if (errcode === 0) {
        if (code === 200) {
            httpResponse.success = true;
            httpResponse.fail = false;
            httpResponse.error = false;
        } else if (isNum(code)) {
            httpResponse.success = false;
            httpResponse.fail = true;
            httpResponse.error = false;
        } else {
            // 缺失code
            httpResponse.success = true;
            httpResponse.code = 200;
            httpResponse.fail = false;
            httpResponse.error = false;
        }
    } else if (errcode === 1) {
        httpResponse.success = false;
        httpResponse.fail = false;
        httpResponse.error = true;
        if (!isNum(code)) {
            httpResponse.code = 500;
        }
    } else {
        httpResponse.success = false;
        httpResponse.fail = false;
        httpResponse.error = true;
        httpResponse.msg = '返回格式不正确';
    }
    if (!isStr(msg)) {
        httpResponse.msg = httpResponse.error ? '系统错误' : httpResponse.success ? 'success' : '失败';
    }
    return httpResponse;
};

// 成功响应
export const successResponse = function (msg: string, data: any = null) {
    return unifiedResponse({
        code: 200,
        errcode: 0,
        msg,
        data
    });
};

// 错误响应
export const errResponse = function (msg: string, data: any = null) {
    return unifiedResponse({
        errcode: 1,
        code: 500,
        msg,
        data
    });
};

// 请求函数
export interface IRequestOptions {
    url: string;
    data: object;
    header?: object;
    timeout?: number;
    method: EMethodType;
    success: (data: object) => void;
    error: (err: any) => void;
    complete: (err: any) => void;
}

// 请求函数
export interface IRequestFileOptions {
    url: string;
    formData: object;
    name: string;
    filePath: string;
    header?: object;
    timeout?: number;
    method: EMethodType;
    success: (data: object) => void;
    error: (err: any) => void;
    complete: (err: any) => void;
}

// 请求构造器的参数
export interface IHttpServerOptions {
    // 使用的主机
    host?: string;
    // api前缀
    apiPrefix?: string;
    // 头部信息 header
    setHeader?: () => object;
    // 发送请求
    request: (res: IRequestOptions) => any;
    // 上传文件
    uploadFile: (res: IRequestFileOptions) => any;
    // 响应拦截
    responseIntercept?: (response: HttpResponse) => HttpResponse;
}

// 请求封装类
export class HttpServer {
    constructor(options: IHttpServerOptions) {
        const { apiPrefix, host, setHeader, request, uploadFile, responseIntercept } = options;
        this.setApiPrefix(apiPrefix);
        this.setHost(host);
        if (isFunc(setHeader)) {
            this.setHeader = setHeader;
        }
        if (responseIntercept) {
            this.responseIntercept = responseIntercept;
        }
        this.request = request;
        this.uploadFile = uploadFile;
    }

    // 请求的地址
    private apiPrefix: string = '/api';
    public setApiPrefix(apiPrefix) {
        if (typeof apiPrefix === 'string') {
            this.apiPrefix = apiPrefix;
        }
    }
    // 使用的主机
    private host: string = '';
    public setHost(host) {
        if (typeof host === 'string') {
            this.host = host;
        }
    }
    // 获取token方法
    private setHeader: IHttpServerOptions['setHeader'];
    // 发送请求
    private request: IHttpServerOptions['request'];
    private uploadFile: IHttpServerOptions['uploadFile'];
    // 响应拦截
    private responseIntercept: IHttpServerOptions['responseIntercept'] = response => response;

    // 获取请求的地址
    private getRequestUrl(url) {
        if (/^http[s]{0,1}:\/\/.*?$/.test(trim(url))) {
            return url;
        } else {
            const apiServer = `${trim(this.host, '/')}/${trim(this.apiPrefix, '/')}`;
            return `${trim(apiServer, '/')}/${trim(url, '/')}`;
        }
    }

    // 设置header
    setHeaderFunc(setHeader: IHttpServerOptions['setHeader']) {
        if (isFunc(setHeader)) {
            this.setHeader = setHeader;
        } else {
            console.error('设置Header信息函数错误', setHeader);
        }
    }

    // 统一请求
    ajax(url: string, data: object | null, method: EMethodType, header = {}, options?) {
        return new Promise((resolve: (res: HttpResponse) => void, reject) => {
            const that = this;
            // 请求的路径
            let requestUrl = that.getRequestUrl(url);
            // 请求的数据
            let requestBody = data || {};
            if (method === EMethodType.GET) {
                requestUrl = mergeUrl(requestUrl, requestBody);
                requestBody = {};
            }
            // 请求其他配置
            const requestOptions: any = {};
            if (options) {
                for (const k in options) {
                    requestOptions[k] = options[k];
                }
            }
            // 发起请求
            that.request({
                url: requestUrl,
                data: requestBody,
                header: getHeader(header, that.setHeader ? that.setHeader() : {}),
                ...requestOptions,
                method,
                ...that.toRequestResultFunc(resolve, reject, data)
            });
        });
    }

    // 结果统一处理
    toRequestResultFunc(resolve: (res: HttpResponse) => void, reject, sendData?) {
        const that = this;
        const resultFilter = function (res: HttpResponse) {
            const finalRes = that.responseIntercept(res);
            if (finalRes && finalRes.error === false) {
                resolve(finalRes);
            } else {
                reject(finalRes);
            }
        };
        return {
            success: function (response) {
                const { statusCode } = response;
                const res: any = response.data;
                if (statusCode == 200 && isObj(res)) {
                    if (Object.keys(res).length <= 0) {
                        // 文件流方式
                        resultFilter(successResponse('arrayBuffer生成成功', res));
                    } else {
                        resultFilter(unifiedResponse(res));
                    }
                } else {
                    resultFilter(
                        unifiedResponse({
                            code: statusCode,
                            errcode: 1,
                            msg: (isObj(res) ? res.msg : null) || '系统错误',
                            data: sendData
                        })
                    );
                }
            },
            error: function (err) {
                resultFilter(
                    unifiedResponse({
                        code: 600,
                        errcode: 1,
                        msg: (err && err.msg) || '系统错误',
                        data: err
                    })
                );
            },
            complete: function (res) {
                const { errMsg } = res;
                if (/^request:fail\s+timeout$/.test(errMsg)) {
                    const resp = errResponse('系统错误', res);
                    resp.msg = '网络异常';
                    resp.timeout = true;
                    resultFilter(resp);
                }
            }
        };
    }

    /**
     * 上传文件
     * @param url 上传的地址
     * @param filePath 文件路径
     * @param data 额外数据
     * @param header 请求头
     * @param options 请求参数
     */
    upload(url: string, filePath, data: object | null, header = {}, options?) {
        return new Promise((resolve: (res: HttpResponse) => void, reject) => {
            const that = this;
            const requestOptions = {
                timeout: 5 * 60 * 1000,
                ...(options || {})
            };
            const { name = 'file' } = requestOptions;
            delete requestOptions[name];
            that.uploadFile({
                ...requestOptions,
                url: that.getRequestUrl(url),
                filePath: isObj(filePath) ? filePath.tempFilePath || filePath.path : filePath,
                name,
                formData: data || {},
                header: getHeader(header, that.setHeader ? that.setHeader() : {}),
                ...that.toRequestResultFunc(resolve, reject, data)
            });
        });
    }

    get(url, data = {}, options?, header = {}) {
        return this.ajax(url, data, EMethodType.GET, header, options);
    }

    // 提交put请求
    put(url, data = {}, options?, header = {}) {
        return this.ajax(
            url,
            data,
            EMethodType.PUT,
            {
                'Content-Type': 'application/json',
                ...(header || {})
            },
            options
        );
    }

    // 提交delete请求
    del(url, data = {}, options?, header = {}) {
        const params = {};
        const requestData = isObj(data) ? data : {};
        for (const key in requestData) {
            const it = requestData[key];
            if (isArr(it)) {
                params[key] = it.join(',');
            } else if (isNum(it) || isStr(it)) {
                params[key] = it;
            }
        }
        return this.ajax(
            mergeUrl(url, params),
            data,
            EMethodType.DELETE,
            {
                'Content-Type': 'application/json',
                ...(header || {})
            },
            options
        );
    }

    post(url, data = {}, options?, header = {}) {
        return this.ajax(
            url,
            data,
            EMethodType.POST,
            {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...(header || {})
            },
            options
        );
    }

    postJson(url, data = {}, options?, header = {}) {
        return this.ajax(
            url,
            data,
            EMethodType.POST,
            {
                'Content-Type': 'application/json',
                ...(header || {})
            },
            options
        );
    }

    file(url, data = {}, options?, header = {}) {
        let formData = new FormData();
        for (var key in data || {}) {
            formData.append(key, data[key]);
        }
        return this.ajax(
            url,
            formData,
            EMethodType.POST,
            {
                'Content-Type': 'multipart/form-data',
                ...(header || {})
            },
            options
        );
    }
}
