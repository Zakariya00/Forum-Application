import express, { Request, Response } from "express";
import {checkUserLoggedIn} from "./controller/middleware";
import {
    createPost,
    deletePost,
    getAllPosts,
    getPostsByUser,
    likePost,
    updatePost
} from "./controller/post.controller";

export const postRouter = express.Router();

/* Post router */

// For getting all posts
postRouter.get("/all", checkUserLoggedIn, getAllPosts);


// For getting all posts made by user
// @ts-ignore
postRouter.get("/user", checkUserLoggedIn, getPostsByUser);

// For creating a post
// @ts-ignore
postRouter.post("/create", checkUserLoggedIn, createPost);

// For deleting a post
postRouter.delete("/delete/:postID", checkUserLoggedIn, deletePost);

// For updating a post
postRouter.put("/update/:postID", checkUserLoggedIn, updatePost);

// For liking a post
// @ts-ignore
postRouter.put("/like/:postID", checkUserLoggedIn, likePost);

