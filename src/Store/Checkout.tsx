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

import React, { useContext } from 'react';
import { Typography, Grid, TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { CartContext } from './CartContext';
import './Checkout.css';

interface Props {
}

const Checkout: React.FC<Props> = () => {
  const history = useHistory();
  const { setCart } = useContext(CartContext);

  function handleCheckout() {
    setCart([]);
    history.push('/confirm');
  }

  return (
    <div className="Checkout">
      <Grid container spacing={5} className="checkout-grid">
        <Grid item xs={12} sm={7}>
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
        </Grid>
        <Grid item xs={12} sm={5}>
          <div className="payment">
            <Typography variant="h6" gutterBottom>
              Payment method
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <TextField
                  required
                  id="cardName"
                  label="Name on card"
                  fullWidth
                  autoComplete="cc-name"
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  required
                  id="cardNumber"
                  label="Card number"
                  fullWidth
                  autoComplete="cc-number"
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  required
                  id="expDate"
                  label="Expiry date"
                  fullWidth
                  autoComplete="cc-exp"
                />
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
        </Grid>
      </Grid>
      <div className="buttons">
        <Button variant="outlined" onClick={handleCheckout}>Submit</Button>
      </div>
    </div>
  );
}

export default Checkout;
