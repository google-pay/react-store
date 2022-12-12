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

import './Category.css';
import { Card, CardContent, CardMedia, Typography } from '@material-ui/core';
import { CategoryDetails } from '../data/store-data';
import { Link } from 'react-router-dom';
import React from 'react';

const Category: React.FC<CategoryDetails> = props => {
  return (
    <Link to={`/list/${props.name}`} className="category-link">
      <Card className="category-card" elevation={5}>
        <CardMedia image={props.image} title={props.title} className="category-image" />
        <CardContent className="category-content">
          <Typography component="div">{props.title}</Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Category;
