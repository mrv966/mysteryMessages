import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystry Message | Verification Code',
            react: VerificationEmail({username,otp: verifyCode}),
          });

          return {success: true, message:'Verification email send successfully'}
      
          }
     catch (error) {
           console.error('Error sending verification email')
           return {success: false, message: 'Failed to send verification email'}   
    }
}