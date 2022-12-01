import { getArray, isStr } from '../src';

describe('生成数组方法', () => {
    test('生成不指定类型数组', () => {
        const len = 5;
        expect(getArray(len).length).toBe(len);
    });
    test('生成字符串数组', () => {
        const len = 5;
        const arr = getArray(len, it => String(it));
        expect(isStr(typeof arr[len - 1])).toBe(true);
    });
});