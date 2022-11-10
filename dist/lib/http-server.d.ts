declare enum EMethodType {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT"
}
interface IResponse<DataType = any> {
    msg: string;
    errcode: 0 | 1;
    code: number;
    data: DataType;
}
interface IStatus {
    success: boolean;
    fail: boolean;
    error: boolean;
    timeout: boolean;
}
declare type HttpResponse<DataType = any> = IResponse<DataType> & IStatus;
interface IPageDataType<Item = any> {
    pageSize: number;
    current: number;
    total: number;
    pageNum: number;
    data: Array<Item>;
}
declare const unifiedResponse: (response?: IResponse) => HttpResponse<any>;
declare const successResponse: (msg: string, data?: any) => HttpResponse<any>;
declare const errResponse: (msg: string, data?: any) => HttpResponse<any>;
declare type TErrFunc = (errMsg: string | number, data: any) => void;
interface IRequestOptions {
    url: string;
    data: object;
    header?: object;
    timeout?: number;
    method: EMethodType;
    sucess: (data: object) => void;
    error: (err: any) => void;
    complete: (err: any) => void;
}
interface IRequestFileOptions {
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
interface IHttpServerOptons {
    host: string;
    apiPrefix: string;
    getHeader?: () => object;
    error: TErrFunc;
    request: (res: IRequestOptions) => any;
    uploadFile: (res: IRequestFileOptions) => any;
    responseIntercept?: (response: HttpResponse) => HttpResponse;
}
declare class HttpServer {
    constructor(options: IHttpServerOptons);
    apiServer: string;
    host: string;
    error: IHttpServerOptons["error"];
    getHeader: IHttpServerOptons["getHeader"];
    request: IHttpServerOptons["request"];
    uploadFile: IHttpServerOptons["uploadFile"];
    responseIntercept: IHttpServerOptons["responseIntercept"];
    private getRequestUrl;
    private ajax;
    /**
     * 上传文件
     * @param url 上传的地址
     * @param filePath 文件路径
     * @param data 额外数据
     * @param header 请求头
     * @param options 请求参数
     */
    upload(url: string, filePath: any, data: object | null, header?: {}, options?: any): Promise<HttpResponse<any>>;
    get(url: any, data?: {}, options?: any, header?: {}): Promise<HttpResponse<any>>;
    put(url: any, data?: {}, options?: any, header?: {}): Promise<HttpResponse<any>>;
    del(url: any, data?: {}, options?: any, header?: {}): Promise<HttpResponse<any>>;
    post(url: any, data?: {}, options?: any, header?: {}): Promise<HttpResponse<any>>;
    postJson(url: any, data?: {}, options?: any, header?: {}): Promise<HttpResponse<any>>;
}

export { HttpResponse, IHttpServerOptons, IPageDataType, IRequestFileOptions, IRequestOptions, IResponse, IStatus, TErrFunc, HttpServer as default, errResponse, successResponse, unifiedResponse };
