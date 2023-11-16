import {ICommentService} from "../../service/comment.service.interface";
import {ObjectId} from "mongodb";
import {CommentInterface} from "../../model/comment.interface";
import {commentModel} from "../model/comment";
import {postModel} from "../model/post";


/* Handles operations on the PostComment model */
class CommentService implements ICommentService{

    async createComment(postParent: ObjectId, content: string, user: ObjectId, commentParent?: ObjectId) : Promise<CommentInterface | null> {
        try {

            return await commentModel.create({
                parentPost: postParent,
                parentComment: commentParent || null,
                content: content,
                user: user,
                likes: [],
                comments: []
            });

        } catch (error) {
            if (error instanceof Error) { console.error('Error at comment creation:', error.message);}
            else { console.error('Unexpected error creation of comment:', error);}
            return null;
        }
    };

    async getCommentsBy(user: ObjectId) : Promise<CommentInterface[] | null> {
        try {
            return await commentModel.find({user: user});

        } catch (error) {
            if (error instanceof Error) { console.error('Error at comments get:', error.message);}
            else { console.error('Unexpected error getting comments:', error);}
            return null;
        }
    };

    async updateComment(user: ObjectId, commentID: ObjectId, content: string) : Promise<CommentInterface | null> {
        try {
            return await commentModel.findOneAndUpdate(
                {_id: commentID, user: user},
                { content: content },
                { new: true, timestamps: true}
            );

        } catch (error) {
            if (error instanceof Error) { console.error('Error at comment update:', error.message);}
            else { console.error('Unexpected error updating of comment:', error);}
            return null;
        }
    };

    async deleteComment(user: ObjectId, commentID: ObjectId) : Promise<CommentInterface | null> {
        try {
            return await commentModel.findOneAndDelete(
                {_id: commentID, user: user});

        } catch (error) {
            if (error instanceof Error) { console.error('Error at comment delete:', error.message);}
            else { console.error('Unexpected error deletion of comment:', error);}
            return null;
        }
    };

    async likeComment(commentID: ObjectId, user : ObjectId) : Promise<CommentInterface | null> {
        try {
            return await commentModel.findByIdAndUpdate(
                commentID,
                { $addToSet: { likes: user } },
                { new: true }
            );

        } catch (error) {
            if (error instanceof Error) { console.error('Error at comment like:', error.message);}
            else { console.error('Unexpected error like of comment:', error);}
            return null;
        }
    };

    async getAllPostComments(postID : ObjectId) : Promise<CommentInterface[] | null> {
        try {
            return await commentModel.find({parentPost: postID});

        } catch (error) {
            if (error instanceof Error) { console.error('Error at post comments get:', error.message);}
            else { console.error('Unexpected error getting all comments of post:', error);}
            return null;
        }
    };

    async getAllCommentComments(postID : ObjectId, commentID: ObjectId) : Promise<CommentInterface[] | null> {
        try {
            return await commentModel.find({
                parentPost: postID,
                parentComment: commentID
            });

        } catch (error) {
            if (error instanceof Error) { console.error('Error at comment comments get:', error.message);}
            else { console.error('Unexpected error getting all comments of comment:', error);}
            return null;
        }
    };

}

export function makeCommentService() : ICommentService {
    return new CommentService();
}