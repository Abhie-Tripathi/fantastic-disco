type StorageType = 'local' | 'session' | 'cookie';

interface StorageOptions {
  expires?: number; // in days
  ttl?: number; // in milliseconds
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

interface StorageItem<T> {
  value: T;
  expires?: number; // timestamp in milliseconds
}

const isLocalStorage = (type: StorageType): boolean => type === 'local';
const isSessionStorage = (type: StorageType): boolean => type === 'session';
const isCookieStorage = (type: StorageType): boolean => type === 'cookie';

const getStorage = (type: StorageType): Storage | null => {
  if (isLocalStorage(type)) return window.localStorage;
  if (isSessionStorage(type)) return window.sessionStorage;
  return null;
};

const serialize = <T>(value: T, ttl?: number): string => {
  const item: StorageItem<T> = {
    value,
    expires: ttl ? Date.now() + ttl : undefined
  };
  return JSON.stringify(item);
};

const deserialize = <T>(value: string): T | null => {
  try {
    const item: StorageItem<T> = JSON.parse(value);
    
    // Check if the item has expired
    if (item.expires && Date.now() > item.expires) {
      return null;
    }
    
    return item.value;
  } catch (error) {
    console.error('Error deserializing value:', error);
    return null;
  }
};

const encode = (value: string): string => encodeURIComponent(value);
const decode = (value: string): string => decodeURIComponent(value);

const createCookieString = (key: string, value: string, options?: StorageOptions): string => {
  const cookie = `${encode(key)}=${encode(value)}`;
  const optionsString = options ? createCookieOptions(options) : '';
  return `${cookie}${optionsString}`;
};

const createCookieOptions = (options: StorageOptions): string => {
  const parts: string[] = [];

  if (options.expires) {
    const date = new Date();
    date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
    parts.push(`expires=${date.toUTCString()}`);
  }

  if (options.path) parts.push(`path=${options.path}`);
  if (options.domain) parts.push(`domain=${options.domain}`);
  if (options.secure) parts.push('secure');
  if (options.sameSite) parts.push(`samesite=${options.sameSite}`);

  return parts.length ? `; ${parts.join('; ')}` : '';
};

const parseCookies = (): Record<string, string> => {
  return document.cookie
    .split(';')
    .map(cookie => cookie.trim().split('='))
    .reduce((acc, [key, value]) => ({
      ...acc,
      [decode(key)]: decode(value)
    }), {});
};

const setItem = <T>(type: StorageType, key: string, value: T, options?: StorageOptions): void => {
  try {
    const serializedValue = serialize(value, options?.ttl);
    
    if (isCookieStorage(type)) {
      document.cookie = createCookieString(key, serializedValue, options);
    } else {
      const storage = getStorage(type);
      if (storage) {
        storage.setItem(key, serializedValue);
      }
    }
  } catch (error) {
    console.error('Error setting storage item:', error);
  }
};

const getItem = <T>(type: StorageType, key: string): T | null => {
  try {
    let value: string | null;

    if (isCookieStorage(type)) {
      const cookies = parseCookies();
      value = cookies[key] || null;
    } else {
      const storage = getStorage(type);
      value = storage ? storage.getItem(key) : null;
    }

    if (!value) return null;
    
    const deserializedValue = deserialize<T>(value);
    if (deserializedValue === null) {
      // If the item has expired, remove it
      removeItem(type, key);
    }
    return deserializedValue;
  } catch (error) {
    console.error('Error getting storage item:', error);
    return null;
  }
};

const removeItem = (type: StorageType, key: string): void => {
  try {
    if (isCookieStorage(type)) {
      document.cookie = createCookieString(key, '', { expires: -1 });
    } else {
      const storage = getStorage(type);
      if (storage) {
        storage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Error removing storage item:', error);
  }
};

const clear = (type: StorageType): void => {
  try {
    if (isCookieStorage(type)) {
      const cookies = parseCookies();
      Object.keys(cookies).forEach(key => removeItem(type, key));
    } else {
      const storage = getStorage(type);
      if (storage) {
        storage.clear();
      }
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

const isAvailable = (type: StorageType): boolean => {
  try {
    if (isCookieStorage(type)) {
      return navigator.cookieEnabled;
    }
    const storage = getStorage(type);
    if (!storage) return false;
    
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

const getKeys = (type: StorageType): string[] => {
  try {
    if (isCookieStorage(type)) {
      return Object.keys(parseCookies());
    }
    const storage = getStorage(type);
    return storage ? Object.keys(storage) : [];
  } catch (error) {
    console.error('Error getting storage keys:', error);
    return [];
  }
};

const getSize = (type: StorageType): number => {
  try {
    if (isCookieStorage(type)) {
      return document.cookie.length;
    }
    const storage = getStorage(type);
    if (!storage) return 0;

    return Object.keys(storage).reduce((size, key) => {
      const value = storage.getItem(key);
      return size + key.length + (value?.length || 0);
    }, 0);
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return 0;
  }
};

const createStorage = (type: StorageType) => ({
  set: <T>(key: string, value: T, options?: StorageOptions) => setItem(type, key, value, options),
  get: <T>(key: string) => getItem<T>(type, key),
  remove: (key: string) => removeItem(type, key),
  clear: () => clear(type),
  isAvailable: () => isAvailable(type),
  keys: () => getKeys(type),
  size: () => getSize(type)
});

export const localStorage = createStorage('local');
export const sessionStorage = createStorage('session');
export const cookieStorage = createStorage('cookie');

export default createStorage; 