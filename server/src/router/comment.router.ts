import express from "express";
import {checkUserLoggedIn} from "./controller/middleware";
import {
    createComment,
    deleteComment,
    getCommentsByPost,
    likeComment,
    updateComment
} from "./controller/comment.controller";

export const commentRouter = express.Router();
/* Comment Router */

// For getting all comments
commentRouter.get("/all/:postID", checkUserLoggedIn, getCommentsByPost);

// For creating a comment for the specified post
commentRouter.post("/create/:postID", checkUserLoggedIn, createComment);

// For deleting a comment
commentRouter.delete("/delete/:commentID", checkUserLoggedIn, deleteComment);

// For updating a comment
commentRouter.put("/update/:commentID", checkUserLoggedIn, updateComment);

// For liking a comment
commentRouter.put("/like/:commentID", checkUserLoggedIn, likeComment);

// commentRouter.get("/by/:userID", checkUserLoggedIn, getCommentsByUser);
// commentRouter.get("/:postID/:commentID", checkUserLoggedIn, getCommentById);






