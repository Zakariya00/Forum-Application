import { Request, Response } from "express";
import { makePostService } from "../../db/service/post.service";
import {PostInterface} from "../../model/post.interface";
import {toCreatePostInterface} from "./interface.types";
import {ObjectId} from "mongodb";
import {UserInterface} from "../../model/user.interface";

const postService = makePostService();

export const getAllPosts = async (
    req: Request,
    res: Response<PostInterface[] | string>
) => {

    try {
        const allPosts: PostInterface[] | null = await postService.getAllPosts(); // Get all posts
        if (allPosts) {
            res.status(200).json(allPosts);
        } else {
            res.status(500).send("Error fetching posts or no posts found");
        }

    } catch (e) {
        if (e instanceof Error) { res.status(500).send(e.message); console.error(e);}
        else { res.status(500).send("Unexpected error during call to get all posts");}
    }
};

export const getPostsByUser = async (
    req: Request<{}, {}, {}> &
        {session : {user : UserInterface}},
    res: Response<PostInterface[] | string>
) => {

    try {
        // @ts-ignore
        const userPosts: PostInterface[] | null = await postService.getPostsBy(req.session.user._id);
        if (userPosts) {
            res.status(200).json(userPosts);
        } else {
            res.status(500).send("Error fetching users posts or no posts found");
        }

    } catch (e) {
        if (e instanceof Error) { res.status(500).send(e.message); console.error(e);}
        else { res.status(500).send("Unexpected error during call to get user posts");}
    }
};

export const createPost = async (
    req: Request<{}, {}, toCreatePostInterface> &
        {session : {user : UserInterface}},
    res: Response<string>
) => {

    try {

        // Check request parameters for null
        if (req.body.title == null || req.body.content == null) {
            res.status(400).send("Missing title or content");
            return;
        }

        // Check request parameters for valid types
        for (const value of Object.values(req.body)) {
            if (typeof value !== 'string') {
                res.status(400).send(`Bad POST call to ${req.originalUrl} --- ${typeof value} is not a string`);
                return;
            }
        }

        // @ts-ignore
        const newPost = await postService.createPost(req.body.title, req.body.content, req.session.user._id); // Create post
        if (newPost) {
            res.status(201).send("Post has been Created");
        } else {
            res.status(500).send("Error creating user post");
        }

    } catch (e) {
        if (e instanceof Error) { res.status(500).send(e.message); console.error(e);}
        else { res.status(500).send("Unexpected error during call to create user post");}
    }
};

export const deletePost = async (
    req: Request<{postID: string}, {}, {}> &
        {session : {user? : UserInterface}},
    res: Response<string>
) => {
    try {

        // Check request parameters for null
        if (req.params.postID == null) {
            res.status(400).send("Missing post ID");
            return;
        }

        // Check request parameters for valid types
        if (!ObjectId.isValid(req.params.postID)) {
            res.status(400).send('Invalid post ID');
            return;
        }

        const id = new ObjectId(req.params.postID);

        // @ts-ignore
        const deletedPost = await postService.deletePost(req.session.user._id, id); // Delete post
        if (deletedPost) {
            res.status(200).send("Post has been deleted");
        } else {
            res.status(404).send("Post not found");
        }

    } catch (e) {
        if (e instanceof Error) { res.status(500).send(e.message); console.error(e);}
        else { res.status(500).send("Unexpected error during call to delete user post");}
    }
};

export const updatePost = async (
    req: Request<{postID: string}, {}, {content: string}> &
        {session : {user? : UserInterface}},
    res: Response<string>
) => {
    try {

        // Check request parameters for null
        if (req.params.postID == null || req.body.content == null) {
            res.status(400).send("Missing post ID or Content");
            return;
        }

        // Check request parameters for valid types
        if (!ObjectId.isValid(req.params.postID)) {
            res.status(400).send('Invalid post ID');
            return;
        }

        const id = new ObjectId(req.params.postID);
        // @ts-ignore
        const updatedPost = await postService.updatePost(req.session.user._id, id, req.body.content); // update post
        if (updatedPost) {
            res.status(200).send("Post has been updated");
        } else {
            res.status(404).send("Post not found");
        }

    } catch (e) {
        if (e instanceof Error) { res.status(500).send(e.message); console.error(e);}
        else { res.status(500).send("Unexpected error during call to update post");}
    }
};

export const likePost = async (
    req: Request<{postID: string}, {}, {}> &
        {session : {user : UserInterface}},
    res: Response<string>
) => {
    try {

        // Check request parameters for null
        if (req.params.postID == null) {
            res.status(400).send("Missing post ID");
            return;
        }

        // Check request parameters for valid types
        if (!ObjectId.isValid(req.params.postID)) {
            res.status(400).send('Invalid post ID');
            return;
        }

        const id = new ObjectId(req.params.postID);
        // @ts-ignore
        const likedPost = await postService.likePost(id, req.session.user._id); // Like post
        if (likedPost) {
            res.status(200).send("Post has been liked");
        } else {
            res.status(404).send("Post not found");
        }

    } catch (e) {
        if (e instanceof Error) { res.status(500).send(e.message); console.error(e);}
        else { res.status(500).send("Unexpected error during call to like post");}
    }
};
