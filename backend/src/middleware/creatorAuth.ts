import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"; 
import { JWT_SECRET } from "../config";

export default function creatorAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token) {             
            throw new Error();
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {creator: string};

        if(!decoded) {
            throw new Error();
        }

        req.creatorId = decoded.creator;
        
        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorised"
        })
    }
}
