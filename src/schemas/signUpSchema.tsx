import {z} from 'zod';


export const usernmaeValidation = z
       .string()
       .min(2,'kjdf')
       .max(20,'dfdr')
       .regex(/^[a-zA-Z0-9_]+$/,'Username must not contain special character')

const emailValidation = z
       .string()
       .email({message: 'Invaild Email'})       

const passwordValidation = z
        .string()
        .min(6,'password > 6')
        .max(30,'password<30')   

export const signUpSchema =z.object({
    username: usernmaeValidation,
    email: emailValidation,
    password: passwordValidation
})       