import { Body, Controller, Post, Response } from "@nestjs/common";
import { Response as ExpressResponse } from "express";
import { DateUtils } from "../../libs/DateUtils";
import { UserAttributes, UserCreateAttributes } from "src/db/User";
import { DateTypesToUnix } from "../../types";
import { AuthService } from "./auth.service";
import {
	ResponseBuilder,
	ServerResponse,
	StatusCode
} from "@libs/ResponseBuilder";

export type AuthResponseObject = DateTypesToUnix<
	Omit<UserAttributes, "password">
>;

export type AuthControllerSignUpParams = Omit<
	DateTypesToUnix<UserCreateAttributes>,
	"firebaseId"
> & { password: string };

export type AuthControllerPostResponse = ServerResponse<AuthResponseObject | null>;

export type AuthControllerGetResponse = ServerResponse<AuthResponseObject | null>;

export type AuthControllerSignInParams = { email: string; password: string };

@Controller("/auth")
export class AuthController {
	constructor(public service: AuthService) {}

	@Post("/signup")
	public async signUp(
		@Response() res: ExpressResponse,
		@Body() newUser: AuthControllerSignUpParams
	): Promise<AuthControllerPostResponse> {
		const response = new ResponseBuilder<AuthResponseObject>();
		try {
			const user = await this.service.createUser(
				newUser.email,
				newUser.password,
				DateUtils.unixToDate(newUser.dateOfBirth),
				newUser.role
			);

			const userData = this.mapUserModelToAuthObjectResponse(user);
			response.setData(userData);
			response.setSuccess(true);
			response.setCode(StatusCode.SUCCESS);
			response.setMessage("Successfully signed up.");
		} catch (e) {
			response.handleExpressError(e, res);
		}
		return response.toObject();
	}

	@Post("/signin")
	public async signIn(
		@Response() res: ExpressResponse,
		@Body() userCredentials: AuthControllerSignInParams
	): Promise<AuthControllerGetResponse> {
		const response = new ResponseBuilder<AuthResponseObject>();
		try {
			const user = await this.service.signIn(
				userCredentials.email,
				userCredentials.password
			);

			res.cookie("session", user.token);

			const userData = this.mapUserModelToAuthObjectResponse(user);
			response.setData(userData);
			response.setSuccess(true);
			response.setCode(StatusCode.SUCCESS);
			response.setMessage("Successfully signed in.");
		} catch (e) {
			response.handleExpressError(e, res);
		}
		return response.toObject();
	}

	private mapUserModelToAuthObjectResponse = (
		user: UserAttributes
	): AuthResponseObject => {
		return {
			dateOfBirth: DateUtils.dateToUnix(user.dateOfBirth),
			id: user.id,
			email: user.email,
			firebaseId: user.firebaseId,
			role: user.role
		};
	};
}
