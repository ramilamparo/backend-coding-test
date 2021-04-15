import { Test, TestingModule } from "@nestjs/testing";
import { FirebaseAuthMock } from "@test-utils/mocks/FirebaseAuthMock";
import { DummyUser } from "@test-utils/dummy-generator/DummyUser";
import { MockDB } from "@test-utils/mocks/MockDB";
import { AuthController } from "@app/auth/auth.controller";
import { AuthService } from "@app/auth/auth.service";
import { UserAssertions } from "@test-utils/assertions/UserAssertions";
import { InvalidParametersError } from "@app/exceptions/InvalidParametersError";

const insertOneUserToContoller = async (
	userController: AuthController,
	dummyUser: DummyUser = DummyUser.createDummyData()
) => {
	return userController.createUser({
		dateOfBirth: dummyUser.dateOfBirth,
		email: dummyUser.email,
		password: dummyUser.password,
		role: dummyUser.role
	});
};

describe("UserController", () => {
	let userController: AuthController;
	let mockDB: MockDB;

	beforeAll(async () => {
		mockDB = await MockDB.mock();
	});

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [AuthService]
		}).compile();
		userController = app.get(AuthController);
	});

	afterEach(async () => {
		await mockDB.reset();
		FirebaseAuthMock.resetMocks();
	});

	describe("Sign up", () => {
		it("Should return a user object.", async () => {
			const dummyUser = DummyUser.createDummyData();
			const response = await insertOneUserToContoller(
				userController,
				dummyUser
			);
			expect(
				FirebaseAuthMock.hasCreatedUser(dummyUser.email, dummyUser.password)
			).toBeTruthy();
			UserAssertions.expectUserAttributesToNotHavePassword(response);
			UserAssertions.expectUserToHaveFirebaseId(response);
			UserAssertions.expectUserToHaveUniqueId(response);
			UserAssertions.expectIsUserAttributesEqualTo(
				{
					email: dummyUser.email,
					dateOfBirth: dummyUser.dateOfBirth,
					role: dummyUser.role
				},
				response
			);
		});
	});

	describe("Sign in", () => {
		it("Should get the correct created user.", async () => {
			const dummyUser = DummyUser.createDummyData();
			await insertOneUserToContoller(userController, dummyUser);
			const foundUser = await userController.signIn({
				email: dummyUser.email,
				password: dummyUser.password
			});

			UserAssertions.expectUserAttributesToNotHavePassword(foundUser);
			UserAssertions.expectUserToHaveFirebaseId(foundUser);
			UserAssertions.expectUserToHaveUniqueId(foundUser);
			UserAssertions.expectIsUserAttributesEqualTo(
				{
					email: dummyUser.email,
					dateOfBirth: dummyUser.dateOfBirth,
					role: dummyUser.role
				},
				foundUser
			);
		});

		it("It should throw on invalid credentials.", async () => {
			try {
				FirebaseAuthMock.mockInvalidSignInOnce();
				await userController.signIn({
					email: "test@mail.com",
					password: "12345"
				});
				throw new Error("Controller did not throw an error.");
			} catch (e) {
				expect(e).toBeInstanceOf(InvalidParametersError);
			}
		});
	});
});
