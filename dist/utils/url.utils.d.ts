declare const requestStr2Obj: (requestUrl: any, valAutoDecode?: boolean) => {};
declare const urlEncode: (str: any) => string | ((encodeStr: any) => any);
declare const urlDecode: (str: any) => any;
declare const obj2RequestUrl: (obj: any) => string;
/**
 * URL合并
 * @param mainUrl 主url（可以包含域名部分）
 * @param param  参数
 */
declare const mergeUrl: (mainUrl: any, ...param: object[]) => string;

export { mergeUrl, obj2RequestUrl, requestStr2Obj, urlDecode, urlEncode };
