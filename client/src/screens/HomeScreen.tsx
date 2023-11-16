import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreatePostInterface, PostInterface } from './helpers/helper.interfaces';
import './style/HomeScreen.css';

interface HomeScreenProps {
    goToLoginPage: () => void;
    goToPostPage: (post: PostInterface) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ goToLoginPage, goToPostPage }) => {
    // State variables for managing posts and post creation
    const [posts, setPosts] = useState<PostInterface[]>([]);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [editablePostId, setEditablePostId] = useState<string | null>(null);
    const [updatedPostContent, setUpdatedPostContent] = useState('');

    // Fetch posts on component mount
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get<PostInterface[]>('http://localhost:8080/posts/all');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    // Function to handle post likes
    const handleLike = async (postId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const response = await axios.put(`http://localhost:8080/posts/like/${postId}`);
            if (response.status === 200) {
                console.log(`Post with ID ${postId} liked successfully.`);
                const likePostsResponse = await axios.get<PostInterface[]>('http://localhost:8080/posts/all');
                setPosts(likePostsResponse.data);
            } else {
                console.error('Error liking post:', response.data);
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    // Function to handle post updates
    const handleUpdate = (postId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditablePostId(postId);
        setUpdatedPostContent(posts.find(post => post._id === postId)?.content || '');
    };

    // Function to send updated post content
    const handleSendUpdate = async (postId: string) => {
        try {
            const response = await axios.put(`http://localhost:8080/posts/update/${postId}`, {
                content: updatedPostContent,
            } as CreatePostInterface);

            if (response.status === 200) {
                console.log(`Post with ID ${postId} updated successfully.`);
                const updatedPostsResponse = await axios.get<PostInterface[]>('http://localhost:8080/posts/all');
                setPosts(updatedPostsResponse.data);
            } else {
                console.error('Error updating post:', response.data);
            }

            setEditablePostId(null);
            setUpdatedPostContent('');
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    // Function to handle post deletion
    const handleDelete = async (postId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const response = await axios.delete(`http://localhost:8080/posts/delete/${postId}`);
            if (response.status === 200) {
                console.log(`Post with ID ${postId} deleted successfully.`);
                const updatedPostsResponse = await axios.get<PostInterface[]>('http://localhost:8080/posts/all');
                setPosts(updatedPostsResponse.data);
            } else {
                console.error('Error deleting post:', response.data);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    // Function to handle post title press
    const handlePostTitlePress = (post: PostInterface) => {
        goToPostPage(post);
    };

    // Function to handle post creation
    const handlePostSubmit = async () => {
        try {
            if (!newPostTitle || !newPostContent) {
                console.error('Title and content are required for creating a post.');
                return;
            }

            const response = await axios.post('http://localhost:8080/posts/create', {
                title: newPostTitle,
                content: newPostContent,
            } as CreatePostInterface);

            if (response.status === 201) {
                console.log('Post has been created successfully.');
                const updatedPostsResponse = await axios.get<PostInterface[]>('http://localhost:8080/posts/all');
                setPosts(updatedPostsResponse.data);
            } else {
                console.error('Error creating post:', response.data);
            }

            setNewPostTitle('');
            setNewPostContent('');
            setIsCreatingPost(false);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    // Function to handle user logout
    const handleLogout = async () => {
        try {
            const response = await axios.delete('http://localhost:8080/user/logout');
            if (response.status === 200) {
                setTimeout(() => {
                    goToLoginPage();
                }, 10);
            } else {
                console.error('Error logging out:', response.data);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // JSX structure for HomeScreen component
    return (
        <div className="home-screen">
            <header>
                <h2>Home Screen</h2>

                {/* Conditional rendering for post creation */}
                {isCreatingPost ? (
                    <div className="create-post-container">
                        <label>
                            Title:
                            <input
                                type="text"
                                placeholder="Please enter title"
                                value={newPostTitle}
                                onChange={(e) => setNewPostTitle(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>
                            Text:
                            <textarea
                                placeholder="Please enter text"
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                            />
                        </label>
                        <br />
                        <button onClick={handlePostSubmit}>Create Post</button>
                    </div>
                ) : null}

                {/* Button for toggling post creation */}
                {!isCreatingPost && (
                    <button onClick={() => setIsCreatingPost(true)}>Create Post</button>
                )}
            </header>

            <section className="posts-section">
                {/* Conditional rendering for posts */}
                {posts.length === 0 ? (
                    <p>There are currently no posts.</p>
                ) : (
                    <div>
                        {posts.map((post) => (
                            <div key={post.updatedAt.toString()} className="post-container">
                                {/* Clickable post title */}
                                <h3 onClick={() => handlePostTitlePress(post)}>{post.title}</h3>
                                {/* Post details */}
                                <p>Posted: {new Date(post.createdAt).toLocaleString('sv-SE')}</p>
                                {/* Conditional rendering for post editing */}
                                {editablePostId === post._id ? (
                                    <div>
                                        <textarea
                                            value={updatedPostContent}
                                            onChange={(e) => setUpdatedPostContent(e.target.value)}
                                        />
                                        <button onClick={() => handleSendUpdate(post._id)}>Send</button>
                                    </div>
                                ) : (
                                    <p>{post.content}</p>
                                )}
                                <p>Likes: {post.likes.length}</p>
                                {/* Buttons for post interaction */}
                                <button onClick={(e) => handleLike(post._id, e)}>Like</button>
                                <button onClick={(e) => handleUpdate(post._id, e)}>Edit</button>
                                <button onClick={(e) => handleDelete(post._id, e)}>Delete</button>
                                <hr />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Logout button */}
            <footer>
                <button onClick={handleLogout}>Logout</button>
            </footer>
        </div>
    );
};

export default HomeScreen;
