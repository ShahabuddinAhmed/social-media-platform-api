import { PostInterface } from "../model/post";
import { PostRepoInterface } from "../repo/post";

export interface PostServiceInterface {
    create(post: PostInterface): Promise<{ post: PostInterface }>;
    update(postID: string, toUpdate: PostInterface): Promise<{ post: PostInterface | null; errMessage: string }>;
    delete(postID: string): Promise<{ errMessage: string }>;
    get(skip: number, limit: number): Promise<{ post: PostInterface[]; count: number }>;
}

export class PostService implements PostServiceInterface {
    constructor(private postRepo: PostRepoInterface) {
        this.postRepo = postRepo;
    }

    public async create(post: PostInterface): Promise<{ post: PostInterface }> {
        return { post: await this.postRepo.create(post) };
    }

    public async update(postID: string, toUpdate: PostInterface): Promise<{ post: PostInterface | null; errMessage: string }> {
		const updateResult = await this.postRepo.updateByID(postID, toUpdate);
		if (updateResult.modifiedCount === 0) {
			return { post: null, errMessage: "Falied to updated" };
		}
        return { post: { ...toUpdate, id: postID }, errMessage: "" };
    }
	
    public async delete(postID: string): Promise<{ errMessage: string }> {
        const deleteResult = await this.postRepo.deleteByID(postID);
		if (deleteResult.deletedCount === 0) {
			return { errMessage: "Falied to delete" };
		}
        return { errMessage: "" };
    }

    public async get(skip: number, limit: number): Promise<{ post: PostInterface[]; count: number }> {
        return { post: await this.postRepo.get(skip, limit), count: await this.postRepo.count() };
    }
}

export const newPostService = async (postRepo: PostRepoInterface) => {
    return new PostService(postRepo);
};