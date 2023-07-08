/**
 * 浏览器兼容性
 */
export const browserPolyfill = function () {
    (function (global) {
        /**
         * 兼容atob、btoa方法
         */
        var tableStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var table = tableStr.split('');
        if (typeof global.atob !== 'function') {
            global.atob = function (base64) {
                if (/(=[^=]+|={3,})$/.test(base64)) throw new Error('String contains an invalid character');
                base64 = base64.replace(/=/g, '');
                var n = base64.length & 3;
                if (n === 1) throw new Error('String contains an invalid character');
                for (var i = 0, j = 0, len = base64.length / 4, bin: any = []; i < len; ++i) {
                    var a = tableStr.indexOf(base64[j++] || 'A'),
                        b = tableStr.indexOf(base64[j++] || 'A');
                    var c = tableStr.indexOf(base64[j++] || 'A'),
                        d = tableStr.indexOf(base64[j++] || 'A');
                    if ((a | b | c | d) < 0) throw new Error('String contains an invalid character');
                    bin[bin.length] = ((a << 2) | (b >> 4)) & 255;
                    bin[bin.length] = ((b << 4) | (c >> 2)) & 255;
                    bin[bin.length] = ((c << 6) | d) & 255;
                }
                return String.fromCharCode.apply(null, bin).substr(0, bin.length + n - 4);
            };
        }
        if (typeof global.btoa !== 'function') {
            global.btoa = function (bin) {
                for (var i = 0, j = 0, len = bin.length / 3, base64: any = []; i < len; ++i) {
                    var a = bin.charCodeAt(j++),
                        b = bin.charCodeAt(j++),
                        c = bin.charCodeAt(j++);
                    if ((a | b | c) > 255) throw new Error('String contains an invalid character');
                    base64[base64.length] =
                        table[a >> 2] +
                        table[((a << 4) & 63) | (b >> 4)] +
                        (isNaN(b) ? '=' : table[((b << 2) & 63) | (c >> 6)]) +
                        (isNaN(b + c) ? '=' : table[c & 63]);
                }
                return base64.join('');
            };
        }

        /**
         * 兼容TextEncoder
         */
        if (typeof global.TextEncoder !== 'function') {
            function _TextEncoder() {}
            _TextEncoder.prototype.encode = function (s) {
                var data = unescape(encodeURIComponent(s))
                    .split('')
                    .map(val => val.charCodeAt(0));
                return typeof Uint8Array == 'function' ? new Uint8Array(data) : data;
            };
            // @ts-ignore
            global.TextEncoder = _TextEncoder;
        }

        /**
         * 兼容TextDecoder
         */
        if (typeof global.TextDecoder !== 'function') {
            function _TextDecoder() {}
            _TextDecoder.prototype.decode = function (code_arr) {
                // @ts-ignore
                return decodeURIComponent(escape(String.fromCharCode.apply(null, new Uint8Array(code_arr))));
            };
            // @ts-ignore
            global.TextDecoder = _TextDecoder;
        }
    })(this || window || globalThis);
};
