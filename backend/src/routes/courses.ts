import express from "express";
import studentAuthMiddleware from "../middleware/studentAuth";
import Razorpay from "razorpay";
import crypto from 'crypto';
import { prismaClient } from "..";

const coursesRouter = express.Router();
const razorpay = new Razorpay({
    key_id: "rzp_test_hZlsBrrU5YCptn",
    key_secret: "TGJpM2h6lptp4b9YWuoe8Dlq"
})

coursesRouter.post("/verify", async (req, res) => {
    try {
        const order_id = req.body.payload.payment.entity.order_id;

        const secret = "r23MHtQGef7DP@d"
        const shasum  = crypto.createHmac("sha256", secret)
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        if(digest !== req.headers["x-razorpay-signature"]) {
            res.status(400).json({
                message: "Invalid Signature"
            });
            return;
        }
        
        const updateStatus = await prismaClient.purchases.updateMany({
            where: {
                razorpayOrderId: order_id
            },data: {
                status: "COMPLETED"
            }
        })

        if(!updateStatus) {
            res.status(400).json({
                message: "No matching record found"
            })
            return;
        }
        res.json({
            message: "Payment verified"
        }) 
    } catch (error) {
        console.error("Payment verification failed: ", error);
        res.status(500).json({
            status: "error",
            message: "Failed to verify"
        })
    }
   
})

coursesRouter.use(studentAuthMiddleware);


coursesRouter.post("/purchase", async(req, res) => {
    try {
        const course = await prismaClient.course.findUnique({
            where: {
                id: req.body.courseId
            },
            select: {
                imageUrl: true,
                title:true,
                price: true,
                discount: true,
            }
        })

        if(!course) {
            res.status(400).json({
                message: "Course not found"
            })
            return;
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(course.price * ((100 - course.discount)/100)),
            currency: "INR",
            receipt: `${req.body.courseId}_${Date.now()}`
        })
        console.log("order created");
        const purchase = await prismaClient.purchases.create({
            data: {
                buyerId: "cm5d2i2880001y7vds19h05h9",
                //  req.studentId as string,
                courseId: req.body.courseId,
                amount: course.price * ((100 - course.discount)/100),
                razorpayOrderId: razorpayOrder.id
            }
        })

        res.json({
            image: course.imageUrl,
            name: course.title,
            orderId: razorpayOrder.id,
            amount: course.price
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Purchase failed"
        })
    }
})


coursesRouter.get("/", async(req, res) => {
    try {
        const student = await prismaClient.student.findUnique({
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

        const creator = await prismaClient.creator.findUnique({
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
