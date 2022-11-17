// 生成保存的key
const toKey = function(key){
    return key + '';
};

// 简易仓库
export class Store{
    store; 
    constructor(){
        this.store = new Map();
    }
    
    // 设置单个数据
    set(key, value){
        this.store.set(toKey(key), JSON.stringify(value));
    }

    // 初始化数据
    sets(dataDict:object){
        for (const key in dataDict) {
            this.set(key, dataDict[key]);
        }
    }

    // 获取单个值
    get(key){
        const val = this.store.get(toKey(key));
        if(val !== undefined){
            return JSON.stringify(val);
        }else{
            return undefined;
        }
    }
    
    // 获取仓库中所有数据
    gets(){
        const dict = {};
        for (const key of this.store.keys) {
            dict[key] = this.get(key);
        }
        return dict;
    }
}