import React from 'react';
import DataResourcePage from './DataResourcePage';

const getUsersEndpoint = () => {
	const codespace = process.env.REACT_APP_CODESPACE_NAME;
	if (codespace) {
		return `https://${codespace}-8000.app.github.dev/api/users/`;
	}

	const { protocol, hostname } = window.location;
	const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
	const codespacesFrontendMatch = hostname.match(/^(.*)-3000\.app\.github\.dev$/);

	if (isLocalhost) {
		return `${protocol}//${hostname}:8000/api/users/`;
	}

	if (codespacesFrontendMatch) {
		return `https://${codespacesFrontendMatch[1]}-8000.app.github.dev/api/users/`;
	}

	return '/api/users/';
};

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

const Users = () => (
	<DataResourcePage title="Users" resourcePath="users" endpoint={getUsersEndpoint()} columns={usersColumns} />
);

export default Users;
