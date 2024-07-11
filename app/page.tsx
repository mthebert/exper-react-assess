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
  firstName: string;
  lastName: string;
  suffix: string;
  title: string;
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

  function splitName(name:string) {
    // Regular expression to identify titles and suffixes
    const titleRegex = /^(Mr|Ms|Mrs|Miss|Dr|Prof)\.?\s+/i;
    const suffixRegex = /\s+(Jr|Sr|II|III|IV|V)$/i;

    // Extract title
    const titleMatch = name.match(titleRegex);
    const title = titleMatch ? titleMatch[0].trim() : '';

    // Remove title from name
    if (title) name = name.replace(titleRegex, '');

    // Extract suffix
    const suffixMatch = name.match(suffixRegex);
    const suffix = suffixMatch ? suffixMatch[0].trim() : '';

    // Remove suffix from name
    if (suffix) name = name.replace(suffixRegex, '');

    // Split remaining name into first and last name
    const [firstName, lastName] = name.split(' ');

    return { title, firstName, lastName, suffix };
}

  const processedUsers = users.map(user => {
    const { title, firstName, lastName, suffix } = splitName(user.name);
    return {
        ...user,
        title,
        firstName,
        lastName,
        suffix
    };
}).sort((a, b) => a.lastName.localeCompare(b.lastName));

  const filterOptions = (options: User[], state: { inputValue: string }) => {
    const inputValue = state.inputValue.toLowerCase();
    return options.filter(option => {
      const nameParts = option.name.split(' ').map(part => part.toLowerCase());
      return nameParts.some(part => part.includes(inputValue));
    });
  };


  return (
    <div>
      <h1>User List</h1>
      <Autocomplete
        options={processedUsers}
        getOptionLabel={(option) => option.firstName + option.lastName}
        filterOptions={filterOptions}
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