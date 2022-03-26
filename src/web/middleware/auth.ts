import { verify } from "jsonwebtoken";
import config from "../../config/config";
import { NextFunction, Request, Response } from "express";


export const authenticated = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authorizationHeader = req.headers.authorization;
	if (!authorizationHeader) {
		return res.status(401).send({
			code: "UNAUTHORIZED",
			message: "Please provide a token",
			data: null,
			errors: []
		});
	}

    const token = authorizationHeader.split(" ")[1]; // Bearer <token>
    try {
        const jwtPayload = verify(token, config.JWT_SECRET);
        res.locals.user = jwtPayload;
        next();
    } catch (err) {
        return res.status(401).send({
			code: "UNAUTHORIZED",
			message: "Please provide a valid token",
			data: null,
			errors: []
		});
    }
};