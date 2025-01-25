import express from "express";
import creatorAuthMiddleware from "../middleware/creatorAuth";
import { CreateModuleSchema } from "@ranasarthak/course_selling_app-common/dist";
import { prismaClient } from "..";

const moduleRouter = express.Router();
moduleRouter.use(creatorAuthMiddleware);

moduleRouter.post("/", async(req, res) => {
    const parsedData = CreateModuleSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            message: "Invalid inputs"
        })
        return;
    }

    try {
        const maxOrder = await prismaClient.module.findFirst({
            where: {
                courseId: parsedData.data.courseId
            },
            orderBy:{
                order: 'desc'
            },
            select: {
                order: true
            }
        });

        const nextOrder = maxOrder ? maxOrder.order + 1 : 1;

        const module = await prismaClient.module.create({
            data: {
                title: parsedData.data.title,
                order: nextOrder,
                courseId: parsedData.data.courseId
            }
        })

        res.json({
            module
        })
    } catch (error) {
        console.error("Internal server error.", error);
    }
})

moduleRouter.get("/", async(req, res) => {
    try {
        const course = await prismaClient.course.findUnique({
            where: {
                id: req.body.id
            },
            select: {
                modules: true
            }
        })

        res.json({
            course
        })
    } catch (error) {
        console.error("Internal sever error.", error);
    }
})

moduleRouter.delete("/:id", async(req, res) => {
    try {
        const module = await prismaClient.module.findUnique({
            where: {
                id: req.params.id
            },include: {
                Course: true
            }
        })

        if(!module || module.Course.creatorId !== req.creatorId) {
            res.status(403).json({
                message: "Unauthorized"
            })
            return;
        }

        await prismaClient.module.delete({
            where: {
                id: req.params.id

            }
        })

        await prismaClient.module.updateMany({
            where:{
                courseId: module.courseId,
                order: { gt: module.order }
            },
            data: {
                order: { decrement: 1 }
            }
        });
        
        res.json({
            message: "Module deleted successfully"
        })
    } catch (error) {
        res.status(400).json(
            error
        )
    }
})


export default moduleRouter;