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

import './List.css';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { ItemDetails } from '../interfaces/ItemDetails';
import React from 'react';

interface Props {
  item: ItemDetails;
}

const ListItem: React.FC<Props> = props => {
  const params = useParams<{ listId: string }>();

  return (
    <Link to={`/list/${params.listId}/${props.item.name}`} className="list-item-link">
      <Card className="list-item-card" elevation={3}>
        <CardMedia image={props.item.image} title={props.item.title} className="list-item-image" />
        <CardContent className="list-item-content">
          <Typography component="div" className="title">
            {props.item.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div">
            ${props.item.price.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ListItem;
