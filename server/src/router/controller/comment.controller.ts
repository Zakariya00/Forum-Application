import { Request, Response } from "express";
import { makeCommentService } from "../../db/service/comment.service";
import {UserInterface} from "../../model/user.interface";
import {CommentInterface} from "../../model/comment.interface";
import {ObjectId} from "mongodb";
import {toCreateCommentInterface} from "./interface.types";

const commentService = makeCommentService();
export const getCommentsByPost = async (
    req: Request<{postID: string}, {}, {}>,
    res: Response<CommentInterface[] | string>
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
        const comments: CommentInterface[] | null = await commentService.getAllPostComments(id); // Get all comments
        if (comments) {
            res.status(200).json(comments);
        } else {
            res.status(500).send("Error fetching post comments posts");
        }

    } catch (e) {
        if (e instanceof Error) { res.status(500).send(e.message); console.error(e);}
        else { res.status(500).send("Unexpected error during call to get post comments");}
    }
};

export const createComment = async (
    req: Request<{postID: string}, {}, toCreateCommentInterface> &
        {session : {user? : UserInterface}},
    res: Response<string>
) => {
    try {

        // Check request parameters for null
        if (req.body.content == null || req.params.postID == null) {
            res.status(400).send("Missing post or content ");
            return;
        }

        // Check request parameters for valid types
        if (!ObjectId.isValid(req.params.postID)) {
            res.status(400).send('Invalid post ID');
            return;
        }

        // Check if comment is for a post or for a post comment
        let commentParent: ObjectId | undefined = undefined;
        if (req.body.commentParent !== undefined) {
            if (!ObjectId.isValid(req.body.commentParent)) {
                res.status(400).send('Invalid comment ID');
                return;
            }
            commentParent = new ObjectId(req.body.commentParent);
        }

        // Create comment
        const parentPost = new ObjectId(req.params.postID);
        const comment: CommentInterface | null = await commentService.createComment(
            parentPost,
            req.body.content,
            // @ts-ignore
            req.session.user._id,
            commentParent
        );
        if (comment) {
            res.status(201).send("Comment has been Created");
        } else {
            res.status(404).send("Error creating user comment");
        }

    } catch (e) {
    if (e instanceof Error) { res.status(500).send(e.message); console.error(e);}
    else { res.status(500).send("Unexpected error during call to create comment");}
    }
};

export const deleteComment = async (
    req: Request<{commentID: string}, {}, {}> &
        {session : {user? : UserInterface}},
    res: Response<string>
) => {
    try {

        // Check request parameters for null
        if (req.params.commentID == null) {
            res.status(400).send("Missing comment ID");
            return;
        }

        // Check request parameters for valid types
        if (!ObjectId.isValid(req.params.commentID)) {
            res.status(400).send('Invalid post ID');
            return;
        }

        const id = new ObjectId(req.params.commentID);
        // @ts-ignore
        const deletedComment = await commentService.deleteComment(req.session.user._id, id); // Delete comment
        if (deletedComment) {
            res.status(200).send("Comment has been deleted");
        } else {
            res.status(404).send("Comment not found");
        }

    } catch (e) {
        if (e instanceof Error) { res.status(500).send(e.message); console.error(e);}
        else { res.status(500).send("Unexpected error during call to delete comment");}
    }
};

export const updateComment = async (
    req: Request<{commentID: string}, {}, {content: string}> &
        {session : {user? : UserInterface}},
    res: Response<string>
) => {
    try {

        // Check request parameters for null
        if (req.params.commentID == null || req.body.content == null) {
            res.status(400).send("Missing comment ID or content");
            return;
        }

        // Check request parameters for valid types
        if (!ObjectId.isValid(req.params.commentID)) {
            res.status(400).send('Invalid post ID');
            return;
        }
        const id = new ObjectId(req.params.commentID);

        // @ts-ignore
        const newComment = await commentService.updateComment(req.session.user._id, id, req.body.content); // Update comment
        if (newComment) {
            res.status(200).send("Comment has been updated");
        } else {
            res.status(404).send("Comment not found");
        }
    } catch (e) {
        if (e instanceof Error) { res.status(500).send(e.message); console.error(e);}
        else { res.status(500).send("Unexpected error during call to update comment");}
    }
};

export const likeComment = async (
    req: Request<{commentID: string}, {}, {}> &
        {session : {user? : UserInterface}},
    res: Response<string>
) => {
    try {

        // Check request parameters for null
        if (req.params.commentID == null) {
            res.status(400).send("Missing comment ID");
            return;
        }

        // Check request parameters for valid types
        if (!ObjectId.isValid(req.params.commentID)) {
            res.status(400).send('Invalid comment ID');
            return;
        }

        // Like comment
        const id = new ObjectId(req.params.commentID);
        // @ts-ignore
        const likedPost = await commentService.likeComment(id, req.session.user._id); // Like comment
        if (likedPost) {
            res.status(200).send("Comment has been liked");
        } else {
            res.status(404).send("Comment not found");
        }

    } catch (e) {
        if (e instanceof Error) { res.status(500).send(e.message); console.error(e);}
        else { res.status(500).send("Unexpected error during call to like comment");}
    }
};

