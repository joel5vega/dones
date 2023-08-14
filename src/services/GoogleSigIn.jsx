import {getAuth,GoogleAuthProvider,signInWithPopup}from 'firebase/auth';
const auth = getAuth();

const provider = new GoogleAuthProvider();

signInWithPopup(provider)
  .then((result) => {
    // User is signed in
    const user = result.user;
  })
  .catch((error) => {
    // Handle error
  });
  export default auth