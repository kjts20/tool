import { biDict2List, dict2List, getArray, isStr } from '../src';

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

describe('字典装数组方法', () => {
    const dict = {
        name: 'wkj'
    };
    test('【一般】字典装数组', () => {
        expect(dict2List(dict)[0]).toBe(dict.name);
    });
    test('【加强】字典装数组', () => {
        const list = biDict2List(dict, (it, key) => {
            return {
                title: it,
                value: key
            };
        });
        expect(list.length).toBe(1);
        expect(list[0].title).toBe(dict.name);
    });
});
