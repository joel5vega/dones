import React, { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import GoogleSignInButton from './GoogleSignInButton';
import UserProfile from './UserProfile';

const LoginPage = () => {
  const [user, setUser] = useState(null);

  const handleGoogleSignIn = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // User is signed in
        setUser(result.user);
      })
      .catch((error) => {
        // Handle error
      });
  };

  return (
    <div>
      <h1>Login</h1>
      {user ? (
        <UserProfile user={user} />
      ) : (
        <GoogleSignInButton onClick={handleGoogleSignIn} />
      )}
    </div>
  );
};

export default LoginPage;
