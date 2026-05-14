import React from 'react';
import DataResourcePage from './DataResourcePage';

const leaderboardColumns = [
	{ key: 'rank', label: 'Rank' },
	{
		key: 'user_name',
		label: 'User',
	},
	{ key: 'score', label: 'Score' },
];

const Leaderboard = () => (
	<DataResourcePage title="Leaderboard" resourcePath="leaderboard" columns={leaderboardColumns} />
);

export default Leaderboard;
