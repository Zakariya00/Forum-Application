import {Schema} from "mongoose";
import {CommentInterface} from "../../model/comment.interface";
import {conn} from "../conn";

/* Represents the Comment model in the database */

const commentSchema : Schema<CommentInterface> = new Schema<CommentInterface> ({
    parentPost: {
        type: Schema.Types.ObjectId,
        ref: 'Posts',
        required: true
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comments',
        default: null
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comments'
    }],
    },
    {timestamps: true,}
);

export const commentModel = conn.model<CommentInterface>('Comments', commentSchema);