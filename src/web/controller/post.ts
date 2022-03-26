import { Request, Response } from "express";
import { PostServiceInterface } from "../../service/post";
import { PostInterface } from "../../model/post";
import { PostSerializer } from "../serializer/post";
import { Controller } from "./controller";
import { object, array, string, number } from "joi";
import { LoggerInterface } from "../../infra/logger";
import { skipLimitParser } from "./helper/helper";

export interface PostControllerInterface {
    create(req: Request, res: Response): any;
    update(req: Request, res: Response): any;
    delete(req: Request, res: Response): any;
    get(req: Request, res: Response): any;
}

export class PostController extends Controller implements PostControllerInterface {
    postService: PostServiceInterface;
    logger: LoggerInterface;
    constructor(postService: PostServiceInterface, logger: LoggerInterface) {
        super();
        this.postService = postService;
        this.logger = logger;
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.get = this.get.bind(this);
	}

    public async create(req: Request, res: Response) {
        const schema = object().keys({
            title: string().required(),
            description: string().required(),
            images: array().items(string().uri()).required()
        });

		const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return await this.sendResponse(400, "E_INVALID_DATA", "Please fill up all the required fields.",
                null, error.details, res
            );
        }

        try {
			const user = res.locals.user.userID;
            const { post } = await this.postService.create({ ...req.body, user } as PostInterface);

            const response = await PostSerializer.serializePost(post);
            return await this.sendResponse(200, "SUCCESS", "Post Successfully created.",
                response, [], res
            );

        } catch (err) {
            this.logger.info("Internal Server Error", "post.handler.create", { err });
            return await this.sendResponse(500, "E_INTERNAL_SERVER_ERROR", "Internal Server Error",
                null, [], res
            );
        }
    }

    public async update(req: Request, res: Response) {
        const schema = object().keys({
			id: string().length(24).required(),
            title: string().required(),
            description: string().required(),
            images: array().items(string().uri()).required()
        });

		const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return await this.sendResponse(400, "E_INVALID_DATA", "Please fill up all the required fields.",
                null, error.details, res
            );
        }

        try {
			const { id, ...toUpdate } = req.body;
            const { post, errMessage } = await this.postService.update(id, toUpdate);
            if (errMessage) {
                return await this.sendResponse(400, "E_FAILED_UPDATE_POST", errMessage, null, [], res);
            }

            const response = await PostSerializer.serializePost(post as PostInterface);
            return await this.sendResponse(200, "SUCCESS", "Post updated Successfully",
                response, [], res
            );

        } catch (err) {
            this.logger.info("Internal Server Error", "post.handler.update", { err });
            return await this.sendResponse(500, "E_INTERNAL_SERVER_ERROR", "Internal Server Error",
                null, [], res
            );
        }
    }

    public async delete(req: Request, res: Response) {
        const schema = object().keys({
			id: string().length(24).required()
        });

		const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return await this.sendResponse(400, "E_INVALID_DATA", "Please fill up all the required fields.",
                null, error.details, res
            );
        }

        try {
            const { errMessage } = await this.postService.delete(req.body.id);
            if (errMessage) {
                return await this.sendResponse(400, "E_FAILED_DELETE_POST", errMessage, null, [], res);
            }

            return await this.sendResponse(200, "SUCCESS", "Post deleted Successfully",
                null, [], res
            );

        } catch (err) {
            this.logger.info("Internal Server Error", "post.handler.delete", { err });
            return await this.sendResponse(500, "E_INTERNAL_SERVER_ERROR", "Internal Server Error",
                null, [], res
            );
        }
    }

    public async get(req: Request, res: Response) {
        const schema = object().keys({
			skip: number().integer().optional(),
            limit: number().integer().optional()
        });

		const { error, value: typeCastedValue } = schema.validate(req.query, { abortEarly: false });
        if (error) {
            return await this.sendResponse(400, "E_INVALID_DATA", "Please fill up all the required fields.",
                null, error.details, res
            );
        }

		const { skip, limit } = typeCastedValue;
        try {
			const { skip: newSkip, limit: newLimit } = await skipLimitParser(skip, limit);
            const { post, count } = await this.postService.get(newSkip, newLimit);

			const response = await PostSerializer.serializePosts(post);
            return await this.sendResponse(200, "SUCCESS", "Post deleted Successfully",
			response, [], res, { skip: newSkip, limit: newLimit, count }
            );

        } catch (err) {
            this.logger.info("Internal Server Error", "post.handler.get", { err });
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

export const newPostController = async (postService: PostServiceInterface, logger: LoggerInterface):
    Promise<PostController> => {
    return new PostController(postService, logger);
};