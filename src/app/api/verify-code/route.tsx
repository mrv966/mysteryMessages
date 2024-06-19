import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { verifySchema } from '@/schemas/verifySchema'
import { z } from 'zod';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { username, code} = verifySchema.parse(body)
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Checking if the code is correct and not expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (!isCodeValid) {
      return Response.json(
        { success: false, message: 'Incorrect verification code' },
        { status: 400 }
      );
    } 
    
    if (!isCodeNotExpired) {
      // If the Code has expired
      return Response.json(
        {
          success: false,
          message:
            'Verification code has expired. Please sign up again to get a new code.',
        },
        { status: 400 }
      );
    } 

    // Update the user's verification status
    user.isVerified = true;
    await user.save();

    return Response.json(
      { success: true, message: 'Account verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { success: false, message: error},
        { status: 500 }
      );
    }
    
    return Response.json(
      { success: false, message: 'Error while verifying user' },
      { status: 500 }
    );
  }
}