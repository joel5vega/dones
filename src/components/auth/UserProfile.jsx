import React from "react";
import GoogleSignInButton from "./GoogleSignInButton";
const UserProfile = ({ user ,handleGoogleSignIn}) => {
  return (
    <div>
      {user ? (
        <img src={user.photoURL} alt="Profile" className="profile-picture" />
      ) : (
        <GoogleSignInButton onClick={handleGoogleSignIn} />
      )}
    </div>
  );
};

export default UserProfile;
