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

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, IconButton, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

import { CartContext } from './CartContext';
import { CartItemDetails } from '../interfaces/CartItemDetails';

import './List.css';

/**Properties for the CartItem component */
interface Props {
  cartItem: CartItemDetails;
}

/**CartItem React component
 *
 * @param {Props} props The details of the item in the cart
 */
const CartItem: React.FC<Props> = (props: Props) => {
  // Get the cart from the current context
  const { cart, setCart } = useContext(CartContext);

  /**Handle changes to the quantity of an item in the cart
   *
   * @param {number} quantity The new quantity of the item
   */
  function handleQuantityChange(quantity: number) {
    // Find the index of the item in the cart
    const index = cart.findIndex(
      cartItem => cartItem.size === props.cartItem.size && cartItem.item.name === props.cartItem.item.name
    );

    // Index exists
    if (index !== -1) {
      // Copy the cart
      const newCart = [...cart];

      // Replace the item at the index with the new item (changing quantity)
      newCart.splice(index, 1, {
        ...cart[index],
        quantity
      });

      // Replace the cart with the updated one
      setCart(newCart);
    }
  }

  /**Handle removing an item from the cart */
  function handleRemoveClick() {
    // Find the index of the item in the cart
    const index = cart.findIndex(
      cartItem => cartItem.size === props.cartItem.size && cartItem.item.name === props.cartItem.item.name
    );

    // Index exists
    if (index !== -1) {
      // Copy the cart
      const newCart = [...cart];

      // Remove the item at the index
      newCart.splice(index, 1);

      // Replace the cart with the updated one
      setCart(newCart);
    }
  }

  // Return the CartItem React component
  return (
    <Card className="cart-item-card" elevation={2}>
      <Link to={`/list/${props.cartItem.item.category}/${props.cartItem.item.name}?size=${props.cartItem.size}`}>
        <img src={props.cartItem.item.image} alt={props.cartItem.item.title} className="cart-item-image" />
      </Link>
      <CardContent className="cart-item-content">
        <div className="first-row">
          <Typography component="div" className="title">
            <Link to={`/list/${props.cartItem.item.category}/${props.cartItem.item.name}?size=${props.cartItem.size}`}>
              {props.cartItem.item.title}
            </Link>
          </Typography>
          <IconButton className="remove" color="inherit" aria-label="remove item" onClick={handleRemoveClick}>
            <Close fontSize="small" />
          </IconButton>
        </div>
        <div className="second-row">
          <InputLabel className="label" id="quantityLabel">
            Qty
          </InputLabel>
          <Select
            className="input"
            labelId="quantityLabel"
            value={props.cartItem.quantity}
            onChange={event => handleQuantityChange(Number(event.target.value))}
          >
            {new Array<number>(100).fill(0).map((val, index) => (
              <MenuItem key={index} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
          <InputLabel className="label">Size</InputLabel>
          <InputLabel className="label">{props.cartItem.size}</InputLabel>
          <InputLabel className="label amount">
            ${(props.cartItem.quantity * props.cartItem.item.price).toFixed(2)}
          </InputLabel>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
