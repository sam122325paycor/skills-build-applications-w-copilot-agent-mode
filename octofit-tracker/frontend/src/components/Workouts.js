import React from 'react';
import DataResourcePage from './DataResourcePage';

const getWorkoutsEndpoint = () => {
	const codespace = process.env.REACT_APP_CODESPACE_NAME;
	if (codespace) {
		return `https://${codespace}-8000.app.github.dev/api/workouts/`;
	}

	const { protocol, hostname } = window.location;
	const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
	const codespacesFrontendMatch = hostname.match(/^(.*)-3000\.app\.github\.dev$/);

	if (isLocalhost) {
		return `${protocol}//${hostname}:8000/api/workouts/`;
	}

	if (codespacesFrontendMatch) {
		return `https://${codespacesFrontendMatch[1]}-8000.app.github.dev/api/workouts/`;
	}

	return '/api/workouts/';
};

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

const Workouts = () => (
	<DataResourcePage
		title="Workouts"
		resourcePath="workouts"
		endpoint={getWorkoutsEndpoint()}
		columns={workoutColumns}
	/>
);

export default Workouts;
