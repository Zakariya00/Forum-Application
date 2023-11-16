import {IUserService} from "../../service/user.service.interface";
import {ObjectId} from "mongodb";
import {UserInterface} from "../../model/user.interface";
import {userModel} from "../model/user";


/* Handles operations on the User model */
class UserService implements IUserService{

    async registerUser(userName : string, password : string, email : string) : Promise<UserInterface | null> {
        try {
            if (await userModel.exists({username : userName})) {return null;}
            return await userModel.create({
                username: userName,
                password: password,
                email: email
            });
            
        } catch (error) {
            if (error instanceof Error) { console.error('Error registering user:', error.message);} 
            else { console.error('Unexpected error during user registration:', error);}
            return null;
        }
    };

    async loginUser(userName: string, password : string) : Promise<UserInterface | null> {
        try {
            return await userModel.findOne({username: userName, password: password});

        } catch (error) {
            if (error instanceof Error) { console.error('Error logging in user:', error.message);}
            else { console.error('Unexpected error during user login:', error);}
            return null;
        }
    };

    async getUserbyID(userID : ObjectId) : Promise<UserInterface | null> {
        try {
            return await userModel.findById(userID);

        } catch (error) {
            if (error instanceof Error) { console.error('Error getting user by ID:', error.message);}
            else { console.error('Unexpected error during user getUserbyID:', error);}
            return null;
        }
    };

    async getIDbyUser(user : UserInterface) : Promise<ObjectId | null> {
        try {
            const foundUser = await userModel.findOne(user);
            return foundUser?._id || null;

        } catch (error) {
            if (error instanceof Error) { console.error('Error getting user ID:', error.message);}
            else { console.error('Unexpected error during user ID get:', error);}
            return null;
        }

    };

    async checkUser(userName : string) : Promise<boolean> {
        try {
            return !!(await userModel.exists({username: userName}));

        } catch (error) {
            if (error instanceof Error) { console.error('Error checking user exists:', error.message);}
            else { console.error('Unexpected error during user check:', error);}
            return false;
        }
    };

}

export function makeUserService() : IUserService {
    return new UserService();
}