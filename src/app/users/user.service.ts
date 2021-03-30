import { Injectable } from "@nestjs/common";
import firebase from "firebase-admin";
import { serviceAccountKey } from "../../config/firebase";
import { User, UserAttributes } from "../../db/User";

const firebaseApp = firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccountKey)
});
const firebaseAuth = firebaseApp.auth();

@Injectable()
export class UserService {
	public createUser = async (
		email: string,
		password: string,
		dateOfBirth: Date
	): Promise<UserAttributes> => {
		const newFirebaseUser = await firebaseAuth.createUser({ email, password });
		const newUser = User.create({
			email: newFirebaseUser.email,
			dateOfBirth,
			firebaseId: newFirebaseUser.uid
		});
		await newUser.save();

		return newUser;
	};

	public getUserById = (userId: number) => {
		return User.findOneOrFail({
			where: {
				id: userId
			}
		});
	};

	public getPaginatedUsers = (from: number, to: number) => {
		return User.find({
			order: {
				id: "ASC"
			},
			take: to - from,
			skip: from
		});
	};

	public getAllUsers = () => {
		return User.find();
	};
}
