import React from 'react';

const GoogleSignInButton = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      Inicia sesión con Google
    </button>
  );
};

export default GoogleSignInButton;
