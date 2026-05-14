import React from 'react';
import DataResourcePage from './DataResourcePage';

const getActivitiesEndpoint = () => {
	const codespace = process.env.REACT_APP_CODESPACE_NAME;
	if (codespace) {
		return `https://${codespace}-8000.app.github.dev/api/activities/`;
	}

	const { protocol, hostname } = window.location;
	const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
	const codespacesFrontendMatch = hostname.match(/^(.*)-3000\.app\.github\.dev$/);

	if (isLocalhost) {
		return `${protocol}//${hostname}:8000/api/activities/`;
	}

	if (codespacesFrontendMatch) {
		return `https://${codespacesFrontendMatch[1]}-8000.app.github.dev/api/activities/`;
	}

	return '/api/activities/';
};

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

const Activities = () => (
	<DataResourcePage
		title="Activities"
		resourcePath="activities"
		endpoint={getActivitiesEndpoint()}
		columns={activityColumns}
	/>
);

export default Activities;
