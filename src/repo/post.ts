import { Model } from "mongoose";
// import { UpdateResult, DeleteResult } from "mongodb";
import { PostInterface } from "../model/post";

export interface PostRepoInterface {
    create(post: PostInterface): Promise<PostInterface>;
    getByUserID(userID: string): Promise<PostInterface | null>;
    get(skip: number, limit: number): Promise<PostInterface[]>;
    count(): Promise<number>;
    updateByID(postID: string, toUpdate: PostInterface): Promise<any>;
    deleteByID(postID: string): Promise<any>;
}

export class PostRepo implements PostRepoInterface {
    constructor(private postModel: Model<PostInterface, {}, {}, {}>) {
        this.postModel = postModel;
    }

    public async create(post: PostInterface): Promise<PostInterface> {
        return this.postModel.create(post);
    }

    public async getByUserID(userID: string): Promise<PostInterface | null> {
        return this.postModel.findOne({ user: userID });
    }

    public async get(skip: number, limit: number): Promise<PostInterface[]> {
        return this.postModel.find({ skip, limit });
    }

    public async count(): Promise<number> {
        return this.postModel.count();
    }

    public async updateByID(postID: string, toUpdate: PostInterface) {
        return this.postModel.updateOne({ _id: postID }, toUpdate);
    }

    public async deleteByID(postID: string) {
        return this.postModel.deleteOne({ _id: postID });
    }
}

export const newPostRepo = async (postModel: Model<PostInterface, {}, {}, {}>): Promise<PostRepoInterface> => {
    return new PostRepo(postModel);
};

export default PostRepo;