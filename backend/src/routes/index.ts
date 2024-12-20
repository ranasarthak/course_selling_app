import express from "express";
import studentRouter from "./student";
import coursesRouter from "./courses";
import creatorRouter from "./creator";

const router = express.Router();

router.use("/student", studentRouter);
router.use("/creator", creatorRouter);
router.use("/courses", coursesRouter);

export default router;