import AsyncStorage from '@react-native-async-storage/async-storage';

export function loadStateByKey<T>(key: string) {
  try {
    console.log(`loading state ${key}`);
    return AsyncStorage.getItem(key).then(str => {
      console.log(`state loaded: ${key}=>${str?.substr(0, 100)}`);
      if (str !== null) return JSON.parse(str) as T;
      return null;
    });
  } catch (e) {
    console.log(e);
    return Promise.resolve(null);
  }
}

export function saveStateByKey(key: string, state: any) {
  try {
    const value = JSON.stringify(state);
    console.log(`state saving: ${key}=>${value.substr(0, 100)}`);
    if (value === undefined) {
      AsyncStorage.removeItem(key);
    } else {
      AsyncStorage.setItem(key, value);
    }
  } catch (e) {
    console.log(e);
  }
}