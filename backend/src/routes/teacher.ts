import express from "express";
import { CreateCourseSchema, SignInSchema, SignUpSchema } from "../zod/validator";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import bcrypt from "bcrypt";
import authMiddleware from "../middleware/auth";
import teacherAuth from "../middleware/teacherAuth";

const teacherRouter = express.Router();
const client = new PrismaClient();

teacherRouter.use(authMiddleware);
teacherRouter.use(teacherAuth);

teacherRouter.post("/signup", async(req, res) => {
    const parsedData = SignUpSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            message: "Invalid inputs"
        })
        return;
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    try {
        const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                name: parsedData.data.name,
                role: "Teacher"
            }
        })
        const token = jwt.sign({
            userId: user.id,
            role: user.role
        }, JWT_SECRET)
        res.json({
            userId: user.id,
            token
        })
    } catch (error) {
        res.status(400).json({
            message: "User signup failed"
        })
    }
})


teacherRouter.post("/signin", async(req, res) => {
    const parsedData = SignInSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            message: "Invalid Inputs"
        })
        return;
    }

    try {
        const  hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
        const user = await client.user.findUnique({
            where:{
                username: parsedData.data.username,
                password: hashedPassword
            }
        })
    
        if(!user) {
            throw new Error();
        }
    
        const token = jwt.sign({
            userId: req.userId,
            role: req.role
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


teacherRouter.post("/course", async(req, res) => {
    const parsedData = CreateCourseSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            message: "Invalid Inputs"
        })
        return;
    }

    try {
        const course = await client.course.create({
            data: {
                price: parsedData.data.price,
                name: parsedData.data.name,
                imageUrl: parsedData.data.imageUrl,
                creatorId: req.userId as string
            }
        })

        if(!course) {
            throw new Error();
        }

        res.json({
            courseId: course.id
        })
    } catch (error) {
        res.status(400).json({
            message: "Course creation failed"
        })
    }
   
})


teacherRouter.get("/courses", async(req, res) => {
    try {
        const user = await client.user.findUnique({
            where: {
                id: req.userId
            },
            select: {
                createdCourses: true
            }
        })

        if(!user) {
            throw new Error();
        }

        res.json({
            courses: user.createdCourses
        })

    } catch (error) {
        res.status(400).json({
            message: "Failed to fetch the courses"
        })
    }
})


teacherRouter.delete("/course/:id", async(req, res) => {
    try {
        const courseDeleted = await client.course.delete({
            where: {
                id: req.params.id,
                creatorId: req.userId
            }
        })

        if(!courseDeleted) {
            res.status(400).json({
                message: "No match found"
            })
            return;
        }
        
        res.json({
            message: "Course deleted"
        })
    } catch (error) {
        res.status(400).json({
            message: "Course deletion failed"
        })
    }
})

export default teacherRouter;