import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography } from '@material-ui/core';
import { CategoryDetails } from '../data/store-data';
import './Category.css'

const Category: React.FC<CategoryDetails> = (props) => {
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
}

export default Category;
