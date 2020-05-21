import React from 'react';
import { CartItemDetails } from '../data/store-data';

let cart: CartItemDetails[] = [];

const CartContext = React.createContext({
  cart,
  setCart(cart: CartItemDetails[]) {
    this.cart = cart;
  },
});

export {
  CartContext,
};
