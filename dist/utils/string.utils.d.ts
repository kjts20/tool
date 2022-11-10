declare const allSpace = "\u3000";
declare const trim: (str: any, patternStr?: string, replaceStr?: string) => any;
declare const md5: (str: any) => string;
declare const generateRandomStr: (len?: any) => string;
declare const generateUUID: () => string;
declare const generateUnique: (seed?: number | string, codingBits?: number) => string;
declare const camelToKebab: (camelStr: string) => string;
declare const isEmail: (str: any) => boolean;
declare const isPhone: (str: any) => boolean;
declare const isTel: (str: any) => boolean;

export { allSpace, camelToKebab, generateRandomStr, generateUUID, generateUnique, isEmail, isPhone, isTel, md5, trim };
