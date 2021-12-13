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

import './Cart.css';
import { Button, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { buildPaymentRequest, getUpdatedPaymentData } from '../google-pay-configuration';
import { CartContext } from './CartContext';
import CartItem from './CartItem';
import GooglePayButton from '@google-pay/button-react';
import { StoreData } from '../data/store-data';
import { useHistory } from 'react-router-dom';

interface Props {}

const Cart: React.FC<Props> = props => {
  const { cart, setCart } = useContext(CartContext);
  const [paymentRequest, setPaymentRequest] = useState(buildPaymentRequest([]));
  const cartSize = StoreData.getCartSize(cart);
  const history = useHistory();

  useEffect(() => {
    Object.assign(
      paymentRequest,
      buildPaymentRequest(
        cart.map(cartItem => ({
          label: `${cartItem.item.title} (${cartItem.size}) x ${cartItem.quantity}`,
          price: (cartItem.item.price * cartItem.quantity).toFixed(2),
          type: 'LINE_ITEM',
        })),
      ),
    );
    setPaymentRequest(paymentRequest);
  }, [cart, paymentRequest]);

  function handleLoadPaymentData(paymentData: google.payments.api.PaymentData) {
    console.log('Payment data', paymentData);
    setCart([]);
    history.push('/confirm');
  }

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
        <GooglePayButton
          environment="TEST"
          buttonSizeMode="fill"
          paymentRequest={paymentRequest}
          onLoadPaymentData={handleLoadPaymentData}
          onError={error => console.error(error)}
          onPaymentDataChanged={paymentData => getUpdatedPaymentData(paymentRequest, paymentData)}
        />
        <Button variant="outlined" onClick={() => history.push('/checkout')}>
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default Cart;
