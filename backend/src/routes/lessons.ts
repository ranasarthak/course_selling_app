import express from 'express';
import creatorAuthMiddleware from '../middleware/creatorAuth';
import { CreateLessonSchema, GetUploadUrlSchema } from '@ranasarthak/course_selling_app-common/dist';
import crypto from 'crypto';
import { prismaClient } from '..';
import { getSignedVideoUrl, uploadToS3 } from '../services/s3';
import { error } from 'console';

const lessonRouter = express.Router();

lessonRouter.use(creatorAuthMiddleware);

lessonRouter.post("/get-upload-url", async(req, res) => {
    const parsedData = GetUploadUrlSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            message: "Invalid inputs"
        });
        return;
    }

    try {
        const module = await prismaClient.module.findUnique({
            where: {
                id: parsedData.data.moduleId
            },include: {
                Course: true
            }
        })

        if(!module) {
            res.status(400).json({
                message: "module not found"
            })
            return;
        }

        if(module.Course.creatorId !== req.creatorId) {
            res.status(403).json({
                message: "Unauthorized"
            });
            return;
        }

        const lessonId = crypto.randomUUID();
        const { uploadUrl, key } = await uploadToS3(
            module.courseId,
            module.id,
            lessonId,
            parsedData.data.fileExtension
        )

        res.json({ uploadUrl, key, lessonId });
    } catch (error) {
        console.error("Failed to get uploadUrl: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


lessonRouter.post("/", async(req, res) => {
    const parsedData = CreateLessonSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            message: "Invalid inputs"
        })
        return;
    }
     
    try {
        const module = await prismaClient.module.findUnique({
            where: {
                id: parsedData.data.moduleId
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

        const maxOrder = await prismaClient.lesson.findFirst({
            where: {
                moduleId: parsedData.data.moduleId
            },
            orderBy: {
                order: 'desc'
            },
            select: {
                order: true
            }
        })

        const nextOrder = maxOrder ? maxOrder.order + 1 : 1;

        const lesson = await prismaClient.lesson.create({
            data: {
                id: parsedData.data.lessonId,
                title: parsedData.data.title,
                moduleId: parsedData.data.moduleId,
                url: parsedData.data.key,
                order: nextOrder
            }
        })

        res.json({
            lesson
        })
    } catch (error) {
        console.error("Lesson creation failed due to: ", error);
        res.status(500).json({ message: "Internal server error." });
    }
})

lessonRouter.get("/:moduleId", async(req,res) => {
    try {
        const module = await prismaClient.module.findUnique({
            where: {
                id: req.params.moduleId
            },
           include: {
            Course: true,
            lessons: true
           }
        })

        if(!module || module.Course.creatorId !== req.creatorId) {
            res.status(403).json({
                message: "Unauthorized"
            });
            return;
        }

        const lessons = module.lessons;
        res.json({
            lessons
        })
    } catch (error) {
       res.status(500).json({
        message: "Internal Server Error"
       }) 
    }
})

lessonRouter.get("/:id/play", async(req, res) => {
    try {
        const lesson = await prismaClient.lesson.findUnique({
            where: {
                id: req.params.id
            }
        })

        if(!lesson) {
            res.status(400).json({
                message: "No match found."
            })
            return;
        }

        const playUrl = await getSignedVideoUrl(lesson.url);
        if(!playUrl) {
            throw new Error();
        }

        res.json({
            playUrl
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error."
        })
    }
})


lessonRouter.delete("/:id", async(req, res) => {
    try {
        const lesson = await prismaClient.lesson.findUnique({
            where: {
                id: req.params.id
            },select: {
                order: true,
                module: {
                    select: {
                        id: true,
                        Course: {
                            select: {
                                creatorId: true
                            }
                        }
                    }
                }
            }
        })

        if(!lesson || lesson.module.Course.creatorId !== req.creatorId) {
            res.status(403).json({
                message: "Unauthorized"
            })
            return;
        }

        await prismaClient.lesson.delete({
            where: {
                id: req.params.id

            }
        })


        await prismaClient.lesson.updateMany({
            where:{
                moduleId: lesson.module.id,
                order: { gt: lesson.order }
            },
            data: {
                order: { decrement: 1 }
            }
        });
        
        res.json({
            message: "Lesson deleted successfully"
        })
    } catch (error) {
        res.status(400).json(
            error
        )
    }
})

export default lessonRouter;
