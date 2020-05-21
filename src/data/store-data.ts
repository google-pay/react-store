import { StorageProvider } from "./storage-provider";

export interface CategoryDetails {
  name: string;
  title: string;
  image: string;
}

export interface ItemDetails {
  name: string;
  title: string;
  category: string;
  price: number;
  description: string;
  image: string;
  largeImage: string;
}

export interface CartItemDetails {
  item: ItemDetails;
  size: string;
  quantity: number;
}

const categories: CategoryDetails[] = [
  {
    name: 'mens_outerwear',
    title: 'Men\'s Outerwear',
    image: '/images/mens_outerwear.jpg',
  },
  {
    name: 'ladies_outerwear',
    title: 'Ladies Outerwear',
    image: '/images/ladies_outerwear.jpg',
  },
  {
    name: 'mens_tshirts',
    title: 'Men\'s T-Shirts',
    image: '/images/mens_tshirts.jpg',
  },
  {
    name: 'ladies_tshirts',
    title: 'Ladies T-Shirts',
    image: '/images/ladies_tshirts.jpg',
  }
];

const itemCache = new Map<string, Promise<ItemDetails[]>>();

export class StoreData {
  private storageProvider = StorageProvider.create();

  getCategories() {
    return Promise.resolve(categories);
  }

  getItemsByCategory(name: string) {
    let promise = itemCache.get(name);

    if (promise) return promise;

    promise = fetch(`/data/${name}.json`).then(response => response.json());
    itemCache.set(name, promise);

    return promise;
  }

  async getItem(category: string, name: string) {
    const items = await this.getItemsByCategory(category);
    return items.find(item => item.name === name);
  }

  addItemToCart(item: ItemDetails, size: string, quantity: number) {
    let cart = this.storageProvider.get<CartItemDetails[]>('cart') || [];
    let existing = cart.find(c => c.item.name === item.name && c.size === size);

    if (!existing) {
      existing = {
        item,
        size,
        quantity,
      };

      cart = [...cart, existing];
    } else {
      existing.quantity += quantity;
    }

    this.setCart(cart);
  }

  getCart() {
    return this.storageProvider.get<CartItemDetails[]>('cart') || [];
  }

  setCart(cart: CartItemDetails[]) {
    this.storageProvider.set('cart', cart);
  }

  getCartSize(): number {
    return StoreData.getCartSize(this.getCart());
  }

  static getCartSize(cart: CartItemDetails[]): number {
    return cart.reduce((total, current) => total + current.quantity, 0);
  }
}