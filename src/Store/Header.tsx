import React, { useContext, useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge, Menu, MenuItem } from '@material-ui/core';
import { StoreData, CategoryDetails } from '../data/store-data';
import { ShoppingCart, Menu as MenuIcon } from '@material-ui/icons';
import { CartContext } from './CartContext';
import { useHistory, Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const storeData = new StoreData();
  const { cart } = useContext(CartContext);
  const [ anchorEl, setAnchorEl ] = useState<Element | null>(null);
  const [categories, setCategories] = useState([] as CategoryDetails[]);

  const history = useHistory();
  
  useEffect(() => {
    storeData.getCategories().then(data => setCategories(data));
  }, [storeData]);

  const handleMenuClick = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (category: CategoryDetails) => {
    history.push(`/list/${category.name}`);
    setAnchorEl(null);
  };

  const handleCartClick = (event: React.MouseEvent) => {
    history.push('/cart');
  };

  return (
    <AppBar position="sticky" className="Header">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick}>
          <MenuIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuItemClick}
        >
          {categories.map(cat => (
            <MenuItem key={cat.name} onClick={event => handleMenuItemClick(cat)}>{cat.title}</MenuItem>
          ))}
        </Menu>
        <Typography variant="h6" className="heading">
          <Link to="/">Shop</Link>
        </Typography>
        <IconButton edge="end"  color="inherit" aria-label="shopping cart" onClick={handleCartClick}>
          <Badge badgeContent={StoreData.getCartSize(cart)} color="secondary">
            <ShoppingCart />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}