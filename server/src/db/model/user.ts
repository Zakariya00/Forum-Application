import {Schema} from "mongoose";
import {UserInterface} from "../../model/user.interface";
import {conn} from "../conn";

/* Represents the User model in the database */

const userSchema : Schema<UserInterface> = new Schema<UserInterface> ({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true
    },
});

export const userModel = conn.model<UserInterface>('Users', userSchema);