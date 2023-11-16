export interface UserRegisterInterface {
    username: string;
    password: string;
    email: string;
}

export interface UserLoginInterface {
    username: string;
    password: string;
}

export interface CreatePostInterface {
    title: string,
    content: string;
}



export interface PostInterface {
    _id: string;
    title: string;
    content: string;
    user: UserInterface;
    likes: UserInterface[];
    comments: CommentInterface[];
    createdAt: Date;
    updatedAt: Date;
}

export interface UserInterface {
    username: string;
    password: string;
    email: string;
}

export interface CommentInterface {
    parentPost: PostInterface;
    parentComment?: CommentInterface;
    _id: string;
    content: string;
    user: UserInterface;
    likes: UserInterface[];
    comments: CommentInterface[];
    createdAt: Date;
    updatedAt: Date;
}


