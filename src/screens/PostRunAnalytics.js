// PostRunAnalytics.js
import React from 'react';
import { Line } from 'react-chartjs-2';

const PostRunAnalytics = () => {
    // Example data for chart
    const data = {
        labels: ['Run 1', 'Run 2', 'Run 3'],
        datasets: [{
            label: 'Pace',
            data: [5, 6, 4.5],
            borderColor: 'rgba(75,192,192,1)',
            fill: false,
        }],
    };

    return (
        <div>
            <h1>Post-Run Analytics</h1>
            <Line data={data} />
        </div>
    );
};

export default PostRunAnalytics;
