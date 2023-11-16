/* App.tsx */
import React, { useState } from 'react';
import './App.css';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import CommentsScreen from './screens/CommentsScreen';
import ErrorScreen from './screens/ErrorScreen';
import {PostInterface} from "./screens/helpers/helper.interfaces";

import axios from "axios";
axios.defaults.withCredentials = true;

enum Page {
    LOGIN,
    REGISTER,
    HOME,
    POST_PAGE,
    ERROR
}

function App() {
    const [page, setPage] = useState<Page>(Page.LOGIN);
    const [selectedPost, setSelectedPost] = useState<PostInterface | null>(null); // Store the selected post

    switch (page) {
        case Page.LOGIN:
            return <LoginScreen
                goToRegisterPage={() => {
                    setPage(Page.REGISTER)
                }}
                goToMainPage={() => {
                    setPage(Page.HOME)
                }}
            />;
        case Page.REGISTER:
            return <RegisterScreen
                goToLoginPage={() => {
                    setPage(Page.LOGIN)
                }}
            />;
        case Page.POST_PAGE:
            return selectedPost ? ( // Render CommentsScreen only if there's a selected post
                <CommentsScreen
                    goToMainPage={() => {
                        setPage(Page.HOME)
                    }}
                    post={selectedPost} // Pass the selected post
                />
            ) : (
                // Handle the case when there's no selected post
                <ErrorScreen />
            );
        case Page.HOME:
            return <HomeScreen
                goToLoginPage={() => {
                    setPage(Page.LOGIN)
                }}
                goToPostPage={(post) => {
                    setSelectedPost(post); // Set the selected post before navigating
                    setPage(Page.POST_PAGE)
                }}
            />;
        case Page.ERROR:
            return <ErrorScreen />;
    }
}

export default App;
