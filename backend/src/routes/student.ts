import express, { response } from "express";
import { SignInSchema, SignUpSchema } from "@ranasarthak/course_selling_app-common/dist";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

    // const subdomain = req.headers.host?.split('.')[0];
    // const subdomain = "harkirat";
    try {
        // const creator = await client.creator.findUnique({
        //     where: {
        //         name: subdomain
        //     }
        // })
        // if(!creator) {
        //     res.status(400).json({
        //         message: "Creator not found"
        //     });
        //     return;
        // }
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
        const creatorId = "cm5cv5vd60000y7ag8fl37nqq";

        const student = await client.student.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                name: parsedData.data.name,
                creatorId: creatorId
            }
        });

        const token = jwt.sign({
            student: student.id
        }, JWT_SECRET)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        })

        res.json({
            message: "Signup successful",
            studentId: student.id,
        })
    } catch (error) {
        console.error(error);
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

    // const subdomain = req.headers.host?.split('.')[0];
    // const creator = await client.creator.findUnique({
    //     where: {
    //         name: subdomain
    //     }
    // })
    // if(!creator) {
    //     throw new Error();
    // }
    const creatorId = "cm5cv5vd60000y7ag8fl37nqq";

    try {
        const student = await client.student.findFirst({
            where:{
                username: parsedData.data.username,
                creatorId: creatorId
            }
        })
    
        if(!student) {
            response.status(401).json({
                message: "No record found."
            })
            return;
        }
    
        const isPasswordValid = await bcrypt.compare(parsedData.data.password, student.password);
        if (!isPasswordValid) {
            res.status(401).json({
                message: "Invalid password.",
            });
            return;
        }

        const token = jwt.sign({
            student: student.id
        }, JWT_SECRET)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        if(!token) {
            response.status(400).json({
                message: "Token not generated"
            })
            return;
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
});

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
                name: e.title,
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