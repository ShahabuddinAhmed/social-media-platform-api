import { Router, } from "express";
import { UserControllerInterface } from "../../controller/user";


export const newUserRouter = async (userController: UserControllerInterface): Promise<Router> => {
    const router = Router();
    router.post("/signup", userController.signup);
    router.post("/login", userController.login);
    return router;
};