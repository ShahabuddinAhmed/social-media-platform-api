import { Schema, model, Types } from "mongoose";
import { PostInterface, PostModel } from "./post";


export interface UserInterface {
    id?: object | string;
    name: string;
    email: string;
    image: string;
    password: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

const schema = new Schema<UserInterface>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    image: { type: String, required: false, trim: true, default: "" },
    password: { type: String, required: true }
    
}, { timestamps: true, versionKey: false });

export const UserModel = model<UserInterface>("User", schema);