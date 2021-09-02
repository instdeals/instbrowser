import { Callback, NumberMap, RetCallback, StringMap } from "./baseTypes";

export type MoveArrayItemType = 'BEGIN' | 'END' | 'PREV' | 'NEXT';

interface GenKey<Type> {
  (value: Type): string | number;
}

export default class ArrayUtils {
  static distinct<Type>(
    arr: Array<Type>,
    keyCallback: (el: Type) => number | string
  ) {
    const existingKeys = {};
    return arr.filter(el => {
      const k = keyCallback(el);
      if (existingKeys[k] === true) return false;
      existingKeys[k] = true;
      return true;
    })
  }
  static deleteIf<Type>(
    arr: Array<Type>,
    callback: RetCallback<Type, boolean>): boolean {
    const item = this.removeIf(arr, callback);
    return !!item;
  }

  static removeIf<Type>(
    arr: Array<Type>,
    callback: RetCallback<Type, boolean>): Type | undefined {
    const index = arr.findIndex(callback);
    if (index === -1) return undefined;
    const item = arr.splice(index, 1)[0];
    return item;
  }

  static swap<Type>(arr: Array<Type>, index1: number, index2: number) {
    const ret = [...arr];
    ret[index1] = arr[index2];
    ret[index2] = arr[index1];
    return ret;
  }

  static moveItem<Type>(arr: Array<Type>, type: MoveArrayItemType,
    callback: RetCallback<Type, boolean>) {
    const index = arr.findIndex(callback);
    if (index === -1) return arr;

    if (type === 'BEGIN' || type === 'END') {
      const item = arr.splice(index, 1)[0];
      return type === 'BEGIN'
        ? [item, ...arr]
        : [...arr, item];
    }

    if (type === 'NEXT' && index !== arr.length - 1) {
      return this.swap(arr, index, index + 1);
    }
    if (type === 'PREV' && index !== arr.length - 1) {
      return this.swap(arr, index, index - 1);
    }
    return arr;
  }

  static removeIfReturnArray<Type>(
    arr: Array<Type>,
    callback: (el: Type) => boolean
  ): Array<Type> {
    const index = arr.findIndex(callback);
    if (index === -1) return arr;
    const ret = [...arr];
    ret.splice(index, 1);
    return ret;
  }
  static removeAt<Type>(
    arr: Array<Type>, index: number,
  ): Array<Type> {
    const ret = [...arr];
    ret.splice(index, 1)
    return ret;
  }

  // Apparently, it doesn't consider number of same elements.
  static hasSameElements<T>(a1: T[], a2: T[]) {
    if (a1.length !== a2.length) return false;
    for (let i = 0; i < a1.length; ++i) {
      if (!a2.includes(a1[i])) return false;
    }
    return true;
  }
  static replaceIf<Type>(
    arr: Array<Type>,
    item: Type,
    callback: (el: Type) => boolean): Array<Type> | undefined {
    const index = arr.findIndex(callback);
    if (index === -1) return undefined;
    const ret = [...arr];
    ret[index] = item;
    return ret;
  }

  static buildMap<Type>(arr: Array<Type>, genKey: GenKey<Type>)
    : NumberMap<Type> | StringMap<Type> {
    const ret: any = {};
    arr.forEach(item => ret[genKey(item)] = item);
    return ret;
  }

  static buildMapV2<Type, ValueType>(arr: Array<Type>,
    genKey: GenKey<Type>,
    genValue: ((el: Type) => ValueType)): NumberMap<ValueType> | StringMap<ValueType> {
    const ret: any = {};
    arr.forEach(item => ret[genKey(item)] = genValue(item));
    return ret;
  }

  static buildMapFromKeyToArray<Type>(arr: Array<Type>, genKey: GenKey<Type>)
    : NumberMap<Type[]> | StringMap<Type[]> {
    const ret: any = {};
    arr.forEach(item => {
      const key = genKey(item);
      const existing = ret[key] || [];
      ret[key] = [...existing, item];
    });
    return ret;
  }

  // Assume keyOrder contains the same keys generated from arr.
  static sortByOrder<Type>(
    arr: Array<Type>,
    genKey: GenKey<Type>,
    keyOrder: Array<string | number>): Array<Type> {
    const map = this.buildMap(arr, genKey);
    return keyOrder.map(key => map[key]);
  }
}