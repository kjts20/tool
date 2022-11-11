import { btoa } from './lib/base64';

/**
 * arrayBuffer 转图片base64
 * @param buffer
 * @returns
 */
export const arrayBufferToBase64Img = function (buffer) {
    const str = String.fromCharCode(...new Uint8Array(buffer));
    return `data:image/jpeg;base64,${btoa(str)}`;
};
