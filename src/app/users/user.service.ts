import { Injectable } from "@nestjs/common";
import * as firebase from "firebase-admin";
// import { serviceAccount } from "../../config/firebase";
import { User, UserAttributes } from "../../db/User";
import { ResourceNotFoundError } from "../exceptions/ResourceNotFoundError";

const firebaseApp = firebase.initializeApp("" as any);
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
		try {
			return User.findOneOrFail({
				where: {
					id: userId
				}
			});
		} catch (e) {
			throw new ResourceNotFoundError();
		}
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

	public deleteUserById = async (id: number) => {
		const foundUser = await this.getUserById(id);
		await firebaseAuth.deleteUser(foundUser.firebaseId);
		return User.delete({ id });
	};
}
