declare const toDateTime: (date: any, time?: any, format?: string) => string;
declare const date2str: (date: any, format?: string) => string;
declare const now: (format?: string) => string;
declare const getCurrentTimeStr: (format?: string) => string;
declare const getCurrentStamp: () => number;
declare const timestamp2str: (timestamp: any, format: any) => string;
declare const timestamp2dateStr: (timestamp: any) => string;
declare const timestamp2datetimeStr: (timestamp: any) => string;
declare const timeStr2dateStr: (timeStr: any) => string;
declare const dateStr2Timestamp: (timeStr: any) => number;
declare const timeStr2datetimeStr: (time2str: any) => string;
declare const personalize2DateStr: (timeStr: any, format?: string) => string;
declare const toCurrentSeconds: (timeStr: any) => number;
declare const getDayRange: (day?: number) => string[];

export { date2str, dateStr2Timestamp, getCurrentStamp, getCurrentTimeStr, getDayRange, now, personalize2DateStr, timeStr2dateStr, timeStr2datetimeStr, timestamp2dateStr, timestamp2datetimeStr, timestamp2str, toCurrentSeconds, toDateTime };
