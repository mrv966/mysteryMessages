import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { error } from "console";

export async function POST(request: Request){
    await dbConnect;

    const session= await getServerSession(authOptions);
    const user: User= session?.user as User

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {status: 401}
        )
    }

    const userId= user._id;
    const {acceptMessages}= await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage:acceptMessages},
            {new: true}
        )

        if(!updatedUser){
            console.error('User not found while updateing user status to accept messages',error);
            return Response.json(
                {
                    success: false,
                    message: "User not found while updateing user status to accept messages"
                },
                {status: 401}
            )
        }
        
        console.error('message acceptance by user updated successfully');
        return Response.json(
            {
                success: true,
                message: "message acceptance by user updated successfully",
                updatedUser
            },
            {status: 201}
        )

    } catch (error) {
        console.error('Failed to update user status to accept messages');
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages"
            },
            {status: 500}
        )
    }


}

export async function GET(request: Request) {
    await dbConnect();

  // Get the user session
  const session = await getServerSession(authOptions);
  const user = session?.user;
  // console.log(session)
  // console.log(user)

  // Check if the user is authenticated
  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Retrieve the user from the database using the ID
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      // User not found
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return the user's message acceptance status
    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error retrieving message acceptance status' },
      { status: 500 }
    );
  }
    
}