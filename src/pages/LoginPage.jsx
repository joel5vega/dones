import React from 'react';

import {getAuth,GoogleAuthProvider,signInWithPopup}from 'firebase/auth';
import GoogleSignInButton from '../components/GoogleSignInButton';

const LoginPage = () => {
  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(provider)
      .then((result) => {
        // User is signed in
        const user = result.user;
      })
      .catch((error) => {
        // Handle error
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <GoogleSignInButton onClick={handleGoogleSignIn} />
    </div>
  );
};

export default LoginPage;
