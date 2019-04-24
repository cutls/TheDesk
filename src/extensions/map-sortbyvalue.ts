
interface Map<K, V> {
    sortByValue(f: (value1: V, value2: V) => number): Map<K, V>
}
Map.prototype.sortByValue = function (f: (value1: any, value2: any) => number): Map<any, any> {
    return new Map([...(this as Map<any, any>)].sort((keyValue1, keyValue2) => {
        return f(keyValue1[1], keyValue2[1]);
    }))
}