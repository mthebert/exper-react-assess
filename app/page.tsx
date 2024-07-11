"use client";
import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
}
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/users.json')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  return (
    <div>
      <h1>User List</h1>
      <Autocomplete
        options={users}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Search User" variant="outlined" />}
        onChange={(event, newValue) => setSelectedUser(newValue)}
      />

      {selectedUser && (
        <div>
          <h2>Selected User</h2>
          <p>Name: {selectedUser.name}</p>
          <p>Address: {selectedUser.address.street}, {selectedUser.address.suite}, {selectedUser.address.city}, {selectedUser.address.zipcode}</p>
        </div>
      )}
    </div>
  );
};

export default UserList;