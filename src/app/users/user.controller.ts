import { DateUtils } from "@libs/DateUtils";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserAttributes, UserCreateAttributes } from "src/db/User";
import { DateTypesToUnix } from "src/types/utils";
import { UserService } from "./user.service";

export type UserControllerPostParams = Pick<
	DateTypesToUnix<UserCreateAttributes>,
	"email" | "dateOfBirth" | "password"
>;

@Controller("users")
export class UserController {
	constructor(public service: UserService) {}

	@Post()
	public async createUser(
		@Body() newUser: UserControllerPostParams
	): Promise<UserAttributes> {
		const user = await this.service.createUser(
			newUser.email,
			newUser.password,
			DateUtils.unixToDate(newUser.dateOfBirth)
		);

		return user;
	}

	@Get("/:id")
	public async getUser(@Param("id") userId: string | number) {
		const user = await this.service.getUserById(Number(userId));

		return user;
	}

	public async getUsers(from: number, to: number): Promise<UserAttributes[]>;
	public async getUsers(): Promise<UserAttributes[]>;
	@Get()
	public async getUsers(from?: number, to?: number): Promise<UserAttributes[]> {
		if (from && to) {
			const users = await this.service.getPaginatedUsers(from, to);
			return users;
		}
		const users = await this.service.getAllUsers();
		return users;
	}
}
