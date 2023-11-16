import express from "express";
import session from "express-session"
import cors from "cors";
import * as path from "path";
import {defaultRouter} from "./router/default.router";
import {userRouter} from "./router/user.router";
import {postRouter} from "./router/post.router";
import {commentRouter} from "./router/comment.router";

export const app = express();

// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, '../../client/build')));


app.use(express.json());
app.use(session({
    secret : "Your secret key",
    resave : false,
    saveUninitialized : true
}));
app.use(cors({
    origin: true,
    credentials : true
}));



app.use("/user", userRouter); //  Example: http://localhost:8080/user
app.use("/posts", postRouter);  // Example: http://localhost:8080/posts
app.use("/post/comments", commentRouter); //  Example: http://localhost:8080/posts/comments
app.use("*", defaultRouter); //  Catch all for everything else







