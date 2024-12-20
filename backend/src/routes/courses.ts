import express from "express";
import { PrismaClient } from "@prisma/client";
import studentAuthMiddleware from "../middleware/studentAuth";

const coursesRouter = express.Router();
coursesRouter.use(studentAuthMiddleware);
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
                buyerId: req.studentId as string,
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


coursesRouter.get("/", async(req, res) => {
    try {
        const student = await client.student.findUnique({
            where: {
                id: req.studentId
            },
            select: {
                creatorId: true
            }
        })

        if(!student) {
            throw new Error();
        }

        const creator = await client.creator.findUnique({
            where: {
                id: student.creatorId
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

export default coursesRouter;
