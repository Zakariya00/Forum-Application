import React, { useState } from 'react';
import axios from 'axios';
import { UserLoginInterface } from './helpers/helper.interfaces';
import './style/LoginScreen.css';
import { MainTitle } from './helpers/Header';
import Footer from './helpers/Footer';

interface LoginScreenProps {
    goToRegisterPage: () => void;
    goToMainPage: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ goToRegisterPage, goToMainPage }) => {
    // State for user login data
    const [user, setUser] = useState<UserLoginInterface>({
        username: '',
        password: '',
    });
    // State for displaying the latest response text
    const [latestResponseText, setLatestResponseText] = useState<string | null>(null);
    // Set document title
    document.title = 'Web Forum';

    // Handle user login
    const handleLogin = async () => {
        try {
            console.log('Handling login...');
            console.log('User Data:', user);

            // Clear user data after login attempt
            setUser({
                username: '',
                password: '',
            });

            // Send login request to the server
            const response = await axios.post('http://localhost:8080/user/login', {
                username: user.username || null,
                password: user.password || null,
            });

            // Store only the latest response text
            setLatestResponseText(response.data);

            // If login is successful, redirect to the main page after a delay
            if (response.status === 200) {
                setTimeout(() => {
                    goToMainPage();
                }, 10);
            }
        } catch (error) {
            console.error('Error:', error);

            // @ts-ignore
            // Set the latest response text to the error message if available
            setLatestResponseText((error.response?.data || 'An error occurred during login.'));
        }
    };

    return (
        <div className="wrapper">
            <div className="navbar">
                {/* Display main title in the navigation bar */}
                <MainTitle title="Web Forum" />
            </div>

            <div className="form-container">
                {/* Input fields for username and password */}
                <label>
                    Username:
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                </label>
                <br />
                {/* Button for user login */}
                <button onClick={handleLogin}>Sign in</button>
                <br />
                {/* Button to navigate to the registration page */}
                <button onClick={goToRegisterPage}>Not Registered?</button>

                {/* Display login response message */}
                {latestResponseText && (
                    <div>
                        <p> {latestResponseText}</p>
                    </div>
                )}
            </div>

            <div className="footer">
                {/* Display footer with company name */}
                <Footer year={2023} companyName="WebForum.se" />
            </div>
        </div>
    );
};

export default LoginScreen;
