import {IPostService} from "../../service/post.service.interface";
import {PostInterface} from "../../model/post.interface";
import {ObjectId} from "mongodb";
import {postModel} from "../model/post";


/* Handles operations on the Post model */
class PostService implements IPostService{

    async createPost(title : string, content: string, user: ObjectId) : Promise<PostInterface | null> {
        try {
            return await postModel.create({
                title: title,
                content: content,
                user: user,
                likes: [],
                comments: []
            });

        } catch (error) {
            if (error instanceof Error) { console.error('Error at post creation:', error.message);}
            else { console.error('Unexpected error creation of post:', error);}
            return null;
        }
    };
    async getPostsBy(user: ObjectId) : Promise<PostInterface[] | null> {
        try {
            return await postModel.find({user: user});

        } catch (error) {
            if (error instanceof Error) { console.error('Error at posts get:', error.message);}
            else { console.error('Unexpected error on getting posts:', error);}
            return null;
        }
    };

    async updatePost(user: ObjectId, postID: ObjectId, content: string) : Promise<PostInterface | null> {
        try {
            return await postModel.findOneAndUpdate(
                {_id: postID, user: user},
                { content: content },
                { new: true, timestamps: true}
            );

        } catch (error) {
            if (error instanceof Error) { console.error('Error on post update:', error.message);}
            else { console.error('Unexpected error on updating post:', error);}
            return null;
        }
    };

    async deletePost(user: ObjectId, postID: ObjectId) : Promise<PostInterface | null> {
        try {
            return await postModel.findOneAndDelete(
                {_id: postID, user: user});

        } catch (error) {
            if (error instanceof Error) { console.error('Error on post deletion:', error.message);}
            else { console.error('Unexpected error on deleting post:', error);}
            return null;
        }
    };

    async likePost(postID: ObjectId, user : ObjectId) : Promise<PostInterface | null> {
        try {
            return await postModel.findByIdAndUpdate(
                postID,
                { $addToSet: { likes: user } },
                { new: true }
            );

        } catch (error) {
            if (error instanceof Error) { console.error('Error on post like:', error.message);}
            else { console.error('Unexpected error on liking post:', error);}
            return null;
        }
    };
    async getAllPosts() : Promise<PostInterface[] | null> {
        try {
            return await postModel.find();

        } catch (error) {
            if (error instanceof Error) { console.error('Error on post get all:', error.message);}
            else { console.error('Unexpected error on getting all posts:', error);}
            return null;
        }
    };
}

export function makePostService() : IPostService {
    return new PostService();
}