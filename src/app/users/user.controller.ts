import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DateUtils } from "../../libs/DateUtils";
import { UserAttributes, UserCreateAttributes } from "src/db/User";
import { DateTypesToUnix } from "../../types";
import { User } from "../../db/User";
import { UserService } from "./user.service";

export type UserControllerPostParams = Omit<
	DateTypesToUnix<UserCreateAttributes>,
	"firebaseId"
> & { password: string };
export type UserControllerPostResponse = DateTypesToUnix<
	Omit<UserAttributes, "password">
>;
export type UserControllerGetResponse = DateTypesToUnix<UserAttributes>;

@Controller("users")
export class UserController {
	constructor(public service: UserService) {}

	@Post()
	public async createUser(
		@Body() newUser: UserControllerPostParams
	): Promise<UserControllerPostResponse> {
		const user = await this.service.createUser(
			newUser.email,
			newUser.password,
			DateUtils.unixToDate(newUser.dateOfBirth),
			newUser.role
		);

		return {
			dateOfBirth: DateUtils.dateToUnix(user.dateOfBirth),
			email: user.email,
			firebaseId: user.firebaseId,
			id: user.id,
			role: user.role
		};
	}

	@Get("/:id")
	public async getUser(
		@Param("id") userId: string | number
	): Promise<UserControllerGetResponse> {
		const user = await this.service.getUserById(Number(userId));

		return this.mapUserModelToGetResponse(user);
	}

	public async getUsers(
		from: number,
		to: number
	): Promise<UserControllerGetResponse[]>;
	public async getUsers(): Promise<UserControllerGetResponse[]>;
	@Get()
	public async getUsers(
		from?: number,
		to?: number
	): Promise<UserControllerGetResponse[]> {
		let users: User[] = [];

		if (from && to) {
			users = await this.service.getPaginatedUsers(from, to);
		} else {
			users = await this.service.getAllUsers();
		}

		return users.map((user) => this.mapUserModelToGetResponse(user));
	}

	public async deleteUser(userId: number) {
		await this.service.deleteUserById(userId);
	}

	private mapUserModelToGetResponse = (
		user: User
	): UserControllerGetResponse => {
		return {
			dateOfBirth: DateUtils.dateToUnix(user.dateOfBirth),
			id: user.id,
			email: user.email,
			firebaseId: user.firebaseId,
			role: user.role
		};
	};
}
