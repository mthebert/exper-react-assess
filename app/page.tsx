"use client";
import React, { useState, useEffect } from 'react';
import { CardContent, Card, Typography, Toolbar, AppBar, Container, CssBaseline, Autocomplete, TextField } from '@mui/material';
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

    function formatName(name: string) {
        // Regex to identify known titles and suffixes
        const titleRegex = /^(Mr|Ms|Mrs|Miss|Dr|Prof)\.?\s+/i;
        const suffixRegex = /\s+(Jr|Sr|II|III|IV|V)$/i;

        // Find and Extract title
        const titleMatch = name.match(titleRegex);
        const title = titleMatch ? titleMatch[0].trim() : '';

        // Find and Extract suffix
        const suffixMatch = name.match(suffixRegex);
        const suffix = suffixMatch ? suffixMatch[0].trim() : '';

        // Split remaining name into first and last name
        const [firstName, lastName] = name.split(' ');

        // create formatted name to include title and suffix when available
        const formattedName = `${lastName}${suffix ? ' ' + suffix : ''}, ${firstName}${title ? ' (' + title + ')' : ''}`

        return { title, firstName, lastName, suffix, formattedName };
    }

    const processedUsers = users.map(user => {
        // Destructure the formatted name and send it to be formatted, sort object by last name
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

    // Autocomplete - Filter options based on user input
    const filterOptions = (options: User[], state: { inputValue: string }) => {
        const inputValue = state.inputValue.toLowerCase();
        return options.filter(option => {
            const nameParts = option.name.split(' ').map(part => part.toLowerCase());
            return nameParts.some(part => part.includes(inputValue));
        });
    };


    return (
        <Container maxWidth="md" className="cardContainer">

            <CssBaseline />
            <AppBar position="static">

                <Toolbar>
                    <Typography variant="h4">User Information</Typography>
                </Toolbar>

            </AppBar>

            <div className="cardInput">

                <Autocomplete
                    options={processedUsers}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => option.formattedName}
                    filterOptions={filterOptions}
                    renderInput={(params) => <TextField {...params} label="Search User" variant="outlined" />}
                    onChange={(event, newValue) => setSelectedUser(newValue)}
                />

            </div>
            <Card className="card">

                <CardContent>

                    <Typography variant="h6" component="h1">
                        {selectedUser && (
                            <div>
                                <p>{selectedUser.formattedName}</p>
                                <p>{selectedUser.address.street}</p>
                                <p>{selectedUser.address.suite}</p>
                                <p>{selectedUser.address.city}, {selectedUser.address.zipcode}</p>
                            </div>
                        )}
                    </Typography>

                </CardContent>
            </Card>
        </Container>
    );
};

export default UserList;