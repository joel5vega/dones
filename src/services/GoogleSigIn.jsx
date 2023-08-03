import firebase from 'firebase/app';
import {getAuth,GoogleAuthProvider,signInWithPopup}from 'firebase/auth';
const provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().signInWithPopup(provider)
  .then((result) => {
    // User is signed in
    const user = result.user;
  })
  .catch((error) => {
    // Handle error
  });
  export default GoogleSignIn