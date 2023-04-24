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

import { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Grid, InputLabel, MenuItem, Select, Snackbar, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import qs from 'querystring';

import GooglePayButton from '@google-pay/button-react';

import { buildPaymentRequest, getUpdatedPaymentData } from './GooglePay';
import { CartContext } from './CartContext';
import { ItemDetails } from '../interfaces/ItemDetails';
import { StoreData } from './StoreData';

import './ItemDetails.css';

/**Unescape HTML content */
function unescapeHtml(text: string) {
  const elem = document.createElement('textarea');
  elem.innerHTML = text;
  return elem.textContent || '';
}

/**ItemDetails React component */
export default function ItemDetails() {
  const navigate = useNavigate();

  // Manages store items, categories, etc.
  const storeData = useMemo(() => new StoreData(), []);

  // Parse querystring params
  const query = qs.parse(window.location.search.replace(/^\?/, ''));

  // Dynamic URL parameters
  const params = useParams<any>();

  // Current item details (if in state)
  const [item, setItem] = useState<ItemDetails>();

  // Current size details (if in state)
  const [size, setSize] = useState((query.size as string) || 'M');

  // Current quantity details (if in state)
  const [quantity, setQuantity] = useState(1);

  // Current Google Pay payment request details (if in state)
  const [paymentRequest, setPaymentRequest] = useState(buildPaymentRequest([]));

  // "Snack" menu on bottom of screen
  const [snackOpen, setSnackOpen] = useState(false);

  const { setCart } = useContext(CartContext);

  // If the params or store data change, update the currently selected item
  useEffect(() => {
    storeData.getItem(params.listId ?? '', params.itemId ?? '').then(data => setItem(data));
  }, [params, storeData]);

  // If the item, size, quantity, or payment request change, update the payment
  //   request object
  useEffect(() => {
    Object.assign(
      paymentRequest,
      buildPaymentRequest(
        item
          ? [
              {
                label: `${item.title} (${size}) x ${quantity}`,
                price: (item.price * quantity).toFixed(2),
                type: 'LINE_ITEM'
              }
            ]
          : []
      )
    );
    setPaymentRequest(paymentRequest);
  }, [item, size, quantity, paymentRequest]);

  /**Adds an item to the cart */
  function addToCart() {
    // Check if an item is currently selected
    if (item) {
      // Add the item to the cart
      storeData.addItemToCart(item, size, quantity);

      // Update the current cart
      setCart(storeData.getCart());

      // Open the snack menu
      setSnackOpen(true);
    }
  }

  /**Closes the snack menu */
  function handleSnackClose() {
    setSnackOpen(false);
  }

  /**Loads payment data and routes to the confirmation page
   *
   * @param {google.payments.api.PaymentData} paymentData Google Pay payment data
   */
  function handleLoadPaymentData(paymentData: google.payments.api.PaymentData) {
    // Simply log to the console for this sample app
    // Normally this would be sent to a backend server for processing
    console.log('Payment data', paymentData);

    // Route the user to the success page
    navigate('/confirm');
  }

  // Return the ItemDetails React component
  return (
    <div className="ItemDetails">
      {item && (
        <>
          <Grid container className="container">
            <Grid item xs={12} sm={5}>
              <div className="image-container">
                <img className="item-details-image" src={item.largeImage} alt={item.title} />
              </div>
            </Grid>
            <Grid item xs={12} sm={6} className="content">
              <Typography variant="h5">{item.title}</Typography>
              <Typography variant="body1" color="textSecondary">
                ${item.price.toFixed(2)}
              </Typography>
              <div className="pickers">
                <div className="field-set">
                  <InputLabel className="label" id="sizeLabel">
                    Size
                  </InputLabel>
                  <Select
                    className="input"
                    labelId="sizeLabel"
                    value={size}
                    onChange={event => setSize(event.target.value as string)}
                  >
                    <MenuItem value="XS">XS</MenuItem>
                    <MenuItem value="S">S</MenuItem>
                    <MenuItem value="M">M</MenuItem>
                    <MenuItem value="L">L</MenuItem>
                    <MenuItem value="XL">XL</MenuItem>
                  </Select>
                </div>
                <div className="field-set">
                  <InputLabel className="label" id="quantityLabel">
                    Quantity
                  </InputLabel>
                  <Select
                    className="input"
                    labelId="quantityLabel"
                    value={quantity}
                    onChange={event => setQuantity(Number(event.target.value))}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="4">4</MenuItem>
                    <MenuItem value="5">5</MenuItem>
                  </Select>
                </div>
              </div>
              <div className="description">
                <Typography variant="h6">Description</Typography>
                <Typography variant="body2" component="div" color="textSecondary">
                  <div dangerouslySetInnerHTML={{ __html: unescapeHtml(item.description) }} />
                </Typography>
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
                <Button variant="outlined" onClick={addToCart}>
                  Add to Cart
                </Button>
              </div>
            </Grid>
          </Grid>
          <Snackbar
            ContentProps={{
              className: 'snackbar-info'
            }}
            open={snackOpen}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            onClose={handleSnackClose}
            message={`${item.title} added to cart.`}
            action={
              <>
                <Button onClick={handleSnackClose}>Dismiss</Button>
                <Button onClick={() => navigate('/cart')}>View cart</Button>
                <Button onClick={() => navigate('/checkout')}>Checkout</Button>
              </>
            }
          />
        </>
      )}
    </div>
  );
}
