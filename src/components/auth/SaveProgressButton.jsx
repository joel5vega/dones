import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import Button from '@mui/material/Button';
const SaveProgressButton = ({ onClick }) => {
  return (
    <Button variant="contained" onClick={onClick}>
        <FontAwesomeIcon icon={faGoogle} />
    </Button>
  );
};

export default SaveProgressButton;
