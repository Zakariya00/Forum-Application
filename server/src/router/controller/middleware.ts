import { Request, Response, NextFunction } from 'express';
import {UserInterface} from "../../model/user.interface";


/* Middle ware handlers */

// Checks if user is logged in, if not logged in user gets an error code
export const checkUserLoggedIn = (
    req: Request<{}, {}, {}> & { session: { user?: UserInterface } },
    res: Response,
    next: NextFunction
) => {
    if (req.session.user) {
        // User is logged in
        next();
    } else {
        res.status(401).send("Not logged in");
    }
};


