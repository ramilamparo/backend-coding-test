import { Response as ExpressResponse } from "express";
import { UserAttributes, UserCreateAttributes } from "src/db/User";
import { DateTypesToUnix } from "../../types";
import { AuthService } from "./auth.service";
import { ServerResponse } from "@libs/ResponseBuilder";
export declare type AuthResponseObject = DateTypesToUnix<Omit<UserAttributes, "password">>;
export declare type AuthControllerSignUpParams = Omit<DateTypesToUnix<UserCreateAttributes>, "firebaseId"> & {
    password: string;
};
export declare type AuthControllerPostResponse = ServerResponse<AuthResponseObject | null>;
export declare type AuthControllerGetResponse = ServerResponse<AuthResponseObject | null>;
export declare type AuthControllerSignInParams = {
    email: string;
    password: string;
};
export declare class AuthController {
    service: AuthService;
    constructor(service: AuthService);
    signUp(res: ExpressResponse, newUser: AuthControllerSignUpParams): Promise<AuthControllerPostResponse>;
    signIn(res: ExpressResponse, userCredentials: AuthControllerSignInParams): Promise<AuthControllerGetResponse>;
    private mapUserModelToAuthObjectResponse;
}
