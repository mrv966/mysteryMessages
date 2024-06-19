import {z} from 'zod';

export const verifySchema = z.object({
    username: z.string(),
    code: z.string().length(6,'verification code must be 6 digit')
})

export type CreateVerifySchemaPayload = z.infer<typeof verifySchema>