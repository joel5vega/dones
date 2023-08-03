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
        console.log( "User is signed in")
        
        setUser(result.user);
      })
      .catch((error) => {
        console.error(error.message)
      });
  };

  return (
    <div>
      {user ? (
        <UserProfile user={user} />
      ) : (
        <GoogleSignInButton onClick={handleGoogleSignIn} />
      )}
    </div>
  );
};

export default LoginPage;
