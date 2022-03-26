import { Request, Response } from "express";
import { UserServiceInterface } from "../../service/user";
import { UserInterface } from "../../model/user";
import { UserSerializer } from "../serializer/user";
import { Controller } from "./controller";
import { object, string } from "joi";
import { LoggerInterface } from "../../infra/logger";

export interface UserControllerInterface {
    signup(req: Request, res: Response): any;
    login(req: Request, res: Response): any;
}

export class UserController extends Controller implements UserControllerInterface {
    userService: UserServiceInterface;
    logger: LoggerInterface;
    constructor(userService: UserServiceInterface, logger: LoggerInterface) {
        super();
        this.userService = userService;
        this.logger = logger;
        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
	}

    public async signup(req: Request, res: Response) {
        const schema = object().keys({
            name: string().regex(/^[A-Za-z ]+$/).required(),
            email: string().email().required(),
            password: string().min(8).required() // image should be added on user update
        });

		const { error, value: castedUser } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return await this.sendResponse(400, "E_INVALID_DATA", "Please fill up all the required fields.",
                null, error.details, res
            );
        }

        try {
            const { user, errMessage } = await this.userService.signup(castedUser as UserInterface);
            if (errMessage) {
                return await this.sendResponse(400, "E_EXIST_USER", errMessage, null, [], res);
            }

            const response = await UserSerializer.serializeUser(user as UserInterface);
            return await this.sendResponse(200, "SUCCESS", "User Successfully created.",
                response, [], res
            );

        } catch (err) {
            this.logger.info("Internal Server Error", "user.handler.create", { err });
            return await this.sendResponse(500, "E_INTERNAL_SERVER_ERROR", "Internal Server Error",
                null, [], res
            );
        }
    }

    public async login(req: Request, res: Response) {
        const schema = object().keys({
            email: string().email().required(),
            password: string().min(8).required()
        });

		const { error, value: castedData } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return await this.sendResponse(400, "E_INVALID_DATA", "Please fill up all the required fields.",
                null, error.details, res
            );
        }

        try {
			const { email, password } = castedData;
            const { user, toekn, errMessage } = await this.userService.login(email, password);
            if (errMessage) {
                return await this.sendResponse(400, "E_EXIST_USER", errMessage, null, [], res);
            }

            const response = await UserSerializer.serializeUser(user as UserInterface);
            return await this.sendResponse(200, "SUCCESS", "User login Successfully",
                response, [], res, { toekn }
            );

        } catch (err) {
            this.logger.info("Internal Server Error", "user.handler.create", { err });
            return await this.sendResponse(500, "E_INTERNAL_SERVER_ERROR", "Internal Server Error",
                null, [], res
            );
        }
    }

    public async sendResponse(statusCode: number, code: string, message: string,
        data: any, errors: any[], res: Response, optional?: object): Promise<any> {
        return res.status(statusCode).send({ code, message, data, errors, ...optional });
    }
}

export const newUserController = async (userService: UserServiceInterface, logger: LoggerInterface):
    Promise<UserController> => {
    return new UserController(userService, logger);
};