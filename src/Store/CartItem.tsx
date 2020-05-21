import React, { useContext } from 'react';
import { CartItemDetails } from '../data/store-data';
import { Card, CardContent, Typography, IconButton, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import './List.css';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';

interface Props {
  cartItem: CartItemDetails;
}

const CartItem: React.FC<Props> = (props) => {
  const { cart, setCart } = useContext(CartContext);

  function handleQuantityChange(quantity: number) {
    const index = cart.findIndex(cartItem => cartItem.size === props.cartItem.size
      && cartItem.item.name === props.cartItem.item.name);

    if (index !== -1) {
      const newCart = [...cart];
      newCart.splice(index, 1, {
        ...cart[index],
        quantity,
      });
      setCart(newCart);
    }
  }

  function handleRemoveClick() {
    const index = cart.findIndex(cartItem => cartItem.size === props.cartItem.size
      && cartItem.item.name === props.cartItem.item.name);

    if (index !== -1) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  }

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
          <InputLabel className="label" id="quantityLabel">Qty</InputLabel>
          <Select className="input" labelId="quantityLabel" value={props.cartItem.quantity} onChange={event => handleQuantityChange(Number(event.target.value))}>
            {new Array<number>(100).fill(0).map((val, index) => (<MenuItem key={index} value={index + 1}>{index + 1}</MenuItem>))}
          </Select>
          <InputLabel className="label">Size</InputLabel>
          <InputLabel className="label">{props.cartItem.size}</InputLabel>
          <InputLabel className="label amount">${(props.cartItem.quantity * props.cartItem.item.price).toFixed(2)}</InputLabel>
        </div>
      </CardContent>
    </Card>
  );
}

export default CartItem;
