import mongoose, {Schema, Document} from "mongoose";
import { Content } from "next/font/google";


//interface for message
export interface Message extends Document{
    content: string;
    createdAt: Date;
}

//schema for message
const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

//interface for user
export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

//schema for user
const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'please enter the valid email']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    verifyCode: {
        type: String,
        required: [true, 'verify Code is required']
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'verify code expiry is required']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
})


// exporting Model
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);

export default UserModel;