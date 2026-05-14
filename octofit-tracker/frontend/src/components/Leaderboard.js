import React from 'react';
import DataResourcePage from './DataResourcePage';

const getLeaderboardEndpoint = () => {
	const codespace = process.env.REACT_APP_CODESPACE_NAME;
	if (codespace) {
		return `https://${codespace}-8000.app.github.dev/api/leaderboard/`;
	}

	const { protocol, hostname } = window.location;
	const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
	const codespacesFrontendMatch = hostname.match(/^(.*)-3000\.app\.github\.dev$/);

	if (isLocalhost) {
		return `${protocol}//${hostname}:8000/api/leaderboard/`;
	}

	if (codespacesFrontendMatch) {
		return `https://${codespacesFrontendMatch[1]}-8000.app.github.dev/api/leaderboard/`;
	}

	return '/api/leaderboard/';
};

const leaderboardColumns = [
	{ key: 'rank', label: 'Rank' },
	{
		key: 'user_name',
		label: 'User',
	},
	{ key: 'score', label: 'Score' },
];

const Leaderboard = () => (
	<DataResourcePage
		title="Leaderboard"
		resourcePath="leaderboard"
		endpoint={getLeaderboardEndpoint()}
		columns={leaderboardColumns}
	/>
);

export default Leaderboard;
