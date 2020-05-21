import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ItemDetails } from '../data/store-data';
import { Card, CardMedia, CardContent, Typography } from '@material-ui/core';
import './List.css';

interface Props {
  item: ItemDetails;
}

const ListItem: React.FC<Props> = (props) => {
  const params = useParams<{listId: string}>();
  
  return (
    <Link to={`/list/${params.listId}/${props.item.name}`} className="list-item-link">
      <Card className="list-item-card" elevation={3}>
        <CardMedia image={props.item.image} title={props.item.title} className="list-item-image" />
        <CardContent className="list-item-content">
          <Typography component="div" className="title">{props.item.title}</Typography>
          <Typography variant="body2" color="textSecondary" component="div">${props.item.price.toFixed(2)}</Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

export default ListItem;
