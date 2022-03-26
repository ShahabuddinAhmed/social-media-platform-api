import { Router } from "express";
import { UserControllerInterface } from "../../controller/user";
import { PostControllerInterface } from "../../controller/post";
import { newUserRouter } from "./user";
import { newPostRouter } from "./post";
import { newHealthRouter } from "./health";


export const newV1Router = async (userController: UserControllerInterface, postController: PostControllerInterface): Promise<Router> => {
    const v1 = Router();
    v1.use("/v1/health", await newHealthRouter());
    v1.use("/v1/user", await newUserRouter(userController));
    v1.use("/v1/post", await newPostRouter(postController));

    v1.use("*", (req, res) => {
        res.status(404).send({
            code: "PAGE_NOT_FOUND",
            message: "please be sane and hit correct endpoints",
            response: null,
            error: null
        });
    });

    return v1;
};
