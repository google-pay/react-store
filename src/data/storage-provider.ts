/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
