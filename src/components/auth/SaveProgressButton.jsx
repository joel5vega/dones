import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import Button from '@mui/material/Button';
const SaveProgressButton = ({ onClick }) => {
  return (
    <Button variant="contained" onClick={onClick}>
        Guardar <FontAwesomeIcon icon={faCloudUploadAlt} /> 
    </Button>
  );
};

export default SaveProgressButton;
