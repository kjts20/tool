/*
 * @Description: 工具类：文件工具
 * @Author: wkj
 * @Date: 2019-11-04 11:20:15
 * @LastEditTime: 2022-12-03 19:18:55
 * @LastEditors: wkj wkj@kjwoo.cn
 */
import { btoa } from './lib/base64';
import pako from 'pako';

/**
 * arrayBuffer 转图片base64
 * @param buffer
 * @returns
 */
export const arrayBufferToBase64Img = function (buffer) {
    const str = String.fromCharCode(...new Uint8Array(buffer));
    return `data:image/jpeg;base64,${btoa(str)}`;
};

/**
 * 转char数据
 * @param array
 * @returns
 */
const forCharData = function (array) {
    var res = '';
    var chunk = 8 * 1024;
    var i;
    for (i = 0; i < array.length / chunk; i++) {
        res += String.fromCharCode.apply(null, array.slice(i * chunk, (i + 1) * chunk));
    }
    res += String.fromCharCode.apply(null, array.slice(i * chunk));
    return res.replace(/%/g, '%25');
};

/**
 * gzip 解码
 * @param gzipStr
 * @returns
 */
export const unGzip = function (gzipStr) {
    try {
        var strData = atob(gzipStr);
    } catch (error) {
        console.error('解压错误： ', gzipStr);
        throw new Error('需要解压的字符型合法！！！');
    }
    var charData = strData.split('').map(function (x) {
        return x.charCodeAt(0);
    });
    var binData = new Uint8Array(charData);
    var data = pako.inflate(binData);
    // strData = String.fromCharCode.apply(null, new Uint16Array(data));
    strData = forCharData(new Uint16Array(data)); //解决栈溢出问题

    var dateUrlDecode = decodeURIComponent(decodeURIComponent(strData));
    try {
        return JSON.parse(dateUrlDecode);
    } catch (e) {
        return dateUrlDecode;
    }
};

/**
 * gzip 编码
 * @param data
 * @returns
 */
export const gzip = function (data) {
    var binaryString = pako.gzip(encodeURIComponent(JSON.stringify(data)), { to: 'string' });
    return btoa(binaryString);
};

/**
 * base64 编码
 * @param data
 * @returns
 */
export const base64 = function (data) {
    var b = new Buffer(JSON.stringify(data));
    return b.toString('base64');
};

/**
 * base64解码
 * @param base64
 * @returns
 */
export const unBase64 = function (base64) {
    try {
        var b = new Buffer(base64, 'base64');
    } catch (error) {
        throw new Error('不是base64字符串！！！');
    }
    var decodeData = b.toString();
    try {
        return JSON.parse(decodeData);
    } catch (e) {
        return decodeData;
    }
};

/**
 * base64转文件对象
 * @param base64Data
 * @returns
 */
export const base64ToBlob = function (base64Data) {
    var byteString;
    if (base64Data.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(base64Data.split(',')[1]);
    } else {
        byteString = unescape(base64Data.split(',')[1]);
    }
    var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
};

/**
 * 文件下载
 * @param content 字节码文件内容
 * @param fileName 下载名字
 * @return 下载文件的名字
 */
export const download = function (content: Blob, fileName: string) {
    let blob = new Blob([content]);
    //@ts-ignore
    const ieDownloader = window.navigator.msSaveBlob;
    if (typeof ieDownloader !== 'undefined') {
        ieDownloader(blob, fileName);
    } else {
        const downloadLink = document.createElement('a');
        downloadLink.download = fileName;
        downloadLink.style.display = 'none';
        downloadLink.href = URL.createObjectURL(blob);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
    }
    return fileName;
};

/**
 * 获取文件base64编码
 * @param blob 读取文件base64的字节码文件
 */
export const getBase64 = function <File extends Blob>(file: File) {
    return new Promise((resolve: (res: string) => void, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};
