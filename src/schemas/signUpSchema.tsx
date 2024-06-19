import {z} from 'zod';


export const usernameValidation = z
       .string()
       .min(2,'Username length should be greater than 2')
       .max(20,'Username length should be less than 20')
       .regex(/^[a-zA-Z0-9_]+$/,'Username must not contain special character')

const emailValidation = z
       .string()
       .email({message: 'Invaild Email'})       

const passwordValidation = z
        .string()
        .min(6,'password > 6')
        .max(30,'password<30')   

export const signUpSchema =z.object({
    username: usernameValidation,
    email: emailValidation,
    password: passwordValidation
})       