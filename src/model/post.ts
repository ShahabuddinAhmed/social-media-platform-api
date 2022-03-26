import { Schema, model, Types } from "mongoose";
import { UserInterface, UserModel } from "./user";


export interface PostInterface {
    id?: object | string;
    title: string;
    description: string;
    image: string[];
    user: object | string | UserInterface;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

const schema = new Schema<PostInterface>({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: [{ type: String, required: true, trim: true }],
	user: { type: Types.ObjectId, ref: UserModel, required: false }
    
}, { timestamps: true, versionKey: false });

export const PostModel = model<PostInterface>("Post", schema);