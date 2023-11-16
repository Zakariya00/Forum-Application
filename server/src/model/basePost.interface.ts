import {UserInterface} from "./user.interface";
import {CommentInterface} from "./comment.interface";

/* Model layer Post/Comment interface */
export interface basePostInterface {
    content: string;
    user: UserInterface;
    likes: UserInterface[];
    comments: CommentInterface[];
    createdAt: Date;
    updatedAt: Date;
}