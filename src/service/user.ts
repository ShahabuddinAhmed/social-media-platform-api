import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { UserInterface } from "../model/user";
import { UserRepoInterface } from "../repo/user";

export interface UserServiceInterface {
    signup(user: UserInterface): Promise<{ user: UserInterface | null; errMessage: string }>;
    login(email: string, password: string): Promise<{user: UserInterface | null; toekn: string; errMessage: string }>;
}

export class UserService implements UserServiceInterface {
    constructor(private userRepo: UserRepoInterface) {
        this.userRepo = userRepo;
    }

    public async signup(user: UserInterface): Promise<{ user: UserInterface | null; errMessage: string }> {
        const checkUser = await this.userRepo.getByEmail(user.email);
        if (checkUser) {
            return { user: null, errMessage: "This User is already exist" };
        }

		user.password = await this.hashPassword(user.password);
        return { user: await this.userRepo.create(user), errMessage: "" };
    }

    public async login(email: string, password: string): Promise<{user: UserInterface | null; toekn: string; errMessage: string }> {
        const checkUser = await this.userRepo.getByEmail(email);
        if (!checkUser) {
            return { user: null, toekn: "", errMessage: "This User doesn't exist" };
        }

		const checkPassword = await this.checkPassword(password, checkUser.password);
		if (!checkPassword) {
			return { user: null, toekn: "", errMessage: "Invalid Credentials" };
		}

		const toekn = await this.createToken(checkUser);
        return { user: checkUser, toekn, errMessage: "" };
    }

	private async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, 10);
	}

	private async checkPassword(attemptPass: string, hash: string): Promise<boolean> {
		return bcrypt.compare(attemptPass, hash);
	}

	private async createToken(user: UserInterface): Promise<string> {
		const payload = {
			userID: user.id,
			email: user.email
		};

		return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRATION });
	}
}

export const newUserService = async (userRepo: UserRepoInterface) => {
    return new UserService(userRepo);
};