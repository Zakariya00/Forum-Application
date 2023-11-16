

// For handling data sent for user log in
export interface LoginInterface {
    username: string;
    password: string;
}

// For handling data sent for creating a post
export interface toCreatePostInterface {
    title: string,
    content: string;
}

// For handling data sent for creating a comment
export interface toCreateCommentInterface {
    content: string,
    commentParent?: string
}