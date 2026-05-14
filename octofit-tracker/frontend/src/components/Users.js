import React from 'react';
import DataResourcePage from './DataResourcePage';

const usersColumns = [
	{ key: 'display_name', label: 'Name' },
	{ key: 'username', label: 'Username' },
	{ key: 'email', label: 'Email' },
	{
		key: 'is_staff',
		label: 'Role',
		render: (value) => (value ? 'Staff' : 'Member'),
		searchValue: (value) => (value ? 'staff' : 'member'),
	},
];

const Users = () => <DataResourcePage title="Users" resourcePath="users" columns={usersColumns} />;

export default Users;
