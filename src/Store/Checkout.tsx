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

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material';

import GooglePayButton from '@google-pay/button-react';

import { buildPaymentRequest, getUpdatedPaymentData } from './GooglePay';
import { CartContext } from './CartContext';

import './Checkout.css';

/**Properties for the Checkout component */
interface Props {}

/**Checkout React component */
const Checkout: React.FC<Props> = () => {
  const navigate = useNavigate();

  // Get the cart from the current context
  const { cart, setCart } = useContext(CartContext);

  // Current Google Pay payment request details (if in state)
  const [paymentRequest, setPaymentRequest] = useState(buildPaymentRequest([]));

  // If the cart changes, update the payment request object
  useEffect(() => {
    Object.assign(
      paymentRequest,
      buildPaymentRequest(
        cart.map(itemDetail => {
          return {
            label: itemDetail.item.title,
            price: (itemDetail.quantity * itemDetail.item.price).toFixed(2),
            type: 'LINE_ITEM'
          };
        })
      )
    );
    setPaymentRequest(paymentRequest);
  }, [cart, paymentRequest]);

  /**Handles Google Pay checkout
   *
   * @param {google.payments.api.PaymentData} paymentData Google Pay payment data
   */
  function handleLoadPaymentData(paymentData: google.payments.api.PaymentData) {
    // Simply log to the console for this sample app
    // Normally this would be sent to a backend server for processing
    console.log('Payment data', paymentData);

    // Empty cart
    setCart([]);

    // Route the user to the success page
    navigate('/confirm');
  }

  /**Handles manual checkout (empty the cart and route to confirmation) */
  function handleCheckout() {
    setCart([]);
    navigate('/confirm');
  }

  // Return the React component
  return (
    <div className="Checkout">
      <Grid container spacing={5} className="checkout-grid">
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" gutterBottom>
            Automatic checkout
          </Typography>
          <div className="google-pay-checkout">
            <Typography variant="h6" gutterBottom>
              Skip the forms and check out with Google Pay!
            </Typography>
            <Grid container spacing={1}>
              <div className="buttons">
                <GooglePayButton
                  environment="TEST"
                  buttonSizeMode="fill"
                  paymentRequest={paymentRequest}
                  onLoadPaymentData={handleLoadPaymentData}
                  onError={error => console.error(error)}
                  onPaymentDataChanged={paymentData => getUpdatedPaymentData(paymentRequest, paymentData)}
                />
              </div>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" gutterBottom>
            Guest checkout
          </Typography>
          <div className="shipping">
            <Typography variant="h6" gutterBottom>
              Shipping address
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="firstName"
                  name="firstName"
                  label="First name"
                  fullWidth
                  autoComplete="given-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="lastName"
                  name="lastName"
                  label="Last name"
                  fullWidth
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="address1"
                  name="address1"
                  label="Address line 1"
                  fullWidth
                  autoComplete="shipping address-line1"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="address2"
                  name="address2"
                  label="Address line 2"
                  fullWidth
                  autoComplete="shipping address-line2"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="city"
                  name="city"
                  label="City"
                  fullWidth
                  autoComplete="shipping address-level2"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField id="state" name="state" label="State/Province/Region" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="zip"
                  name="zip"
                  label="Zip / Postal code"
                  fullWidth
                  autoComplete="shipping postal-code"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="country"
                  name="country"
                  label="Country"
                  fullWidth
                  autoComplete="shipping country"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
                  label="Use this address for payment details"
                />
              </Grid>
            </Grid>
          </div>
          <div className="payment">
            <Typography variant="h6" gutterBottom>
              Payment method
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <TextField required id="cardName" label="Name on card" fullWidth autoComplete="cc-name" />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField required id="cardNumber" label="Card number" fullWidth autoComplete="cc-number" />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField required id="expDate" label="Expiry date" fullWidth autoComplete="cc-exp" />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  required
                  id="cvv"
                  label="CVV"
                  helperText="Last three digits on signature strip"
                  fullWidth
                  autoComplete="cc-csc"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox color="secondary" name="saveCard" value="yes" />}
                  label="Remember credit card details for next time"
                />
              </Grid>
            </Grid>
          </div>
          <div className="buttons">
            <Button variant="outlined" onClick={handleCheckout}>
              Submit
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Checkout;
