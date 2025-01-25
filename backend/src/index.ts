import express from "express";
import router from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser"
import session from "express-session"
import { JWT_SECRET } from "./config";
import { PrismaClient } from "@prisma/client";

const app = express();
export const prismaClient = new PrismaClient();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}))

app.use("/api/v1", router);

app.listen(process.env.PORT, () => {
    console.log("server running at: " , process.env.PORT)
});


                                                                                                         