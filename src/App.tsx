import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './Store/Home';
import List from './Store/List';
import ItemDetails from './Store/ItemDetails';
import { StoreData, CategoryDetails, CartItemDetails } from './data/store-data';
import { CartContext } from './Store/CartContext';
import Header from './Store/Header';
import Cart from './Store/Cart';
import Checkout from './Store/Checkout';
import Confirmation from './Store/Confirmation';
import './App.css';

function App() {
  const storeData = new StoreData();
  const [categories, setCategories] = useState([] as CategoryDetails[]);
  const [cart, setCart] = useState(storeData.getCart());

  useEffect(() => {
    storeData.getCategories().then(data => setCategories(data));
  }, [storeData]);

  function updateCart(cart: CartItemDetails[]) {
    storeData.setCart(cart);
    setCart(cart);
  }

  return (
    <CartContext.Provider value={{ cart, setCart: updateCart }}>
      <Router>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path="/">
              <Home categories={categories} />
            </Route>
            <Route path="/list/:listId/:itemId">
              <ItemDetails />
            </Route>
            <Route path="/list/:listId">
              <List categories={categories} />
            </Route>
            <Route path="/cart">
              <Cart />
            </Route>
            <Route path="/checkout">
              <Checkout />
            </Route>
            <Route path="/confirm">
              <Confirmation />
            </Route>
          </Switch>
        </div>
      </Router>
    </CartContext.Provider>
  );
}

export default App;
