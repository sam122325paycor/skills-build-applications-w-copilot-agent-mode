import React from 'react';
import DataResourcePage from './DataResourcePage';

const getTeamsEndpoint = () => {
	const codespace = process.env.REACT_APP_CODESPACE_NAME;
	if (codespace) {
		return `https://${codespace}-8000.app.github.dev/api/teams/`;
	}

	const { protocol, hostname } = window.location;
	const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
	const codespacesFrontendMatch = hostname.match(/^(.*)-3000\.app\.github\.dev$/);

	if (isLocalhost) {
		return `${protocol}//${hostname}:8000/api/teams/`;
	}

	if (codespacesFrontendMatch) {
		return `https://${codespacesFrontendMatch[1]}-8000.app.github.dev/api/teams/`;
	}

	return '/api/teams/';
};

const formatMemberList = (value) => {
	if (!Array.isArray(value) || value.length === 0) {
		return 'No members';
	}

	return value.map((member) => (typeof member === 'object' ? member.username || member.id : member)).join(', ');
};

const formatCreatedAt = (value) => {
	if (!value) {
		return '-';
	}

	const parsedDate = new Date(value);
	if (Number.isNaN(parsedDate.getTime())) {
		return '-';
	}

	return parsedDate.toLocaleString();
};

const teamColumns = [
	{ key: 'name', label: 'Team' },
	{
		key: 'member_names',
		label: 'Members',
		render: (value) => formatMemberList(value),
		searchValue: (value) => formatMemberList(value),
	},
	{
		key: 'created_at',
		label: 'Created',
		render: (value) => formatCreatedAt(value),
	},
];

const Teams = () => (
	<DataResourcePage title="Teams" resourcePath="teams" endpoint={getTeamsEndpoint()} columns={teamColumns} />
);

export default Teams;
