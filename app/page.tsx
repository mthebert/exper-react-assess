"use client";
import React, { useState, useEffect } from 'react';
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

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/users.json')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map((user: { id: number, name: string, username: string, email: string, address: { street: string, suite: string, city: string, zipcode: string } }) => (
          <li key={user.id}>
            <h2>{user.name}</h2>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Address: {user.address.street}, {user.address.suite}, {user.address.city}, {user.address.zipcode}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;