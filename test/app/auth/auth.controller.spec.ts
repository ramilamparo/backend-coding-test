import { Test, TestingModule } from "@nestjs/testing";
import { FirebaseAuthMock } from "@test-utils/mocks/FirebaseAuthMock";
import { DummyUser } from "@test-utils/dummy-generator/DummyUser";
import { MockDB } from "@test-utils/mocks/MockDB";
import { AuthController } from "@app/auth/auth.controller";
import { AuthService } from "@app/auth/auth.service";
import { UserAssertions } from "@test-utils/assertions/UserAssertions";
import { ExpressResponseMock } from "@test-utils/mocks/ExpressResponseMock";
import { Response } from "express";
import { StatusCode } from "@libs/ResponseBuilder";

const insertOneUserToContoller = async (
	response: Response,
	userController: AuthController,
	dummyUser: DummyUser = DummyUser.createDummyData()
) => {
	return userController.signUp(response, {
		dateOfBirth: dummyUser.dateOfBirth,
		email: dummyUser.email,
		password: dummyUser.password,
		role: dummyUser.role
	});
};

describe("UserController", () => {
	let userController: AuthController;
	let mockDB: MockDB;
	const res = new ExpressResponseMock();

	beforeAll(async () => {
		mockDB = await MockDB.mock();
	});

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [AuthService]
		}).compile();
		userController = app.get(AuthController);
		res.reset();
	});

	afterEach(async () => {
		await mockDB.reset();
		FirebaseAuthMock.resetMocks();
	});

	describe("Sign up", () => {
		it("Should return a user object.", async () => {
			const dummyUser = DummyUser.createDummyData();
			const response = await userController.signUp(
				res.castToExpressResponse(),
				dummyUser
			);
			if (!response.data) {
				throw new Error("Response does not have a data");
			}

			expect(
				FirebaseAuthMock.hasCreatedUser(dummyUser.email, dummyUser.password)
			).toBeTruthy();
			UserAssertions.expectUserAttributesToNotHavePassword(response);
			UserAssertions.expectUserToHaveFirebaseId(response.data);
			UserAssertions.expectUserToHaveUniqueId(response.data);
			UserAssertions.expectIsUserAttributesEqualTo(
				{
					email: dummyUser.email,
					dateOfBirth: dummyUser.dateOfBirth,
					role: dummyUser.role
				},
				response.data
			);
		});
	});

	describe("Sign in", () => {
		it("Should get the correct created user.", async () => {
			const TOKEN = "testing";
			FirebaseAuthMock.mockGetIdTokenResponseOnce(TOKEN);

			const dummyUser = DummyUser.createDummyData();
			await insertOneUserToContoller(
				res.castToExpressResponse(),
				userController,
				dummyUser
			);
			const foundUser = await userController.signIn(
				res.castToExpressResponse(),
				{
					email: dummyUser.email,
					password: dummyUser.password
				}
			);
			if (!foundUser.data) {
				throw new Error("User is not found.");
			}

			expect(res.cookie).toBeCalledWith("session", TOKEN);
			UserAssertions.expectUserAttributesToNotHavePassword(foundUser);
			UserAssertions.expectUserToHaveFirebaseId(foundUser.data);
			UserAssertions.expectUserToHaveUniqueId(foundUser.data);
			UserAssertions.expectIsUserAttributesEqualTo(
				{
					email: dummyUser.email,
					dateOfBirth: dummyUser.dateOfBirth,
					role: dummyUser.role
				},
				foundUser.data
			);
		});

		it("It should throw on invalid credentials.", async () => {
			FirebaseAuthMock.mockInvalidSignInOnce();
			const response = await userController.signIn(
				res.castToExpressResponse(),
				{
					email: "test@mail.com",
					password: "12345"
				}
			);
			expect(response.code).toEqual(StatusCode.INVALID_PARAMETERS);
		});
	});
});
