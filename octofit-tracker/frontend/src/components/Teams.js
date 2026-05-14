import React from 'react';
import DataResourcePage from './DataResourcePage';

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

const Teams = () => <DataResourcePage title="Teams" resourcePath="teams" columns={teamColumns} />;

export default Teams;
