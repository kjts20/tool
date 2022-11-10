import { isStr } from "./type.utils";

// 字符串转 ArrayBuffer
export const str2ArrayBuffer = function (str) {
    var array = new Uint8Array(isStr(str) ? str.length : 0);
    for (var i = 0; i < str.length; i++) {
        array[i] = str.charCodeAt(i);
    }
    return array.buffer;
};

// ArrayBuffer转16进度字符串示例
export const ab2hex = function (buffer) {
    const hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2)
        }
    )
    return hexArr.join('');
};
