import { z } from "zod";
export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(20, "Username must not exceed 20 charcters")
    .regex( ^[A-Za-z0-9_]+$ , "Username must not contain special charcters")


export const signUpSchema = z.object({
    username: usernameValidation,
    email : z.string().email({message: 'Invalid email address'}),
    password : z.string().min(4, {message: "Password must be minimum 4 charcters"})

})