/**
 * Base64 编码
 * @param str
 * @returns
 */
export const base64Encode = function (str: string) {
    if (typeof btoa === 'function') {
        return btoa(str);
    } else if (typeof Buffer === 'function') {
        return Buffer.from(str).toString('base64');
    } else {
        throw new Error('Base64 encoding not supported.');
    }
};

/**
 * Base64 解码
 * @param encodedStr
 * @returns
 */
export const base64Decode = function (encodedStr) {
    if (typeof atob === 'function') {
        return atob(encodedStr);
    } else if (typeof Buffer === 'function') {
        return Buffer.from(encodedStr, 'base64').toString('utf-8');
    } else {
        throw new Error('Base64 decoding not supported.');
    }
};

/**
 * base64转hex
 * @param base64String
 * @returns
 */
export const base64ToHex = function (base64String) {
    const bin = base64Decode(base64String.replace(/[ \r\n]+$/, ''));
    for (var i = 0, hex: any = []; i < bin.length; ++i) {
        var tmp = bin.charCodeAt(i).toString(16);
        if (tmp.length === 1) tmp = '0' + tmp;
        hex[hex.length] = tmp;
    }
    return hex.join(' ');
};

/**
 * hex 转 base64
 * @param hexString 16进制字符串
 */
export const hex2Base64 = function (hexString) {
    const str = String.fromCharCode.apply(
        null,
        hexString
            .replace(/\r|\n/g, '')
            .replace(/([\da-fA-F]{2}) ?/g, '0x$1 ')
            .replace(/ +$/, '')
            .split(' ')
    );
    return base64Encode(str);
};

/**
 * 16进制转ArrayBuffer
 * @param hex 16进制字符串
 */
export const hex2ArrayBuffer = function (hex) {
    const hexArr = hex.match(/[\da-f]{2}/gi);
    if (hexArr) {
        return new Uint8Array(hexArr.map(h => parseInt(h, 16))).buffer;
    } else {
        return new ArrayBuffer(0);
    }
};

/**
 * Hex（16进制）转int
 * @param str
 */
export const hex2Int = function (hexString: string) {
    return parseInt(hexString, 16);
};

/**
 *  Hex（16进制）转float
 * @param hex 16进制字符串
 * @param radixPoint 保留小数点
 * @returns
 */
export const hex2Float = function (hexString: string, radixPoint = 5): number {
    // 将十六进制转换为32位有符号整数
    const intValue = parseInt(hexString, 16);
    // 使用DataView将整数转换为浮点数
    const buffer = new ArrayBuffer(4);
    const intArray = new Uint32Array(buffer);
    intArray[0] = intValue;
    const floatArray = new Float32Array(buffer);
    const floatValue = floatArray[0];
    return parseFloat(floatValue.toFixed(radixPoint));
};

/**
 * Hex（16进制）转ASCII
 * @param str
 */
export const hex2Ascii = function (hexString: string) {
    const ab = hex2ArrayBuffer(hexString);
    return arrayBuffer2Ascii(ab);
};

/**
 * 数字转16进制
 * @param num
 */
export const int2Hex = function (num: number, bitNum = 1) {
    return num
        .toString(16)
        .padStart(bitNum * 2, '0')
        .toUpperCase();
};

/**
 * Hex（16进制）转float
 * @param floatNum
 * @returns
 */
export const float2Hex = function (floatNum: number) {
    var floatView = new DataView(new ArrayBuffer(4));
    floatView.setFloat32(0, floatNum, false);
    var hex = floatView.getUint32(0).toString(16);
    // 将十六进制字符串填充为8位
    hex = hex.padStart(8, '0');
    var highBits = hex.substring(0, 4);
    var lowBits = hex.substring(4);
    return (highBits + lowBits).toUpperCase();
};

/**
 * ASCII转Hex（16进制）
 * @param str
 * @param bitNum 字节数（字节长度，不够长度进行补位）
 */
export const ascii2Hex = function (str, bitNum = 0) {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        let hexCode = code.toString(16);
        hex += hexCode.padStart(2, '0');
    }
    const allLen = bitNum * 2;
    if (bitNum > 0 && allLen > hex.length) {
        return '0'.repeat(allLen - hex.length) + hex;
    } else {
        return hex;
    }
};

/**
 * arrayBuffer 转换16进制
 * @param arrayBuffer
 */
export const arrayBuffer2Hex = function (arrayBuffer: ArrayBuffer) {
    const byteArray = new Uint8Array(arrayBuffer);
    let hex = '';
    for (let i = 0; i < byteArray.length; i++) {
        const hexCode = byteArray[i].toString(16).padStart(2, '0');
        hex += hexCode;
    }
    return hex;
};

/**
 * arrayBuffer 转换 ascii
 * @param arrayBuffer
 */
export const arrayBuffer2Ascii = function (arrayBuffer: ArrayBuffer) {
    return new TextDecoder('utf-8').decode(arrayBuffer);
};

/**
 * ascii 转换 arrayBuffer
 * @param str
 * @returns
 */
export const ascii2ArrayBuffer = function (str: string) {
    return new TextEncoder().encode(str);
};

/**
 * 电总协议中数据的CHKSUM计算
 * @param data 数据
 */
export const dataChksum = function (dataFrame) {
    let sum = 0;
    for (let i = 0; i < dataFrame.length; i++) {
        if (dataFrame[i] !== 0x02 && dataFrame[i] !== 0x03 && dataFrame[i] !== 0x1c) {
            sum += dataFrame[i];
        }
    }
    const highByte = Math.floor(sum / 256);
    const lowByte = sum % 256;
    const chkSum = ~(highByte + lowByte) & 0xffff;
    return chkSum;
};

/**
 * [电总协议] 获取数据长度
 * 在JavaScript中，我们使用`&`表示按位与操作，`>>`表示右移操作。另外，JavaScript中的字符串索引从0开始，因此在计算`length`时不需要使用切片操作。最后，JavaScript中的十六进制表示方法是使用`toString(16)`函数将数字转换为十六进制字符串。
 * @param info
 */
export const getDataLTH = function (info: string, len = 4) {
    if (info === '') {
        return '0000';
    } else {
        var b = info.length;
        var data = b;
        var buf_1 = data & 0x000f;
        var buf_2 = (data >> 4) & 0x000f;
        var buf_3 = (data >> 8) & 0x000f;
        var str_buf = buf_1 + buf_2 + buf_3;
        var buf_0 = (~(str_buf % 0x10) + 1) & 0x0f;
        var length = (buf_0 * 0x1000 + buf_3 * 0x100 + buf_2 * 0x10 + buf_1).toString(16);
        return length.toUpperCase().padStart(len, '0');
    }
};

/**
 * [电总协议]获取数据的帧校验
 * @param data
 */
export const getDataChkSum = function (data) {
    let uint8ArrayData = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
        uint8ArrayData[i] = data.charCodeAt(i);
    }
    let sum = 0;
    for (let i = 0; i < uint8ArrayData.length; i++) {
        sum += uint8ArrayData[i];
    }
    let bb = ((~sum % 65535) + 1) & 0xffff;
    return bb.toString(16).toUpperCase();
};
