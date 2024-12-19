import express from "express";
import authMiddleware from "../middleware/auth";
import { PrismaClient } from "@prisma/client";

export const coursesRouter = express.Router();
coursesRouter.use(authMiddleware);
const client = new PrismaClient();


coursesRouter.post("/purchase", async(req, res) => {
    try {
        const course = await client.course.findUnique({
            where: {
                id: req.body.courseId
            },
            select: {
                price: true
            }
        })

        if(!course) {
            res.status(400).json({
                message: "Course not found"
            })
            return;
        }
        
        const purchase = await client.purchases.create({
            data: {
                buyerId: req.userId as string,
                courseId: req.body.courseId,
                amount: course.price
            }
        })
    } catch (error) {
        res.status(400).json({
            message: "Purchase failed"
        })
    }
})


coursesRouter.get("/all", async(req, res) => {
    try {
        const user = await client.user.findUnique({
            where: {
                id: req.userId
            },
            select: {
                purchasedCourses: true
            }
        })

        if(!user) {
            throw new Error();
        }

        res.json({
            courses: user.purchasedCourses
        })

    } catch (error) {
        res.status(400).json({
            message: "Failed to fetch the courses"
        })
    }
})
