import z from "zod";

declare global {
    namespace Express {
        export interface Request{
            role?: "Teacher" | "Student";
            userId?: string;
        }
    }
}


export const SignUpSchema = z.object({
    username: z.string(),
    password: z.string(),
    name: z.string()
})

export const SignInSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const CreateCourseSchema = z.object({
    name: z.string(),
    price: z.number(),
    imageUrl: z.string()  
})

