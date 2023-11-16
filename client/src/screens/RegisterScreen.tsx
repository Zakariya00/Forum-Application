import React, { useState } from 'react';
import axios from 'axios';
import { UserRegisterInterface } from './helpers/helper.interfaces';
import './style/RegisterScreen.css';
import { MainTitle } from './helpers/Header';
import Footer from './helpers/Footer';

interface RegisterScreenProps {
    goToLoginPage: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ goToLoginPage }) => {
    // State for user registration data
    const [user, setUser] = useState<UserRegisterInterface>({
        username: '',
        email: '',
        password: '',
    });
    // State for displaying the latest response text
    const [latestResponseText, setLatestResponseText] = useState<string | null>(null);
    // Set document title
    document.title = 'Register';

    // Handle user registration
    const handleRegister = async () => {
        try {
            console.log('Handling registration...');
            console.log('User Data:', user);

            // Clear user data after registration attempt
            setUser({
                username: '',
                email: '',
                password: '',
            });

            // Send registration request to the server
            const response = await axios.post('http://localhost:8080/user/register', {
                username: user.username || null,
                email: user.email || null,
                password: user.password || null,
            });

            // Store only the latest response text
            setLatestResponseText(response.data);

            // If registration is successful, redirect to login page after a delay
            if (response.status === 201) {
                setTimeout(() => {
                    goToLoginPage();
                }, 10);
            }
        } catch (error) {
            console.error('Error:', error);

            // @ts-ignore
            // Set the latest response text to the error message if available
            setLatestResponseText((error.response?.data || 'An error occurred during registration.'));
        }
    };

    return (
        <div className="wrapper">
            <div className="navbar">
                <MainTitle title="Web Forum" />
            </div>

            <div className="form-container">
                {/* Input fields for username, email, and password */}
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
                    Email:
                    <input
                        type="text"
                        placeholder="Enter your email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
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
                {/* Button for user registration */}
                <button onClick={handleRegister}>Register</button>
                <br />
                {/* Button to navigate to the login page */}
                <button onClick={goToLoginPage}>Already Signed Up?</button>

                {/* Display registration response message */}
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

export default RegisterScreen;
