import express from "express";
import { CreateCourseSchema, SignInSchema, SignUpSchema, UpdateCourseSchema } from "@ranasarthak/course_selling_app-common/dist";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import bcrypt from "bcrypt";
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

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            message: "Signup Successfull",
            creatorId: creator.id,
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Creator signup failed"
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
        const creator = await client.creator.findUnique({
            where:{
                username: parsedData.data.username,
            }
        })
    
        if(!creator) {
            res.status(401).json({
                message: "No match found"
            })
            return;
        }

        const isPasswordValid = await bcrypt.compare(parsedData.data.password, creator.password);

        if (!isPasswordValid) {
            res.status(400).json({
                message: "Invalid password.",
            });
            return;
        }
    
        const token = jwt.sign({
            creator: creator.id,
        }, JWT_SECRET)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        })

        res.json({
            message: "SignIn successful",
            creatorId: creator.id
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
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
                price: parsedData.data.price * 100,
                title: parsedData.data.title,
                description: parsedData.data.description,
                imageUrl: parsedData.data.imageUrl,
                discount: parsedData.data.discount,
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

creatorRouter.patch("/:id", async(req, res) => {
    const parsedData = UpdateCourseSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            message: "Invalid inputs"
        })
        return;
    }
    try {
        const course = await client.course.update({
            where: {
              id: req.params.id,
              creatorId: req.creatorId 
            },
            data: {
                title: parsedData.data.title,
                description: parsedData.data.description,
                price: parsedData.data.price,
                discount: parsedData.data.discount,
                imageUrl: parsedData.data.imageUrl
            }
        })

        if(!course) {
            res.status(400).json({
                message: "No matching record found."
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Course updation failed."
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
            res.status(400).json({
                message: "No matching record found"
            })
            return;
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

creatorRouter.get("/:id", async(req, res) => {
    try {
        const course = await client.course.findUnique({
            where: {
                id: req.params.id
            },include: {
                modules: true
            }
        })

        if(!course) {
            res.status(400).json({
                message: "No matching record found."
            })
            return;
        }

        res.json({
            course
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error."
        })
    }
})

creatorRouter.delete("/:id", async(req, res) => {
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