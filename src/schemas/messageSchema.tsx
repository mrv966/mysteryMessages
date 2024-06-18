import {z} from 'zod';

export const verifySchema = z.object({
    content: z.string().min(10,'content > 10')
          .max(300,"content<300")
})