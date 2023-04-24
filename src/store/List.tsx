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

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import ListItem from './ListItem';

import { CategoryDetails } from '../interfaces/CategoryDetails';
import { ItemDetails } from '../interfaces/ItemDetails';
import { StoreData } from './StoreData';

/**Properties for the List component */
interface Props {
  categories: CategoryDetails[];
}

/**List React component
 *
 * @param {Props} props The details of the item categories
 */
const List: React.FC<Props> = (props: Props) => {
  // Manages store items, categories, etc.
  const storeData = useMemo(() => new StoreData(), []);

  // Current item details (if in state)
  const [items, setItems] = useState([] as ItemDetails[]);

  // Current category details (if in state)
  const [category, setCategory] = useState<CategoryDetails>();

  // Dynamic URL parameters
  const params = useParams<{ listId: string }>();

  // If the list ID or categories change, call setCategory
  useEffect(() => {
    setCategory(props.categories.find(cat => cat.name === params.listId));
  }, [params.listId, props.categories]);

  // If the category or store data changes, call getItemsByCategory
  useEffect(() => {
    if (!category) return;
    storeData.getItemsByCategory(category.name).then(data => setItems(data));
  }, [category, storeData]);

  // Return the React component
  return (
    <div className="List">
      {items.map(item => (
        <ListItem key={item.name} item={item} />
      ))}
    </div>
  );
};

export default List;
