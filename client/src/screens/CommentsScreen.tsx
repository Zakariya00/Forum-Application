import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CommentInterface, PostInterface } from './helpers/helper.interfaces';
import './style/CommentsScreen.css';

interface CommentsScreenProps {
    goToMainPage: () => void;
    post: PostInterface;
}

const CommentsScreen: React.FC<CommentsScreenProps> = ({ goToMainPage, post }) => {
    // State for comments
    const [comments, setComments] = useState<CommentInterface[]>([]);
    // State for creating new comment
    const [newCommentContent, setNewCommentContent] = useState('');
    // State for editing comment
    const [editableCommentId, setEditableCommentId] = useState<string | null>(null);
    const [editableCommentContent, setEditableCommentContent] = useState('');
    // State for parent comment (if replying)
    const [parentCommentId, setParentCommentId] = useState<string | null>(null);
    // State to show or hide the comment field
    const [showCommentField, setShowCommentField] = useState(false);
    // Set document title
    document.title = 'Comments';

    // Fetch post details
    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await axios.get<PostInterface>(`http://localhost:8080/post/${post._id}`);
                post.likes = response.data.likes;
                post.comments = response.data.comments;
            } catch (error) {
                console.error('Error fetching post details:', error);
            }
        };

        fetchPostDetails();
    }, [post._id, post]);

    // Fetch comments for the post
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get<CommentInterface[]>(`http://localhost:8080/post/comments/all/${post._id}`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [post._id]);

    // Handle liking a comment
    const handleLikeComment = async (commentId: string) => {
        console.log(`Liked comment with id ${commentId}`);
        try {
            const response = await axios.put(`http://localhost:8080/post/comments/like/${commentId}`);

            if (response.status === 200) {
                console.log(`Comment with ID ${commentId} liked successfully.`);
                const likeCommentsResponse = await axios.get<CommentInterface[]>(`http://localhost:8080/post/comments/all/${post._id}`);
                setComments(likeCommentsResponse.data);
                setEditableCommentId(null);
                setEditableCommentContent('');
            } else {
                console.error('Error liking comment:', response.data);
            }
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    // Handle updating a comment
    const handleUpdateComment = async (commentId: string, content: string) => {
        try {
            const response = await axios.put(`http://localhost:8080/post/comments/update/${commentId}`, {
                content,
            });

            if (response.status === 200) {
                console.log(`Comment with ID ${commentId} updated successfully.`);
                const updatedCommentsResponse = await axios.get<CommentInterface[]>(`http://localhost:8080/post/comments/all/${post._id}`);
                setComments(updatedCommentsResponse.data);
                setEditableCommentId(null);
                setEditableCommentContent('');
            } else {
                console.error('Error updating comment:', response.data);
            }
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    // Handle deleting a comment
    const handleDeleteComment = async (commentId: string) => {
        try {
            const response = await axios.delete(`http://localhost:8080/post/comments/delete/${commentId}`);
            if (response.status === 200) {
                console.log(`Comment with ID ${commentId} deleted successfully.`);
                const updatedCommentsResponse = await axios.get<CommentInterface[]>(`http://localhost:8080/post/comments/all/${post._id}`);
                setComments(updatedCommentsResponse.data);
            } else {
                console.error('Error deleting comment:', response.data);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // Handle creating a new comment
    const handleCreateComment = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/post/comments/create/${post._id}`, {
                content: newCommentContent,
                commentParent: parentCommentId || undefined,
            });

            if (response.status === 201) {
                console.log('Comment has been created successfully.');
                const updatedCommentsResponse = await axios.get<CommentInterface[]>(`http://localhost:8080/post/comments/all/${post._id}`);
                setComments(updatedCommentsResponse.data);
                setNewCommentContent('');
                setParentCommentId(null);
                setShowCommentField(false);
            } else {
                console.error('Error creating comment:', response.data);
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    // Handle clicking on a comment to reply
    const handleCommentClick = (commentId: string) => {
        setShowCommentField(true);
        setParentCommentId(commentId);
    };

    // Handle creating a top-level comment
    const handleCreateTopLevelComment = () => {
        setShowCommentField(true);
        setParentCommentId(null);
    };

    return (
        <div className="comments-screen">
            <header>
                <h2>Post Comments</h2>
            </header>

            <div className="post-container">
                <h3>{post.title}</h3>
                <p>Posted: {new Date(post.createdAt).toLocaleString('sv-SE')}</p>
                <p>{post.content}</p>
                <p>Likes: {post.likes.length}</p>
            </div>

            <section className="comments-section">
                <h3>Comments</h3>
                {comments.length === 0 ? (
                    <p>No comments available.</p>
                ) : (
                    <ul>
                        {comments.map((comment) => (
                            <li key={comment._id} className="comment-container">
                                {editableCommentId === comment._id ? (
                                    <div>
                                        <textarea
                                            value={editableCommentContent}
                                            onChange={(e) => setEditableCommentContent(e.target.value)}
                                            placeholder="Enter your comment here"
                                        />
                                        <button onClick={() => handleUpdateComment(comment._id, editableCommentContent)}>Send</button>
                                    </div>
                                ) : (
                                    <div>
                                        <p>Commented: {new Date(comment.createdAt).toLocaleString('sv-SE')}</p>
                                        <p>{comment.content}</p>
                                        <p>Likes: {comment.likes.length}</p>
                                        <button onClick={() => handleLikeComment(comment._id)}>Like</button>
                                        <button onClick={() => setEditableCommentId(comment._id)}>Edit</button>
                                        <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                                        <button onClick={() => handleCommentClick(comment._id)}>Comment</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {showCommentField && (
                <div className="create-comment-container">
                    <label>
                        New Comment:
                        <textarea
                            placeholder="Please enter comment"
                            value={newCommentContent}
                            onChange={(e) => setNewCommentContent(e.target.value)}
                        />
                    </label>
                    <br />
                    <button onClick={handleCreateComment}>Send</button>
                </div>
            )}

            <footer>
                <button onClick={handleCreateTopLevelComment}>Create Comment</button>
                <button onClick={goToMainPage}>Go to Main Page</button>
            </footer>
        </div>
    );
};

export default CommentsScreen;
