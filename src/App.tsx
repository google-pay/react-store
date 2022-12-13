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

import { useEffect, useMemo, useState } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

import Cart from './store/Cart';
import Checkout from './store/Checkout';
import Confirmation from './store/Confirmation';
import Header from './store/Header';
import Home from './store/Home';
import ItemDetails from './store/ItemDetails';
import List from './store/List';

import { CartContext } from './store/CartContext';
import { StoreData } from './store/StoreData';
import { CategoryDetails } from './interfaces/CategoryDetails';
import { CartItemDetails } from './interfaces/CartItemDetails';

import './App.css';

/**Builds the base React app */
function App() {
  // Products, cart, and other shopping info
  const storeData = useMemo(() => new StoreData(), []);

  // T-shirt categories
  const [categories, setCategories] = useState([] as CategoryDetails[]);

  // Current user's shopping cart
  const [cart, setCart] = useState(storeData.getCart());

  // Updates the user's shopping cart
  function updateCart(cart: CartItemDetails[]) {
    storeData.setCart(cart);
    setCart(cart);
  }

  // Create list of categories and details
  useEffect(() => {
    storeData.getCategories().then(data => setCategories(data));
  }, [storeData]);

  // Create the router
  return (
    <CartContext.Provider value={{ cart, setCart: updateCart }}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home categories={categories} />} />
          <Route path="/list/:listId/:itemId" element={<ItemDetails />} />
          <Route path="/list/:listId" element={<List categories={categories} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirm" element={<Confirmation />} />
        </Routes>
      </BrowserRouter>
    </CartContext.Provider>
  );
}

export default App;
