import { NextFunction, Request, Response } from "express";

export default function teacherAuth (req: Request, res: Response, next: NextFunction) {
    if(req.role != "Teacher") {
        res.status(403).json({
            message: "Unauthorised"
        })
        return;
    }
    next();
}