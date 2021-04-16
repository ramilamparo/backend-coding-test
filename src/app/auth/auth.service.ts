import { InvalidParametersError } from "@app/exceptions/InvalidParametersError";
import { FirebaseFactory } from "@libs/firebase/FirebaseFactory";
import { Injectable } from "@nestjs/common";
import { UserRole } from "@type-utils";
import { User, UserAttributes } from "../../db/User";

const firebaseAuth = FirebaseFactory.getFirebaseAuth();

@Injectable()
export class AuthService {
	public createUser = async (
		email: string,
		password: string,
		dateOfBirth: string,
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

	public signIn = async (email: string, password: string) => {
		const auth = FirebaseFactory.getFirebaseAuth();
		const token = await auth.signIn(email, password);
		const userData = await this.getUserByEmail(email);

		return {
			email,
			dateOfBirth: userData.dateOfBirth,
			role: userData.role,
			id: userData.id,
			firebaseId: userData.firebaseId,
			token
		};
	};

	private getUserByEmail = async (email: string) => {
		try {
			const foundUser = await User.findOneOrFail({
				where: {
					email
				}
			});
			return foundUser;
		} catch (e) {
			throw new InvalidParametersError();
		}
	};
}
