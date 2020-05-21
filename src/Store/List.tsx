import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ItemDetails, StoreData, CategoryDetails } from '../data/store-data';
import ListItem from './ListItem';

interface Props {
  categories: CategoryDetails[],
}

const List: React.FC<Props> = (props) => {
  const storeData = new StoreData();
  const [items, setItems] = useState([] as ItemDetails[]);
  const [category, setCategory] = useState<CategoryDetails>();
  const params = useParams<{listId: string}>();

  useEffect(() => {
    setCategory(props.categories.find(cat => cat.name === params.listId))
  }, [params.listId, props.categories]);

  useEffect(() => {
    if (!category) return;
    storeData.getItemsByCategory(category.name).then(data => setItems(data));
  }, [category, storeData]);

  return (
    category
      ? <div className="List">
          {items.map(item => (
            <ListItem key={item.name} item={item} />
          ))}
        </div>
      : <div />
  );
}

export default List;
