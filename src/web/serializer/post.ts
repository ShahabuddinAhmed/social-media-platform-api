import { PostInterface } from "../../model/post";

export class PostSerializer {
    public static async serializePost(post: PostInterface) {
        return {
			id: post.id,
            name: post.title,
            description: post.description,
            images: post.images
        };
    }

    public static async serializePosts(posts: PostInterface[]) {
        return Promise.all(
            posts.map(async post => {
                return await PostSerializer.serializePost(post);
            })
        );
    }
}