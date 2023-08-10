import React, { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import GoogleSignInButton from './GoogleSignInButton';
import UserProfile from './UserProfile';

//usar contexto para exportar usuario
const UserContext = React.createContext();

const LoginPage = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        console.log( user,"is signed in")
      })
      .catch((error) => {
        console.error(error.message)
      });
  };

  return (
    <UserContext.Provider value ={user}>
    <div>
      {user ? (
        <UserProfile user={user} />
      ) : (
        <GoogleSignInButton onClick={handleGoogleSignIn} />
      )}
    </div>
    </UserContext.Provider>
  );
  
};
// console.log(UserContext.Consumer)
// export default LoginPage;
export { UserContext}
