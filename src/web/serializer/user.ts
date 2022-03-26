import { UserInterface } from "../../model/user";

export class UserSerializer {
    public static async serializeUser(user: UserInterface) {
        return {
			name: user.name,
			email: user.email,
			image: user.image
		};
    }
}