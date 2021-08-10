import { StringMap, NumberMap } from "./baseTypes";

export interface DeferredPromise<Type> {
  promise: Promise<Type> | null;
  resolve: ((value: Type) => void) | null;
  reject: ((reason: any) => void) | null;
}

const decodingMap: { [s: string]: string } = {
  "&quot;": '"',
  "&apos;": "'",
  "&trade;": "™",
  "&rsquo;": " `",
  "&reg;": "®",
  "&copy;": "©",
  "&#[0-9]+;": "",
};
const decodingRe = new RegExp(`(${Object.keys(decodingMap).join("|")})`, "g");

export default class TsUtils {
  static isProd() {
    return process.env.NODE_ENV === 'production';
  }

  static decodeHtmlEntity(str: string): string {
    return str.replace(decodingRe, (m, p1, p2, p3, offset, string) => {
      if (m.startsWith("&#")) {
        return String.fromCharCode(parseInt(m.substring(2, m.length - 1), 10));
      }
      return decodingMap[m];
    });
  }

  static defer<Type>(): DeferredPromise<Type> {
    const deferred: DeferredPromise<Type> = {
      promise: null,
      resolve: null,
      reject: null,
    };
    deferred.promise = new Promise<Type>((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });
    return deferred;
  }

  static cloneObject(object: any) {
    return JSON.parse(JSON.stringify(object));
  }

  static timeout(ms: number) {
    return new Promise((resolve, reject) => {
      let id = setTimeout(() => {
        clearTimeout(id);
        reject("timeout");
      }, ms);
    });
  }

  static promiseTimeout(ms: number, promise: Promise<any>) {
    return Promise.race([promise, this.timeout(ms)]);
  }

  static centsToDollars(cents: number) {
    return (cents / 100).toFixed(2);
  }

  static centsToDollarsWithSign(cents: number) {
    if (cents >= 0) return `$${this.centsToDollars(cents)}`;
    return `-$${this.centsToDollars(-cents)}`;
  }

  static dollarsToCents(dollars: number) {
    return Math.round(dollars * 100)
  }

  static formatDollars(dollars: number) {
    return this.centsToDollars(this.dollarsToCents(dollars));
  }

  static stringToInt(str: string | undefined): number | undefined {
    if (str === undefined) return undefined;
    const ret = parseInt(str, 10);
    return isNaN(ret) ? undefined : ret;
  }
  // "1,2,3" => [1,2,3]
  static stringToIntList(str: string) {
    if (str === "") return [];
    return str.split(/[,，]/).map((s) => parseInt(s, 10));
  }

  static appendToMappedArray<T>(mappedArray: StringMap<T[]> | NumberMap<T[]>, key: string | number, value: T) {
    const values = mappedArray[key] || [];
    values.push(value);
    mappedArray[key] = values;
  }

  static addToMappedSet(mappedSet: StringMap<StringMap<boolean>>,
    key: string, value: string) {
    const values = mappedSet[key] || {};
    values[value] = true;
    mappedSet[key] = values;
  }

  static parseInt(v: string, min: number, max: number) {
    const ret = parseInt(v, 10);
    if (ret >= min && ret <= max) return ret;
    return min;
  }

  static getMapValue(obj: any, key: string): any {
    if (!obj) return undefined;
    return obj[key];
  }

  static gsUrl(type: string, path: string) {
    return `https://storage.googleapis.com/${process.env.REACT_APP_GS_BUCKET}/${type !== '' ? `${type}/` : ''}${path}`;
  }
}