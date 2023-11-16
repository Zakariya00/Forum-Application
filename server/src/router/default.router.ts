import express, { Request, Response } from "express";
import {checkUserLoggedIn} from "./controller/middleware";

export const defaultRouter = express.Router()

/* Default Router that catches everything else */
defaultRouter.all("*", checkUserLoggedIn, async (
        req: Request,
        res: Response
) => {
    try {
        res.status(404).send("Wrong Page!!")
    } catch (e : any) {
        console.log(e);
        res.status(500).send(e.message);
    }
});