import React from 'react';
import { Typography, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import './Status.css';

interface Props {
}

const Confirmation: React.FC<Props> = (props) => {
  const history = useHistory();

  return (
    <div className="Confirmation">
      <Typography variant="h4">Success</Typography>
      <Typography variant="body2">
        Congratulations, on your purchase. The order has been received and is being processed.
      </Typography>
      <Typography variant="body2">
        <em>This is for demo purposes only. You have not been charged, the order is not being processed.</em>
      </Typography>
      <div className="buttons">
        <Button variant="text" onClick={() => history.push('/')}>Continue Shopping</Button>
      </div>
    </div>
  );
}

export default Confirmation;
