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

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Badge, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { Menu as MenuIcon, ShoppingCart } from '@mui/icons-material';

import { CartContext } from './CartContext';
import { CategoryDetails } from '../interfaces/CategoryDetails';
import { StoreData } from './StoreData';

import './Header.css';

/**Header React component */
export default function Header() {
  const navigate = useNavigate();

  // Manages store items, categories, etc.
  const storeData = useMemo(() => new StoreData(), []);

  // Current shopping cart from context
  const { cart } = useContext(CartContext);

  // Get the anchor element from the current state
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  // Get the categories from the current state
  const [categories, setCategories] = useState([] as CategoryDetails[]);

  // If store data changes, update the categories
  useEffect(() => {
    storeData.getCategories().then(data => setCategories(data));
  }, [storeData]);

  // Handle clicks to the Shop menu
  const handleMenuClick = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle clicks to a Shop menu item
  const handleMenuItemClick = (category: CategoryDetails) => {
    navigate(`/list/${category.name}`);
    setAnchorEl(null);
  };

  // Handle closing the Shop menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle clicks to the shopping cart
  const handleCartClick = (event: React.MouseEvent) => {
    navigate('/cart');
  };

  // Return the Header React component
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
