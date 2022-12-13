/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Acts as local storage
const map = new Map<string, any>();

/**Mock storage provider */
export abstract class StorageProvider {
  /**Get a value
   *
   * @param {string} key The item's key in the map
   * @returns {T} The value of the item
   */
  public abstract get<T>(key: string): T;

  /**Set a value
   *
   * @param {string} key The item's key in the map
   * @param {T} value The item's value
   */
  public abstract set<T>(key: string, value: T): void;

  /**Create a new storage provider instance */
  public static create(): StorageProvider {
    // Check if a local storage provider has been created
    // If so, return it
    // If not, create a new one
    if (localStorage) {
      return new LocalStorageProvider();
    }
    return map;
  }
}

/**Mock local storage provider */
export class LocalStorageProvider extends StorageProvider {
  /**Get a value
   *
   * @param {string} key The item's key in the map
   * @returns {T} The value of the item
   */
  public get<T>(key: string): T {
    return JSON.parse(localStorage.getItem(key) || 'null');
  }

  /**Set a value
   *
   * @param {string} key The item's key in the map
   * @param {T} value The item's value
   */
  public set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
