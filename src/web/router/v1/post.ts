import { Router, } from "express";
import { PostControllerInterface } from "../../controller/post";


export const newPostRouter = async (postController: PostControllerInterface): Promise<Router> => {
    const router = Router();
    router.post("/create", postController.create);
    router.patch("/update", postController.update);
    router.delete("/delete", postController.delete);
    router.get("/list", postController.get);
    return router;
};