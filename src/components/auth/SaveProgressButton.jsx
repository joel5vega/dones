import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/fontawesome-svg-core';
import Button from '@mui/material/Button';
const SaveProgressButton = ({ onClick }) => {
  return (
    <Button variant="contained" onClick={onClick}>
        <FontAwesomeIcon icon={faGoogle} />
    </Button>
  );
};

export default SaveProgressButton;
