import React from 'react';
import DataResourcePage from './DataResourcePage';

const formatSuggestedUsers = (value) => {
	if (!Array.isArray(value) || value.length === 0) {
		return 'No suggestions';
	}

	return value.map((user) => (typeof user === 'object' ? user.username || user.id : user)).join(', ');
};

const workoutColumns = [
	{ key: 'name', label: 'Workout' },
	{ key: 'description', label: 'Description' },
	{
		key: 'suggested_for_names',
		label: 'Suggested for',
		render: (value) => formatSuggestedUsers(value),
		searchValue: (value) => formatSuggestedUsers(value),
	},
];

const Workouts = () => <DataResourcePage title="Workouts" resourcePath="workouts" columns={workoutColumns} />;

export default Workouts;
