import React from 'react';

// For displaying an error message
const ErrorScreen: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Oops! Something went wrong.</h2>
            <p>We apologize for the inconvenience. Please try again later.</p>
        </div>
    );
};

export default ErrorScreen;
