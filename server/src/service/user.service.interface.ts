import {UserInterface} from "../model/user.interface";
import {ObjectId} from "mongodb";

/* User Service layer implementation interface */
export interface IUserService {

    // For registering a user
    registerUser(userName : string, password : string, email : string) : Promise<UserInterface | null>;

    // For signing in a user
    loginUser(userName: string, password : string) : Promise<UserInterface | null>;

    // For getting user object from ID
    getUserbyID(userID : ObjectId) : Promise<UserInterface | null>;

    // For getting a user ID from user object
    getIDbyUser(user : UserInterface) : Promise<ObjectId | null>;

    // For checking if user exists
    checkUser(userName : string) : Promise<boolean>;
}