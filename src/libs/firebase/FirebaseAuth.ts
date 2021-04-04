import { app, auth } from "firebase-admin";

export interface FirebaseAuthUserAttributes {
	email: string;
	uid: string;
}

export class FirebaseAuth {
	private constructor(private auth: auth.Auth) {}

	public static create = (app: app.App) => {
		return new FirebaseAuth(app.auth());
	};

	public createUser = async (
		email: string,
		password: string
	): Promise<FirebaseAuthUserAttributes> => {
		const user = await this.auth.createUser({
			email,
			password
		});
		if (!user.email) {
			throw new Error("Email is not provided!");
		}
		return {
			email: user.email,
			uid: user.uid
		};
	};

	public getUser = async (firebaseId: string) => {
		const foundUser = await this.auth.getUser(firebaseId);
		return foundUser;
	};

	public deleteUser = async (firebaseId: string) => {
		await this.auth.deleteUser(firebaseId);
	};
}
