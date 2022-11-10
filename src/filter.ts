// 转为bool
export var toBool = function (data) {
    switch (typeof data) {
        case "boolean":
            return data;
        case "string": {
            if (data === "" || data === "0") {
                return false;
            } else {
                return true;
            }
        }
        case "number":
        case "object":
        default:
            return data ? true : false;
    }
};