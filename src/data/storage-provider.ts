const map = new Map<string, any>();

export abstract class StorageProvider {
  abstract get<T>(key: string): T;
  abstract set<T>(key: string, value: T): void;

  static create(): StorageProvider {
    if (localStorage) {
      return new LocalStorageProvider();
    }
    return map;
  }
}

export class LocalStorageProvider extends StorageProvider {
  get<T>(key: string): T {
    return JSON.parse(localStorage.getItem(key) || 'null');
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
