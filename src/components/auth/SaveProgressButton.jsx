import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/fontawesome-svg-core';
import Button from '@mui/material/Button';
const SaveProgressButton = ({ onClick }) => {
  return (
    <Button variant="contained" onClick={onClick}>
        <FontAwesomeIcon icon={faSave} />
    </Button>
  );
};

export default SaveProgressButton;
