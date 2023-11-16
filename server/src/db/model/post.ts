import {Schema} from "mongoose";
import {PostInterface} from "../../model/post.interface";
import {conn} from "../conn";

/* Represents the Post model in the database */

const postSchema : Schema<PostInterface> = new Schema<PostInterface> ({
    title: {
        type: String,
        required: true
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

export const postModel = conn.model<PostInterface>('Posts', postSchema);