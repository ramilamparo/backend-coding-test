import { Test, TestingModule } from "@nestjs/testing";
import { ResourceNotFoundError } from "../../../src/app/exceptions/ResourceNotFoundError";
import { UserAttributes } from "../../../src/db/User";
import { DummyUser } from "../../test-utils/dummy-generator/DummyUser";
import { MockDB } from "../../test-utils/mocks/DB";
import { DateUtils } from "../../../src/libs/DateUtils";
import { UserController } from "../../../src/app/users/user.controller";
import { UserService } from "../../../src/app/users/user.service";

describe("UserController", () => {
	let userController: UserController;
	const mockDB = new MockDB();

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [UserService]
		}).compile();
		await mockDB.reset();
		userController = app.get(UserController);
	});

	describe("Create user", () => {
		it("Should return a user object.", async () => {
			const dummyUser = DummyUser.createDummyData();
			const response = await userController.createUser({
				dateOfBirth: DateUtils.dateToUnix(dummyUser.dateOfBirth),
				email: dummyUser.email,
				password: dummyUser.password
			});

			expect(response.id).toBeDefined();
			expect(response.firebaseId).toBeDefined();
			expect(response.password).toBeUndefined();
			expect(response.email).toEqual(dummyUser.email);
			expect(response.dateOfBirth).toEqual(dummyUser.email);
		});
	});

	describe("Get one", () => {
		it("Should get the correct created user.", async () => {
			const dummyUser = DummyUser.createDummyData();
			const response = await userController.createUser({
				dateOfBirth: DateUtils.dateToUnix(dummyUser.dateOfBirth),
				email: dummyUser.email,
				password: dummyUser.password
			});
			const foundUser = await userController.getUser(response.id);

			expect(foundUser.id).toBeDefined();
			expect(foundUser.firebaseId).toBeDefined();
			expect(foundUser.password).toBeUndefined();
			expect(foundUser.email).toEqual(dummyUser.email);
			expect(foundUser.dateOfBirth).toEqual(
				DateUtils.dateToUnix(dummyUser.dateOfBirth)
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
		const insertManyUsers = (count: number) => {
			const promises: Promise<UserAttributes>[] = [];
			for (let i = 0; i < count; i++) {
				const dummyUser = DummyUser.createDummyData();
				const promise = userController.createUser({
					dateOfBirth: DateUtils.dateToUnix(dummyUser.dateOfBirth),
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
				expect(foundUser.password).toBeUndefined();
				expect(foundUser.email).toEqual(createdUser.email);
				expect(foundUser.dateOfBirth).toEqual(
					DateUtils.dateToUnix(createdUser.dateOfBirth)
				);
			});
		});
		it("Should return a paginated set of users", async () => {
			const createdUsers = await insertManyUsers(100);

			const foundUsersPage1 = await userController.getUsers(1, 50);
			const foundUsersPage2 = await userController.getUsers(51, 100);
			const foundUsersPage3 = await userController.getUsers(100, 200);

			expect(foundUsersPage3).toHaveLength(0);
			createdUsers.forEach((createdUser, index) => {
				let foundUser: UserAttributes | undefined;
				if (index < 50) {
					foundUser = foundUsersPage1.find((foundUser) => {
						return foundUser.email === createdUser.email;
					});
				} else {
					foundUser = foundUsersPage2.find((foundUser) => {
						return foundUser.email === createdUser.email;
					});
				}
				if (!foundUser) {
					throw new Error(`${createdUser.id} not created.`);
				}
				expect(foundUser.id).toBeDefined();
				expect(foundUser.firebaseId).toBeDefined();
				expect(foundUser.password).toBeUndefined();
				expect(foundUser.email).toEqual(createdUser.email);
				expect(foundUser.dateOfBirth).toEqual(
					DateUtils.dateToUnix(createdUser.dateOfBirth)
				);
			});
		});
	});
});
