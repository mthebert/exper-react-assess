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
  formattedName: string;
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

  function formatName(name:string) {
    // Regex to identify known titles and suffixes
    const titleRegex = /^(Mr|Ms|Mrs|Miss|Dr|Prof)\.?\s+/i;
    const suffixRegex = /\s+(Jr|Sr|II|III|IV|V)$/i;

    // Find and Extract title
    const titleMatch = name.match(titleRegex);
    const title = titleMatch ? titleMatch[0].trim() : '';

    // Extract suffix
    const suffixMatch = name.match(suffixRegex);
    const suffix = suffixMatch ? suffixMatch[0].trim() : '';

    // Split remaining name into first and last name
    const [firstName, lastName] = name.split(' ');

    const formattedName = `${lastName}${suffix ? ' ' + suffix : ''}, ${firstName}${title ? ' (' + title + ')' : ''}`

    return { title, firstName, lastName, suffix, formattedName };
}

  const processedUsers = users.map(user => {
    const { title, firstName, lastName, suffix, formattedName } = formatName(user.name);
    return {
        ...user,
        title,
        firstName,
        lastName,
        suffix,
        formattedName
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
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.formattedName}
        filterOptions={filterOptions}
        renderInput={(params) => <TextField {...params} label="Search User" variant="outlined" />}
        onChange={(event, newValue) => setSelectedUser(newValue)}
      />

      {selectedUser && (
        <div>
          <p>{selectedUser.formattedName}</p>
          <p>{selectedUser.address.street}</p>
          <p>{selectedUser.address.suite}</p>
          <p>{selectedUser.address.city}, {selectedUser.address.zipcode}</p>
        </div>
      )}
    </div>
  );
};

export default UserList;