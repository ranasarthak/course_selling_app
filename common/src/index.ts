import exp from "constants";
import z from "zod";

export const SignUpSchema = z.object({
    username: z.string().min(5, "Username must be at least 5 characters"),
    password: z.string().min(4),
    name: z.string().min(2)
})

export const SignInSchema = z.object({
    username: z.string().min(5, "Username must be at least 5 characters"),
    password: z.string().min(4)
})

export const CreateCourseSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(5),
    price: z.number().int().min(100),
    imageUrl: z.string().url(),
    discount: z.number().int().min(1)
})

export const UpdateCourseSchema = z.object({
    title: z.string().min(3).optional(), 
    description: z.string().min(5).optional(),    
    price: z.number().min(100).optional(),
    imageUrl: z.string().url().optional(),
    discount: z.number().int().min(1).optional()  
})

export const CreateModuleSchema = z.object({
    title: z.string().min(3),
    courseId: z.string().min(25)
})

export const AddVideoSchema = z.object({
    title: z.string().min(3),
    videoUrl: z.string().url()
})

export const GetUploadUrlSchema = z.object({
    moduleId: z.string().nonempty(),
    title: z.string().min(3),
    fileExtension: z.string().nonempty()
})

export const CreateLessonSchema = z.object({
    moduleId: z.string().nonempty(),
    title: z.string().min(3),
    key: z.string().min(3),
    lessonId: z.string().nonempty()
})


export type SignupInput = z.infer<typeof SignUpSchema>
export type SigninInput = z.infer<typeof SignInSchema>
export type CreateCourseInput = z.infer<typeof CreateCourseSchema>
export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>
export type CreateModuleInput = z.infer<typeof CreateModuleSchema>
export type AddVideoInput = z.infer<typeof AddVideoSchema>
export type GetUploadUrlInput = z.infer<typeof GetUploadUrlSchema>
export type CreateLessonInput = z.infer<typeof CreateLessonSchema>




