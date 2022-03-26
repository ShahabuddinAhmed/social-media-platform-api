import { Schema, model, Types } from "mongoose";
import { PostInterface, PostModel } from "./post";


export interface UserInterface {
    id?: object | string;
    name: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

const schema = new Schema<UserInterface>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true }
    
}, { timestamps: true, versionKey: false });

export const UserModel = model<UserInterface>("User", schema);