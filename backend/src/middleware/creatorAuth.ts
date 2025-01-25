import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"; 
import { JWT_SECRET } from "../config";

export default function creatorAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if(!token) {
        res.status(401).json({
            message: "Unauthorised"
        })
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {creator: string};
        req.creatorId = decoded.creator;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorised"
        })
    }
}
