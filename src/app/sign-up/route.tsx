import bcrypt from 'bcryptjs';
import UserModel from '@/model/User';
import { dbConnect } from '@/lib/dbConnect';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request){
    await dbConnect();

    try {
      const {username, email, passsword}=  await request.json();

      const existingUseerVerificationByUsername= await UserModel.findOne({
        username,
        isVerified: true
      })

      if(existingUseerVerificationByUsername){
        return Response.json(
            {
                success: false,
                message: 'username is already taken'
            },
            {
                status:400
            }
        )
      }

      const existingUserByEmail= await UserModel.findOne(
        {
            email
        }
      )

      const verifyCode = Math.floor(10000+Math.random()*9000000).toString();

      if(existingUserByEmail){
        //todo
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success:false,
                        message: 'User already exist with this email'
                    },
                    {
                        status: 400
                    }
                )
            }else{
                    const hashedPassword= await bcrypt.hash(passsword,10);
                    existingUserByEmail.password = hashedPassword;
                    existingUserByEmail.verifyCode=verifyCode;
                    existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                    await existingUserByEmail.save()
            }

      }else{
        //create that user and store in db

        const hashedPassword= await bcrypt.hash(passsword,10);

        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours()+1);

        const newUser= new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessage: true,
            messages: []
        })

        await newUser.save();
      }

      //send verification email
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      )

      if(!emailResponse.success){
        return Response.json(
            {
                success: false,
                message: emailResponse.message
            },
            {
                status:500
            }
        )
      }

      return Response.json(
        {
            success: true,
            message: 'User register successfully, Please verify your email'
        },
        {
            status:201
        }
    )

    } catch (error) {
        console.error("Error while registering User", error);

        return Response.json(
            {
                success: false,
                message:'Error registering user'
            },
            {
                status: 500
            }
        )
    }

}