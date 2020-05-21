import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import { Typography, Button } from '@material-ui/core';
import { StoreData } from '../data/store-data';
import CartItem from './CartItem';
import './Cart.css';
import { useHistory } from 'react-router-dom';

interface Props {
}

const Cart: React.FC<Props> = (props) => {
  const { cart } = useContext(CartContext);
  const cartSize = StoreData.getCartSize(cart);
  const history = useHistory();

  return (
    <div className="Cart">
      <Typography variant="h5">Your Cart</Typography>
      <Typography variant="body2" color="textSecondary">({cartSize} {cartSize === 1 ? 'item' : 'items'})</Typography>
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
        <Button variant="outlined" onClick={() => history.push('/checkout')}>Checkout</Button>
      </div>
    </div>
  );
}

export default Cart;
