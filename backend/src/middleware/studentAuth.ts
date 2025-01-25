import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"; 
import { JWT_SECRET } from "../config";

export default function studentAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if(!token) {             
        res.status(401).json({
            message: "Unauthorized"
        })
        return;
    }
    try {   
        const decoded = jwt.verify(token, JWT_SECRET) as {student: string};
        req.studentId = decoded.student;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid token"        
        })
    }
}
