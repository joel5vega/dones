import React from 'react';

const UserProfile = ({ user }) => {
  return (
    <div>
      <img src={user.photoURL} alt="Profile" className='profile-picture'/>
    </div>
  );
};

export default UserProfile;
