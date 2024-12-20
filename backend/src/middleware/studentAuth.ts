import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"; 
import { JWT_SECRET } from "../config";

export default function studentAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token) {             
            throw new Error();
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {student: string};

        if(!decoded) {
            throw new Error();
        }

        req.studentId = decoded.student;
        
        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorised"
        })
    }
}
