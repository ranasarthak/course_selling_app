import express from "express";
import { CreateCourseSchema, SignInSchema, SignUpSchema } from "../zod/validator";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import bcrypt from "bcrypt";
import authMiddleware from "../middleware/studentAuth";
import creatorAuthMiddleware from "../middleware/creatorAuth";

const creatorRouter = express.Router();
const client = new PrismaClient();

creatorRouter.post("/signup", async(req, res) => {
    const parsedData = SignUpSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            message: "Invalid inputs"
        })
        return;
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    try {
        const creator = await client.creator.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                name: parsedData.data.name
            }
        })
        const token = jwt.sign({
            creator: creator.id
        }, JWT_SECRET)
        res.json({
            creatorId: creator.id,
            token
        })
    } catch (error) {
        res.status(400).json({
            message: "creator signup failed"
        })
    }
})


creatorRouter.post("/signin", async(req, res) => {
    const parsedData = SignInSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            message: "Invalid Inputs"
        })
        return;
    }

    try {
        const  hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
        const creator = await client.creator.findUnique({
            where:{
                username: parsedData.data.username,
                password: hashedPassword
            }
        })
    
        if(!creator) {
            throw new Error();
        }
    
        const token = jwt.sign({
            creator: req.creatorId,
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

creatorRouter.use(creatorAuthMiddleware);

creatorRouter.post("/course", async(req, res) => {
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
                creatorId: req.creatorId as string
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


creatorRouter.get("/courses", async(req, res) => {
    try {
        const creator = await client.creator.findUnique({
            where: {
                id: req.creatorId
            },
            select: {
                createdCourses: true
            }
        })

        if(!creator) {
            throw new Error();
        }

        res.json({
            courses: creator.createdCourses
        })

    } catch (error) {
        res.status(400).json({
            message: "Failed to fetch the courses"
        })
    }
})


creatorRouter.delete("/course/:id", async(req, res) => {
    try {
        const courseDeleted = await client.course.delete({
            where: {
                id: req.params.id,
                creatorId: req.creatorId
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

export default creatorRouter;