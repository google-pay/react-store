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

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import './Status.css';

/**Properties for the Confirmation component */
interface Props {}

/**Confirmation React component
 *
 * @param {Props} props The details of the order confirmation
 */
const Confirmation: React.FC<Props> = (props: Props) => {
  const navigate = useNavigate();

  // Return the React component
  return (
    <div className="Confirmation">
      <div className="content">
        <Typography variant="h4">Success</Typography>
        <Typography variant="body2">
          Congratulations, on your purchase. The order has been received and is being processed.
        </Typography>
        <Typography variant="body2">
          <em>This is for demo purposes only. You have not been charged, the order is not being processed.</em>
        </Typography>
        <div className="buttons">
          <Button variant="text" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
