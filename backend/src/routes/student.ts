import express from "express";
import { SignInSchema, SignUpSchema } from "../zod/validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config";
import authMiddleware from "../middleware/auth";


const studentRouter = express.Router();

studentRouter.use(authMiddleware);
const client = new PrismaClient();


studentRouter.post("/signup", async(req, res) => {
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
                name: parsedData.data.name
            }
        })
        const token = jwt.sign({
            userId: user.id
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


studentRouter.post("/signin", async(req, res) => {
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


studentRouter.get("/course/:id", async(req, res) => {
    try {
        const student = await client.user.findUnique({
            where: {
                id: req.userId
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
        
        const course = student.purchasedCourses.filter((c) => c.id == req.userId);

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

export default studentRouter;