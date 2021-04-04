import { Test, TestingModule } from "@nestjs/testing";
import { FirebaseAuthMock } from "@test-utils/mocks/FirebaseAuthMock";
import { DummyUser } from "@test-utils/dummy-generator/DummyUser";
import { MockDB } from "@test-utils/mocks/DB";
import { ResourceNotFoundError } from "@app/exceptions/ResourceNotFoundError";
import {
	UserController,
	UserControllerGetResponse,
	UserControllerPostResponse
} from "@app/users/user.controller";
import { UserService } from "@app/users/user.service";
import { UserAssertions } from "@test-utils/assertions/UserAssertions";

const insertOneUserToContoller = async (
	userController: UserController,
	dummyUser: DummyUser = DummyUser.createDummyData()
) => {
	return userController.createUser({
		dateOfBirth: dummyUser.dateOfBirth,
		email: dummyUser.email,
		password: dummyUser.password,
		role: dummyUser.role
	});
};

const insertManyUsersToController = (
	count: number,
	userController: UserController,
	dummyUser?: DummyUser
) => {
	const promises: Promise<UserControllerPostResponse>[] = [];
	for (let i = 0; i < count; i++) {
		const promise = insertOneUserToContoller(userController, dummyUser);
		promises.push(promise);
	}
	return Promise.all(promises);
};

describe("UserController", () => {
	let userController: UserController;
	let mockDB: MockDB;

	beforeAll(async () => {
		mockDB = await MockDB.mock();
	});

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [UserService]
		}).compile();
		userController = app.get(UserController);
	});

	afterEach(async () => {
		await mockDB.reset();
		FirebaseAuthMock.resetMocks();
	});

	describe("Create user", () => {
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

	describe("Get one", () => {
		it("Should get the correct created user.", async () => {
			const dummyUser = DummyUser.createDummyData();
			const response = await insertOneUserToContoller(
				userController,
				dummyUser
			);
			const foundUser = await userController.getUser(response.id);

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

		it("It should throw an error on not found", async () => {
			const RANDOM_ID = String(Date.now());
			try {
				await userController.getUser(RANDOM_ID);
				throw new Error("Controller did not throw an error.");
			} catch (e) {
				expect(e).toBeInstanceOf(ResourceNotFoundError);
			}
		});
	});

	describe("Get all", () => {
		it("Shoud read all created users", async () => {
			const createdUsers = await insertManyUsersToController(
				100,
				userController
			);
			const foundUsers = await userController.getUsers();

			createdUsers.forEach((createdUser) => {
				const foundUser = foundUsers.find((foundUser) => {
					return foundUser.email === createdUser.email;
				});
				if (!foundUser) {
					throw new Error(`${createdUser.id} not created.`);
				}
				UserAssertions.expectUserAttributesToNotHavePassword(foundUser);
				UserAssertions.expectUserToHaveFirebaseId(foundUser);
				UserAssertions.expectUserToHaveUniqueId(foundUser);
				UserAssertions.expectIsUserAttributesEqualTo(
					{
						email: foundUser.email,
						dateOfBirth: foundUser.dateOfBirth,
						role: foundUser.role
					},
					createdUser
				);
			});
		});
		it("Should return a paginated set of users", async () => {
			const createdUsers = await insertManyUsersToController(
				100,
				userController
			);
			const foundUsersPage1 = await userController.getUsers(1, 50);
			const foundUsersPage2 = await userController.getUsers(51, 100);
			const foundUsersPage3 = await userController.getUsers(101, 200);

			expect(foundUsersPage1).toHaveLength(50);
			expect(foundUsersPage2).toHaveLength(50);
			expect(foundUsersPage3).toHaveLength(0);
			createdUsers.forEach((createdUser) => {
				let foundUser: UserControllerGetResponse | undefined;
				foundUser = foundUsersPage1.find((foundUser) => {
					return foundUser.email === createdUser.email;
				});
				if (!foundUser) {
					foundUser = foundUsersPage2.find((foundUser) => {
						return foundUser.email === createdUser.email;
					});
				}
				if (!foundUser) {
					throw new Error(`User with ID ${createdUser.id} is not found.`);
				}
				UserAssertions.expectUserAttributesToNotHavePassword(foundUser);
				UserAssertions.expectUserToHaveFirebaseId(foundUser);
				UserAssertions.expectUserToHaveUniqueId(foundUser);
				UserAssertions.expectIsUserAttributesEqualTo(
					{
						email: foundUser.email,
						dateOfBirth: foundUser.dateOfBirth,
						role: foundUser.role
					},
					createdUser
				);
			});
		});
	});

	describe("Deleting a user", () => {
		it("Deletes the user in the DB and Firebase", async () => {
			const response = await insertOneUserToContoller(userController);
			await userController.deleteUser(response.id);

			expect(FirebaseAuthMock.hasDeletedUser(response.firebaseId));
			try {
				await userController.getUser(response.id);
				throw new Error("User still exists!");
			} catch (e) {
				expect(e).toBeInstanceOf(ResourceNotFoundError);
			}
		});
	});
});
