import { Body, Controller, Post, Request, Response } from "@nestjs/common";
import {
	Response as ExpressResponse,
	Request as ExpressRequest
} from "express";
import { DateUtils } from "../../libs/DateUtils";
import { UserAttributes, UserCreateAttributes } from "src/db/User";
import { DateTypesToUnix } from "../../types";
import { AuthService } from "./auth.service";

export type AuthControllerSignUpParams = Omit<
	DateTypesToUnix<UserCreateAttributes>,
	"firebaseId"
> & { password: string };
export type AuthControllerPostResponse = DateTypesToUnix<
	Omit<UserAttributes, "password">
>;
export type AuthControllerGetResponse = DateTypesToUnix<UserAttributes>;

export type AuthControllerSignInParams = { email: string; password: string };

@Controller("auth")
export class AuthController {
	constructor(public service: AuthService) {}

	@Post("/signup")
	public async createUser(
		@Body() newUser: AuthControllerSignUpParams
	): Promise<AuthControllerPostResponse> {
		const user = await this.service.createUser(
			newUser.email,
			newUser.password,
			DateUtils.unixToDate(newUser.dateOfBirth),
			newUser.role
		);

		return this.mapUserModelToGetResponse(user);
	}

	@Post("/signin")
	public async signIn(
		@Request() req: ExpressRequest,
		@Response() res: ExpressResponse,
		@Body() userCredentials: AuthControllerSignInParams
	): Promise<AuthControllerGetResponse> {
		const user = await this.service.signIn(
			userCredentials.email,
			userCredentials.password
		);

		res.cookie("session", user.token);

		return this.mapUserModelToGetResponse(user);
	}

	private mapUserModelToGetResponse = (
		user: UserAttributes
	): AuthControllerGetResponse => {
		return {
			dateOfBirth: DateUtils.dateToUnix(user.dateOfBirth),
			id: user.id,
			email: user.email,
			firebaseId: user.firebaseId,
			role: user.role
		};
	};
}
