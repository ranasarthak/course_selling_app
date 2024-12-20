import express from "express";
import { SignInSchema, SignUpSchema } from "../zod/validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config";
import studentAuthMiddleware from "../middleware/studentAuth";


const studentRouter = express.Router();
const client = new PrismaClient();

studentRouter.post("/signup", async(req, res) => {
    const parsedData = SignUpSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            message: "Invalid inputs"
        })
        return;
    }

    const subdomain = req.headers.host?.split('.')[0];
    const creator = await client.creator.findUnique({
        where: {
            name: subdomain
        }
    })
    if(!creator) {
        throw new Error();
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    try {
        const student = await client.student.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                name: parsedData.data.name,
                creatorId: creator.id
            }
        })
        const token = jwt.sign({
            student: student.id
        }, JWT_SECRET)
        res.json({
            studentId: student.id,
            token
        })
    } catch (error) {
        res.status(400).json({
            message: "User signup failed"
        })
    }    
})


studentRouter.post("/signin", async(req, res) => {
    const parsedData = SignInSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            message: "Invalid Inputs"
        })
        return;
    }

    const subdomain = req.headers.host?.split('.')[0];
    const creator = await client.creator.findUnique({
        where: {
            name: subdomain
        }
    })
    if(!creator) {
        throw new Error();
    }

    try {
        const  hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
        const student = await client.student.findFirst({
            where:{
                username: parsedData.data.username,
                password: hashedPassword,
                creatorId: creator.id
            }
        })
    
        if(!student) {
            throw new Error();
        }
    
        const token = jwt.sign({
            student: req.studentId
        }, JWT_SECRET)

        if(!token) {
            throw new Error();
        }

        res.json({
            message: "SignIn successful",
            token
        })
    } catch (error) {
        res.status(400).json({
            message: "SignIn failed"
        })
    }
})


studentRouter.use(studentAuthMiddleware);


studentRouter.get("/course/:id", async(req, res) => {
    try {
        const student = await client.student.findUnique({
            where: {
                id: req.studentId
            },
            select: {
                purchasedCourses: true
            }
        })

        if(!student || (student.purchasedCourses.length == 0)) {
            res.status(400).json({
                message: "No matching records found"
            })
            return;
        }
        
        const course = student.purchasedCourses.filter((c) => c.id == req.studentId);

        if(!course) {
            res.status(400).json({
                message: "No matching records found"
            })
            return;
        }

        res.json({
            course: course.map(e => ({
                id: e.id,
                name: e.name,
                creator: e.creatorId,
                price: e.price,
                imageUrl: e.imageUrl
            }))
        })
    } catch (error) {
        res.status(400).json({
            message: "Request failed"
        })
    }
})


studentRouter.get("/purchasedCourses", async(req, res) => {
    try {
        const student = await client.student.findUnique({
            where: {
                id: req.studentId
            },
            select: {
                purchasedCourses: true
            }
        })

        if(!student) {
            res.status(400).json({
                message: "No record found"
            })
            return;
        }

        res.json({
            purchasedCoursed: student.purchasedCourses
        })
    } catch (error) {
        res.status(400).json({
            message: "Request failed"
        })
    }
})

export default studentRouter;