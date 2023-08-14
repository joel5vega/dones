import React from "react";
import GoogleSignInButton from "./GoogleSignInButton";
const UserProfile = ({ user }) => {
  return (
    <div>
      {user && (
        <img src={user.photoURL} alt="Profile" className="profile-picture" />
      )}
    </div>
  );
};

export default UserProfile;
