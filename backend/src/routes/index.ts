import express from "express";
import studentRouter from "./student";
import teacherRouter from "./teacher";
import { coursesRouter } from "./courses";

const router = express.Router();

router.use("/student", studentRouter);
router.use("/teacher", teacherRouter);
router.use("/courses", coursesRouter);

export default router;