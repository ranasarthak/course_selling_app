import express from "express";
import studentRouter from "./student";
import coursesRouter from "./courses";
import creatorRouter from "./creator";
import moduleRouter from "./module";
import lessonRouter from "./lessons";

const router = express.Router();

declare global {
    namespace Express {
        export interface Request{
            studentId?: string;
            creatorId?: string;
        }
    }
}

router.use("/student", studentRouter);
router.use("/creator", creatorRouter);
router.use("/courses", coursesRouter);
router.use("/module", moduleRouter);
router.use("/lessons", lessonRouter);

router.post("/logout", (req, res) => {
    res.clearCookie('token');
    res.json({
        message: "Logged out successfully"
    });
});


export default router;