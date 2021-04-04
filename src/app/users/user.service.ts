import { FirebaseFactory } from "@libs/firebase/FirebaseFactory";
import { Injectable } from "@nestjs/common";
import { UserRole } from "@type-utils*";
import { User, UserAttributes } from "../../db/User";
import { ResourceNotFoundError } from "../exceptions/ResourceNotFoundError";

const firebaseAuth = FirebaseFactory.getFirebaseAuth();

@Injectable()
export class UserService {
	public createUser = async (
		email: string,
		password: string,
		dateOfBirth: Date,
		role: UserRole
	): Promise<UserAttributes> => {
		const newFirebaseUser = await firebaseAuth.createUser(email, password);
		const newUser = User.create({
			email: newFirebaseUser.email,
			dateOfBirth,
			firebaseId: newFirebaseUser.uid,
			role
		});
		await newUser.save();

		return newUser;
	};

	public getUserById = async (userId: number) => {
		try {
			const foundUser = await User.findOneOrFail({
				where: {
					id: userId
				}
			});
			return foundUser;
		} catch (e) {
			throw new ResourceNotFoundError();
		}
	};

	public getPaginatedUsers = (from: number, to: number) => {
		return User.find({
			order: {
				id: "ASC"
			},
			take: to - from + 1,
			skip: from > 0 ? from - 1 : from
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
