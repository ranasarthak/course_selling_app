import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"; 
import { JWT_SECRET } from "../config";

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token) {             
            throw new Error();
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {userId: string, role: string};
        if(decoded.role != "Teacher" || "Student"){
            throw new Error();
        }

        req.userId = decoded.userId;
        req.role = decoded.role;

        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorised"
        })
    }
}
