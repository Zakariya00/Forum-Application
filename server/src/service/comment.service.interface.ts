import {CommentInterface} from "../model/comment.interface";
import {ObjectId} from "mongodb";

/* Comment Service layer implementation interface */
export interface ICommentService {

    // For creating a comment
    createComment(postParent: ObjectId, content: string, user: ObjectId, commentParent?: ObjectId) : Promise<CommentInterface | null>;

    // For getting comments made by a user
    getCommentsBy(user: ObjectId) : Promise<CommentInterface[] | null>;

    // For updating a comment
    updateComment(user: ObjectId, commentID: ObjectId, content: string) : Promise<CommentInterface | null>;

    // For deleting a comment
    deleteComment(user: ObjectId, commentID: ObjectId) : Promise<CommentInterface | null>;

    // For liking a comment
    likeComment(commentID: ObjectId, user : ObjectId) : Promise<CommentInterface | null>;

    // For getting all comments made on a post
    getAllPostComments(postID : ObjectId) : Promise<CommentInterface[] | null>;

    // For getting all comments made on a post comment
    getAllCommentComments(postID : ObjectId, commentID: ObjectId) : Promise<CommentInterface[] | null>;
}