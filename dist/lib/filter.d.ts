import { HttpResponse } from './http-server.js';

declare type TErrFunc = (errMsg: string | number, data: any) => void;
interface IHttpServerFilter {
    error: TErrFunc;
}
declare class ResponseFilter {
    constructor(options: IHttpServerFilter);
    error: IHttpServerFilter['error'];
    filter(responsePromise: Promise<HttpResponse>, filterHanlder?: (data: any) => any): Promise<any>;
    unifyRemind(responsePromise: Promise<HttpResponse>, filterHanlder?: ((data: any) => any) | null, showTip?: boolean): Promise<any>;
}

export { IHttpServerFilter, ResponseFilter, TErrFunc };
