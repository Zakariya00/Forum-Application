import { Request, Response } from "express";
import {makeUserService} from "../../db/service/user.service";
import {UserInterface} from "../../model/user.interface";
import {LoginInterface} from "./interface.types";

const userService = makeUserService();

export const register = async (
    req: Request<{}, {}, UserInterface>,
    res: Response<string>
) => {

    try {

        // Check request parameters for null
        if (req.body.username == null || req.body.password == null || req.body.email == null) {
            res.status(400).send("Missing username, password or email!");
            return;
        }

        // Check request parameters for valid types
        for (const value of Object.values(req.body)) {
            if (typeof value !== 'string') {
                res.status(400).send(`Bad POST call to ${req.originalUrl} --- ${typeof value} is not a string`);
                return;
            }
        }

        const notTaken : UserInterface | null = await userService.registerUser(
            req.body.username,
            req.body.password,
            req.body.email
        );

        // Check username is not taken
        if (!notTaken) {
            res.status(409).send("Username/ID is already Taken!");
            return;
        }

        res.status(201).send("User has been registered");

    } catch (e) {

        if (e instanceof Error) { res.status(500).send(e.message); console.error(e);}
        else { res.status(500).send("Unexpected error during call to register");}
    }

};

export const login = async (
    req: Request<{}, {}, LoginInterface> &
        {session: {user?: UserInterface }},
    res: Response<string>
) => {

    try {

        // Check request parameters for null
        if (req.body.username == null || req.body.password == null) {
            res.status(400).send("Missing username or password!");
            return;
        }

        // Check request parameters for valid types
        for (const value of Object.values(req.body)) {
            if (typeof value !== 'string') {
                res.status(400).send(`Bad POST call to ${req.originalUrl} --- ${typeof value} is not a string`);
                return;
            }
        }

        // Check user really exists
        const found: UserInterface | null = await userService.loginUser(req.body.username,req.body.password );
        if (!found) {
            res.status(401).send("Incorrect Username or Password!");
            return;
        }

        // Set the user in the session
        req.session.user = found;
        res.status(200).send("Logged in");
        console.log(`${found.username} logged in`);
        // @ts-ignore
        console.log(req.session.user._id);

    } catch (e) {
        if (e instanceof Error) { res.status(500).send(e.message); console.error(e);}
        else { res.status(500).send("Unexpected error during call to login");}

    }
};

export const logout = async (
    req: Request &
        {session: {user?: UserInterface}},
    res: Response<string>
) => {

    try {
        if (req.session.user) {
            console.log(`${req.session.user.username} logged out`);
            req.session.user = undefined; // Remove user from session
            res.status(200).send("Logged out");
        } else {
            res.status(401).send("Not logged in");
        }

    } catch (e) {
        if (e instanceof Error) { res.status(500).send(e.message); console.error(e);}
        else { res.status(500).send("Unexpected error during call to logout");}
    }
};