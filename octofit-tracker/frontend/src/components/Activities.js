import React from 'react';
import DataResourcePage from './DataResourcePage';

const activityColumns = [
	{ key: 'activity_type', label: 'Activity' },
	{
		key: 'duration',
		label: 'Duration',
		render: (value) => `${value} min`,
		searchValue: (value) => `${value}`,
	},
	{
		key: 'calories_burned',
		label: 'Calories',
		render: (value) => `${value} kcal`,
		searchValue: (value) => `${value}`,
	},
	{ key: 'date', label: 'Date' },
	{
		key: 'user_name',
		label: 'User',
	},
];

const Activities = () => <DataResourcePage title="Activities" resourcePath="activities" columns={activityColumns} />;

export default Activities;
