import React from "react";
import GoogleSignInButton from "./GoogleSignInButton";
const UserProfile = ({ user,onTabClick}) => {
  return (
    <div>
      {user && (
        <img src={user.photoURL} alt="Profile" className="profile-picture" onClick={()=>onTabClick('user')} />
      )}
    </div>
  );
};

export default UserProfile;
