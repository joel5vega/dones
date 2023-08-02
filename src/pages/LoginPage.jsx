import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import GoogleSignInButton from './GoogleSignInButton';

const LoginPage = () => {
  const handleGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
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
