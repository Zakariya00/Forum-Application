/* Comment Model layer implementation interface */
import {PostInterface} from "./post.interface";
import {basePostInterface} from "./basePost.interface";

/* Model layer Comment implementation interface */
export interface CommentInterface extends basePostInterface{
    parentPost: PostInterface;
    parentComment?: CommentInterface;
}