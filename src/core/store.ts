// 生成保存的key
const toKey = function (key) {
    return key + '';
};

// 简易仓库
export class Store {
    private store: Map<string, any>;
    constructor() {
        this.store = new Map();
    }

    // 设置单个数据
    set(key, value) {
        this.store.set(toKey(key), value);
    }

    // 初始化数据
    sets(dataDict: object) {
        for (const key in dataDict) {
            this.set(key, dataDict[key]);
        }
    }

    // 获取单个值
    get(key) {
        return this.store.get(toKey(key));
    }

    // 获取仓库中所有数据
    gets() {
        const dict = {};
        this.store.forEach((value, key) => {
            dict[key] = value;
        });
        return dict;
    }
    // 删除键值
    delete(key) {
        return this.store.delete(toKey(key));
    }
    // 清空
    clear() {
        return this.store.clear();
    }
    // 是否包含key
    has(key) {
        return this.store.has(toKey(key));
    }
}
