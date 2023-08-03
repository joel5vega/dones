import React from 'react';

const UserProfile = ({ user }) => {
  return (
    <div>
      <img src={user.photoURL} alt="Profile" />
    </div>
  );
};

export default UserProfile;
