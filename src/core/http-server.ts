import { isArr, isFunc, isNum, isObj, isStr, isUndefined } from "../type";
import { mergeUrl } from "../url";
import { trim } from "../string";

// 获取请求头部
const getHeader = function (...headers) {
    let useHeader = {};
    for (const header of headers) {
        useHeader = { ...(isObj(header) ? header : {}) };
    }
    return useHeader;
};

//请求方式
enum EMethodType {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
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
            msg: "系统错误",
        };
    }
    const { code, errcode, msg } = response;
    const httpResponse: HttpResponse = {
        ...response,
        success: true,
        fail: false,
        error: false,
        timeout: false,
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
        if (isNum(code)) {
            httpResponse.code = 500;
        }
    } else {
        httpResponse.success = false;
        httpResponse.fail = false;
        httpResponse.error = true;
        httpResponse.msg = "接口错误";
    }
    if (!isStr(msg)) {
        httpResponse.msg = httpResponse.error ? "系统错误" : httpResponse.success ? "success" : "失败";
    }
    return httpResponse;
};

// 成功响应
export const successResponse = function (msg: string, data: any = null) {
    return unifiedResponse({
        code: 200,
        errcode: 0,
        msg,
        data,
    });
};

// 错误响应
export const errResponse = function (msg: string, data: any = null) {
    return unifiedResponse({
        errcode: 1,
        code: 500,
        msg,
        data,
    });
};

// 错误函数
export type TErrFunc = (errMsg: string | number, data: any) => void;

// 请求函数
export interface IRequestOptions {
    url: string;
    data: object;
    header?: object;
    timeout?: number;
    method: EMethodType;
    sucess: (data: object) => void;
    error: (err: any) => void;
    complete: (err: any) => void;
}

// 请求函数
export interface IRequestFileOptions {
    url: string;
    formData: object;
    name: string;
    filePath: File;
    header?: object;
    timeout?: number;
    method: EMethodType;
    sucess: (data: object) => void;
    error: (err: any) => void;
    complete: (err: any) => void;
}

// 请求构造器的参数
export interface IHttpServerOptons {
    // 使用的主机
    host: string;
    // api前缀
    apiPrefix: string;
    // 头部信息 header
    getHeader?: () => object;
    // 错误函数
    error: TErrFunc;
    // 发送请求
    request: (res: IRequestOptions) => any;
    // 上传文件
    uploadFile: (res: IRequestFileOptions) => any;
    // 响应拦截
    responseIntercept?: (response: HttpResponse) => HttpResponse;
}

// 请求封装类
export default class HttpServer {
    constructor(options: IHttpServerOptons) {
        const { apiPrefix, host, getHeader, error, request, uploadFile, responseIntercept } = options;
        this.apiServer = `${trim(host, "/")}/${trim(apiPrefix, "/")}`;
        this.host = host;
        if (isFunc(getHeader)) {
            this.getHeader = getHeader;
        }
        if (isFunc(error)) {
            this.error = error;
        }
        this.request = request;
        this.uploadFile = uploadFile;
        if (responseIntercept) {
            this.responseIntercept = responseIntercept;
        }
    }

    // 请求的地址
    apiServer: string = "";
    // 使用的主机
    host: string = "";
    // 错误函数
    error: IHttpServerOptons["error"] = console.error;
    // 获取token方法
    getHeader: IHttpServerOptons["getHeader"];
    // 发送请求
    request: IHttpServerOptons["request"];
    uploadFile: IHttpServerOptons["uploadFile"];
    // 响应拦截
    responseIntercept: IHttpServerOptons["responseIntercept"] = response => response

    // 获取请求的地址
    private getRequestUrl(url) {
        if (/^http[s]:\/\/.*?$/g.test(url)) {
            return url;
        } else {
            return `${trim(this.apiServer, "/")}/${trim(url, "/")}`;
        }
    }

    // 统一请求
    private ajax(url: string, data: object | null, method: EMethodType, header = {}, options?) {
        return new Promise((resolve: (res: HttpResponse) => void, reject) => {
            // 请求的路径
            let requestUrl = this.getRequestUrl(url);
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
            this.request({
                url: requestUrl,
                data: requestBody,
                header: getHeader(header, this.getHeader()),
                ...requestOptions,
                method,
                success: function (response) {
                    const { statusCode } = response;
                    const res: any = response.data;
                    if (statusCode == 200 && isObj(res)) {
                        if (Object.keys(res).length <= 0) {
                            // 文件流方式
                            resolve(successResponse("arrayBuffer生成成功", res));
                        } else {
                            // 响应拦截 + 返回
                            resolve(this.responseIntercept(unifiedResponse(res)));
                        }
                    } else {
                        const msg = (isObj(res) ? res.msg : null) || "系统错误";
                        reject(
                            unifiedResponse({
                                code: statusCode,
                                errcode: 1,
                                msg,
                                data: data,
                            })
                        );
                    }
                },
                error: function (err) {
                    reject(
                        unifiedResponse({
                            code: 600,
                            errcode: 1,
                            msg: (err && err.msg) || "系统错误",
                            data: err,
                        })
                    );
                },
                complete: function (res) {
                    const { errMsg } = res;
                    if (/^request:fail\s+timeout$/.test(errMsg)) {
                        const resp = errResponse("系统错误", res);
                        resp.msg = "网络异常";
                        resp.timeout = true;
                        reject(resp);
                    }
                },
            });
        });
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
            const requestOptions = {
                timeout: 5 * 60 * 1000,
                ...(options || {}),
            };
            const { name = "file" } = requestOptions;
            delete requestOptions[name];
            this.uploadFile({
                ...requestOptions,
                url: this.getRequestUrl(url),
                filePath: isObj(filePath) ? filePath.tempFilePath || filePath.path : filePath,
                name,
                formData: data || {},
                header: getHeader(header),
                success: function (response) {
                    const { statusCode } = response;
                    const resData = response.data;
                    const res: any = isObj(resData) ? resData : JSON.parse(resData);
                    if (statusCode === 200 && isObj(res)) {
                        // 响应拦截 + 返回
                        resolve(this.responseIntercept(unifiedResponse(res)));
                    } else {
                        const msg = (isObj(res) ? res.msg : null) || "系统错误";
                        reject(
                            unifiedResponse({
                                code: statusCode,
                                errcode: 1,
                                msg,
                                data: data,
                            })
                        );
                    }
                },
                fail: function (err) {
                    reject(
                        unifiedResponse({
                            code: 600,
                            errcode: 1,
                            msg: (err && err.errMsg) || "系统错误",
                            data: err,
                        })
                    );
                },
                complete: function (res) {
                    const { errMsg } = res;
                    if (/^request:fail\s+timeout$/.test(errMsg)) {
                        const resp = errResponse("系统错误", res);
                        resp.msg = "网络异常";
                        resp.timeout = true;
                        reject(resp);
                    }
                },
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
                "Content-Type": "application/json",
                ...(header || {}),
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
                params[key] = it.join(",");
            } else if (isNum(it) || isStr(it)) {
                params[key] = it;
            }
        }
        return this.ajax(
            mergeUrl(url, params),
            data,
            EMethodType.DELETE,
            {
                "Content-Type": "application/json",
                ...(header || {}),
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
                "Content-Type": "application/x-www-form-urlencoded",
                ...(header || {}),
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
                "Content-Type": "application/json",
                ...(header || {}),
            },
            options
        );
    }
}
