import { Model } from "mongoose";
import { UserInterface, UserModel } from "../model/user";

export interface UserRepoInterface {
    create(user: UserInterface): Promise<UserInterface>;
    getByUserID(userID: string): Promise<UserInterface | null>;
    getByEmail(email: string): Promise<UserInterface | null>;
}

export class UserRepo implements UserRepoInterface {
    constructor(private userModel: Model<UserInterface, {}, {}, {}>) {
        this.userModel = userModel;
    }

    public async create(user: UserInterface): Promise<UserInterface> {
        return this.userModel.create(user);
    }

    public async getByUserID(userID: string): Promise<UserInterface | null> {
        return this.userModel.findById(userID);
    }

    public async getByEmail(email: string): Promise<UserInterface | null> {
        return this.userModel.findOne({ email });
    }
}

export const newUserRepo = async (userModel: Model<UserInterface, {}, {}, {}>): Promise<UserRepoInterface> => {
    return new UserRepo(userModel);
};

export default UserRepo;