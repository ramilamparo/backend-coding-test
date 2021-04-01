import { Test, TestingModule } from "@nestjs/testing";
import { MockFireBaseAuth } from "../../test-utils/mocks/FireBaseAdmin";
import { ResourceNotFoundError } from "../../../src/app/exceptions/ResourceNotFoundError";
import { DummyUser } from "../../test-utils/dummy-generator/DummyUser";
import { MockDB } from "../../test-utils/mocks/DB";
import {
	UserController,
	UserControllerGetResponse,
	UserControllerPostResponse
} from "../../../src/app/users/user.controller";
import { UserService } from "../../../src/app/users/user.service";

describe("UserController", () => {
	let userController: UserController;
	const mockDB = new MockDB();
	const mockFirebase = MockFireBaseAuth.mock();

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [UserService]
		}).compile();
		await mockDB.reset();
		mockFirebase.reset();
		userController = app.get(UserController);
	});

	describe("Create user", () => {
		it("Should return a user object.", async () => {
			const dummyUser = DummyUser.createDummyData();
			const response = await userController.createUser({
				dateOfBirth: dummyUser.dateOfBirth,
				email: dummyUser.email,
				password: dummyUser.password
			});

			expect(
				mockFirebase.hasCreatedUser(dummyUser.email, dummyUser.password)
			).toBeTruthy();
			expect(response.id).toBeDefined();
			expect(response.firebaseId).toBeDefined();
			expect((response as any).password).toBeUndefined();
			expect(response.email).toEqual(dummyUser.email);
			expect(response.dateOfBirth).toEqual(dummyUser.dateOfBirth);
		});
	});

	describe("Get one", () => {
		it("Should get the correct created user.", async () => {
			const dummyUser = DummyUser.createDummyData();
			const response = await userController.createUser({
				dateOfBirth: dummyUser.dateOfBirth,
				email: dummyUser.email,
				password: dummyUser.password
			});
			const foundUser = await userController.getUser(response.id);

			expect(foundUser.id).toBeDefined();
			expect(foundUser.firebaseId).toBeDefined();
			expect((foundUser as any).password).toBeUndefined();
			expect(foundUser.email).toEqual(dummyUser.email);
			expect(foundUser.dateOfBirth).toEqual(dummyUser.dateOfBirth);
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
		const insertManyUsers = (count: number) => {
			const promises: Promise<UserControllerPostResponse>[] = [];
			for (let i = 0; i < count; i++) {
				const dummyUser = DummyUser.createDummyData();
				const promise = userController.createUser({
					dateOfBirth: dummyUser.dateOfBirth,
					email: dummyUser.email,
					password: dummyUser.password
				});
				promises.push(promise);
			}
			return Promise.all(promises);
		};

		it("Shoud read all created users", async () => {
			const createdUsers = await insertManyUsers(100);
			const foundUsers = await userController.getUsers();

			createdUsers.forEach((createdUser) => {
				const foundUser = foundUsers.find((foundUser) => {
					return foundUser.email === createdUser.email;
				});
				if (!foundUser) {
					throw new Error(`${createdUser.id} not created.`);
				}
				expect(foundUser.id).toBeDefined();
				expect(foundUser.firebaseId).toBeDefined();
				expect((foundUser as any).password).toBeUndefined();
				expect(foundUser.email).toEqual(createdUser.email);
				expect(foundUser.dateOfBirth).toEqual(createdUser.dateOfBirth);
			});
		});
		it("Should return a paginated set of users", async () => {
			const createdUsers = await insertManyUsers(100);
			const foundUsersPage1 = await userController.getUsers(1, 50);
			const foundUsersPage2 = await userController.getUsers(51, 100);
			const foundUsersPage3 = await userController.getUsers(101, 200);

			expect(foundUsersPage1).toHaveLength(50);
			expect(foundUsersPage2).toHaveLength(50);
			expect(foundUsersPage3).toHaveLength(0);
			createdUsers.forEach((createdUser, index) => {
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
				expect(foundUser.id).toBeDefined();
				expect(foundUser.firebaseId).toBeDefined();
				expect((foundUser as any).password).toBeUndefined();
				expect(foundUser.email).toEqual(createdUser.email);
				expect(foundUser.dateOfBirth).toEqual(createdUser.dateOfBirth);
			});
		});
	});

	describe("Deleting a user", () => {
		it("Deletes the user in the DB and Firebase", async () => {
			const dummyUser = DummyUser.createDummyData();
			const response = await userController.createUser({
				dateOfBirth: dummyUser.dateOfBirth,
				email: dummyUser.email,
				password: dummyUser.password
			});
			await userController.deleteUser(response.id);

			expect(mockFirebase.hasDeletedUser(response.firebaseId));
			try {
				await userController.getUser(response.id);
				throw new Error("User still exists!");
			} catch (e) {
				expect(e).toBeInstanceOf(ResourceNotFoundError);
			}
		});
	});
});
