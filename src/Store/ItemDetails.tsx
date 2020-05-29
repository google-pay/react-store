import React, { useState, useEffect, useContext } from 'react';
import { ItemDetails as Item, StoreData } from '../data/store-data';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Typography, InputLabel, Select, MenuItem, Grid, Snackbar } from '@material-ui/core';
import { CartContext } from './CartContext';
import qs from 'querystring';
import './ItemDetails.css';

function unescapeHtml(text: string) {
  const elem = document.createElement('textarea');
  elem.innerHTML = text;
  return elem.textContent || '';
}

export default function ItemDetails() {
  const storeData = new StoreData();
  const query = qs.parse(window.location.search.replace(/^\?/, ''));
  const params = useParams<any>();
  const [item, setItem] = useState<Item>();
  const [size, setSize] = useState((query.size as string) || 'M');
  const [quantity, setQuantity] = useState(1);
  const [snackOpen, setSnackOpen] = useState(false);
  const history = useHistory();

  const { setCart } = useContext(CartContext);

  useEffect(() => {
    storeData.getItem(params.listId, params.itemId).then(data => setItem(data));
  }, [params, storeData]);

  function addToCart() {
    if (item) {
      storeData.addItemToCart(item, size, quantity);
      setCart(storeData.getCart());
      setSnackOpen(true);
    }
  }

  function handleSnackClose() {
    setSnackOpen(false);
  }

  return (
    <div className="ItemDetails">
      {
        item &&
        <>
          <Grid container className="container">
            <Grid item xs={12} sm={5}>
              <img className="item-details-image" src={item.largeImage} alt={item.title} />
            </Grid>
            <Grid item xs={12} sm={6} className="content">
              <Typography variant="h5">{item.title}</Typography>
              <Typography variant="body1" color="textSecondary">${item.price.toFixed(2)}</Typography>
              <div className="pickers">
                <div className="field-set">
                  <InputLabel className="label" id="sizeLabel">Size</InputLabel>
                  <Select className="input" labelId="sizeLabel" value={size} onChange={event => setSize(event.target.value as string)}>
                    <MenuItem value="XS">XS</MenuItem>
                    <MenuItem value="S">S</MenuItem>
                    <MenuItem value="M">M</MenuItem>
                    <MenuItem value="L">L</MenuItem>
                    <MenuItem value="XL">XL</MenuItem>
                  </Select>
                </div>
                <div className="field-set">
                  <InputLabel className="label" id="quantityLabel">Quantity</InputLabel>
                  <Select className="input" labelId="quantityLabel" value={quantity} onChange={event => setQuantity(Number(event.target.value))}>
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
                <Button variant="outlined" onClick={addToCart}>Add to Cart</Button>
              </div>
            </Grid>
          </Grid>
          <Snackbar
            ContentProps={{
              className: 'snackbar-info',
            }}
            open={snackOpen}
            autoHideDuration={5000}
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            onClose={handleSnackClose}
            message={`${item.title} added to cart.`}
            action={
              <>
                <Button onClick={handleSnackClose}>Dismiss</Button>
                <Button onClick={() => history.push('/cart')}>View cart</Button>
                <Button onClick={() => history.push('/checkout')}>Checkout</Button>
              </>
            }
          />
        </>
      }
    </div>
  );
}
