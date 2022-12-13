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

import { Button, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import './Cart.css';
import CartItem from './CartItem';
import { CartContext } from './CartContext';
import { StoreData } from './StoreData';

interface Props {}

/** Represents a user's shopping cart */
const Cart: React.FC<Props> = props => {
  const navigate = useNavigate();

  // Get the cart from the context
  const { cart } = useContext(CartContext);

  // Get the cart size
  const cartSize = StoreData.getCartSize(cart);

  // Return the cart
  return (
    <div className="Cart">
      <Typography variant="h5">Your Cart</Typography>
      <Typography variant="body2" color="textSecondary">
        ({cartSize} {cartSize === 1 ? 'item' : 'items'})
      </Typography>

      <div className="cart-items">
        {cart.map((item, index) => (
          <CartItem key={index} cartItem={item} />
        ))}
      </div>

      <div className="total">
        <span className="label">Total:</span>
        <span className="amount">
          ${cart.reduce((total, cartItem) => total + cartItem.quantity * cartItem.item.price, 0).toFixed(2)}
        </span>
      </div>

      <div className="buttons">
        <Button variant="outlined" onClick={() => navigate('/checkout')}>
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default Cart;
