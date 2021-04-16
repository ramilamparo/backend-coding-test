import { app, auth } from "firebase-admin";
import firebase from "firebase";
import { InvalidSessionError } from "@app/exceptions/InvalidSessionError";
import { InvalidParametersError } from "@app/exceptions/InvalidParametersError";
import { client } from "@config/firebase";

export interface FirebaseAuthUserAttributes {
	email: string;
	uid: string;
}

export class FirebaseAuth {
	private constructor(private auth: auth.Auth) {}
	private static firebase = firebase.initializeApp(client);

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

	public verifySessionToken = async (cookie: string) => {
		try {
			const user = await this.auth.verifyIdToken(cookie);
			if (!user.email) {
				throw new Error("User did not sign up with email.");
			}
			return {
				email: user.email
			};
		} catch (e) {
			throw new InvalidSessionError();
		}
	};

	public signIn = async (email: string, password: string) => {
		try {
			const userCredential = await FirebaseAuth.firebase
				.auth()
				.signInWithEmailAndPassword(email, password);

			const sessionToken = await userCredential.user?.getIdToken(true);

			if (sessionToken) {
				return sessionToken;
			}
		} catch (e) {
			throw new InvalidParametersError();
		}
		throw new Error("Cannot sign in user.");
	};
}
