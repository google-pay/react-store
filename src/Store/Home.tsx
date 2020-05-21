import React from 'react';
import Category from './Category';
import './Home.css';
import { CategoryDetails } from '../data/store-data';

interface Props {
  categories: CategoryDetails[],
}

const Home: React.FC<Props> = (props) => {
  return (
    <div className="Home">
      {props.categories.map(cat => <Category key={cat.name} {...cat}/>)}
    </div>
  );
}

export default Home;
