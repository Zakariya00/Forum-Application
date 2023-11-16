import {PostInterface} from "../model/post.interface";
import {ObjectId} from "mongodb";

/* Post Service layer implementation interface */
export interface IPostService {

    // For creating a post
    createPost(title : string, content: string, user: ObjectId) : Promise<PostInterface | null>;

    // For getting posts by user
    getPostsBy(user: ObjectId) : Promise<PostInterface[] | null>;

    // For updating a post
    updatePost(user: ObjectId, postID: ObjectId, content: String) : Promise<PostInterface | null>;

    // For deleting a post
    deletePost(user: ObjectId, postID: ObjectId) : Promise<PostInterface | null>;

    // For liking a post
    likePost(postID: ObjectId, user : ObjectId) : Promise<PostInterface | null>;

    // For getting all posts
    getAllPosts() : Promise<PostInterface[] | null>;
}