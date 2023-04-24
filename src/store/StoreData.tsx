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

import { CartItemDetails } from '../interfaces/CartItemDetails';
import { categories } from '../config/CategoryDetails';
import { CategoryDetails } from '../interfaces/CategoryDetails';
import { ItemDetails } from '../interfaces/ItemDetails';
import { StorageProvider } from './StorageProvider';

/**The store, available items, etc. */
export class StoreData {
  // Caches the items in the currently-selected category
  private itemCache = new Map<string, Promise<ItemDetails[]>>();

  // Handles local storage
  private storageProvider = StorageProvider.create();

  /**Get the list of available categories
   *
   * @returns {Promise<CategoryDetails[]>} The available categories
   */
  public getCategories(): Promise<CategoryDetails[]> {
    return Promise.resolve(categories);
  }

  /**Get the items for a specific category
   *
   * @param {string} name The category name
   * @returns {Promise<ItemDetails[]>} The items in the category
   */
  public getItemsByCategory(name: string): Promise<ItemDetails[]> {
    // Check if the items in the category are currently in local storage
    let promise = this.itemCache.get(name);

    // Found in cache, return this instead
    if (promise) return promise;

    // Fetch the items in the category from the JSON file
    promise = fetch(`/data/${name}.json`).then(response => response.json());

    // Cache the output
    this.itemCache.set(name, promise);

    // Return the items
    return promise;
  }

  /**Get a specific item from a category of items
   *
   * @param {string} category The category to search
   * @param {string} name The item name to search for
   * @return {Promise<ItemDetails | undefined>} The item, if found
   */
  public async getItem(category: string, name: string): Promise<ItemDetails | undefined> {
    // Get the items for this category
    const items = await this.getItemsByCategory(category);

    // Check if the item is in this list
    return items.find(item => item.name === name);
  }

  /**Add a selected item to the user's cart
   *
   * @param {ItemDetails} item The item to add
   * @param {string} size The size of the item to add
   * @param {number} quantity The number of this item to add
   */
  public addItemToCart(item: ItemDetails, size: string, quantity: number) {
    // Get the cart, if it exists in local storage
    let cart = this.storageProvider.get<CartItemDetails[]>('cart') || [];

    // Check if the item already exists in the cart
    let existing = cart.find(c => c.item.name === item.name && c.size === size);

    if (!existing) {
      // Item doesn't exist
      existing = {
        item,
        size,
        quantity
      };

      // Add it to the cart
      cart = [...cart, existing];
    } else {
      // Item already exists
      // Update the selected quantity
      existing.quantity += quantity;
    }

    // Overwrite the cart with the updated version
    this.setCart(cart);
  }

  /**Get the current cart, if it exists
   *
   * @returns {CartItemDetails[]} The current cart, or an empty array
   */
  public getCart(): CartItemDetails[] {
    return this.storageProvider.get<CartItemDetails[]>('cart') || [];
  }

  /**Update the user's cart with a new one
   *
   * @param {CartItemDetails[]} cart The new cart to use
   */
  public setCart(cart: CartItemDetails[]) {
    this.storageProvider.set('cart', cart);
  }

  /**Get the number of items in the cart
   *
   * @returns {number} The number of items in the cart
   */
  public getCartSize(): number {
    // Get the cart size from local storage
    return StoreData.getCartSize(this.getCart());
  }

  /**Get the number of items in the provided cart
   *
   * @param {CartItemDetails[]} cart The cart to inventory
   * @returns {number} The number of items in the cart
   * @staticmethod
   */
  public static getCartSize(cart: CartItemDetails[]): number {
    // Need to count the quantity of each item
    return cart.reduce((total, current) => total + current.quantity, 0);
  }
}
