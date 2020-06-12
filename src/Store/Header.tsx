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

import './Header.css';
import { AppBar, Badge, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import { CategoryDetails, StoreData } from '../data/store-data';
import { Link, useHistory } from 'react-router-dom';
import { Menu as MenuIcon, ShoppingCart } from '@material-ui/icons';
import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from './CartContext';

export default function Header() {
  const storeData = new StoreData();
  const { cart } = useContext(CartContext);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
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

  const handleMenuClose = () => {
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
        <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {categories.map(cat => (
            <MenuItem key={cat.name} onClick={event => handleMenuItemClick(cat)}>
              {cat.title}
            </MenuItem>
          ))}
        </Menu>
        <Typography variant="h6" className="heading">
          <Link to="/">Shop</Link>
        </Typography>
        <IconButton edge="end" color="inherit" aria-label="shopping cart" onClick={handleCartClick}>
          <Badge badgeContent={StoreData.getCartSize(cart)} color="secondary">
            <ShoppingCart />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
