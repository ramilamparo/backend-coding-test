import { MockDB } from "../test-utils/mocks/DB";
import { User } from "../../src/db/User";
import { DummyUser } from "../test-utils/dummy-generator/DummyUser";

describe("User Model", () => {
	const mockConnection = new MockDB();
	beforeEach(() => {
		return mockConnection.reset();
	});

	describe("Creating a user", () => {
		test("Creating one", async () => {
			const dummyUserData = DummyUser.createDummyData();

			const user = await User.create(dummyUserData).save();

			expect(user).toBeInstanceOf(User);
		});

		test("Disallow duplicate emails.", async () => {
			const dummyUserData = DummyUser.createDummyData();

			await User.create(dummyUserData).save();

			try {
				await User.create(dummyUserData).save();
				throw new Error("Duplicate email did not throw!");
			} catch (e) {
				expect(e).toBeInstanceOf(Error);
			}
		});

		test("Disallow duplicate firebase ID.", async () => {
			const FIREBASE_ID = "1";
			const dummyUserData = DummyUser.createDummyData({
				firebaseId: FIREBASE_ID
			});

			await User.create(dummyUserData).save();

			try {
				await User.create(dummyUserData).save();
				throw new Error("Duplicate email did not throw!");
			} catch (e) {
				expect(e).toBeInstanceOf(Error);
			}
		});
	});

	describe("Reading users", () => {
		test("All users", async () => {
			const dummyUsers = [
				DummyUser.createDummyData({ email: "email@mail.com" }),
				DummyUser.createDummyData({ email: "email2@mail.com" })
			];

			await Promise.all(
				dummyUsers.map((user) =>
					User.create({
						dateOfBirth: user.dateOfBirth,
						email: user.email,
						firebaseId: user.firebaseId,
						role: user.role
					}).save()
				)
			);

			const foundUsers = await User.find();

			const hasAllUsers = dummyUsers.every((dummyUser) => {
				const isUserFound = foundUsers.find((foundUser) => {
					const sameEmail = foundUser.email === dummyUser.email;
					return sameEmail;
				});
				return Boolean(isUserFound);
			});

			expect(foundUsers).toHaveLength(2);
			expect(hasAllUsers).toStrictEqual(true);
		});

		test("One user", async () => {
			const dummyUser = DummyUser.createDummyData();

			await User.create(dummyUser).save();
			const foundUser = await User.findOneOrFail({ email: dummyUser.email });

			expect(foundUser.email).toStrictEqual(dummyUser.email);
		});
	});

	test("Updating a user", async () => {
		const dummyUserData = DummyUser.createDummyData();
		const UPDATED_EMAIL = "test@mail.com";

		const user = User.create(dummyUserData);
		await user.save();
		user.email = UPDATED_EMAIL;
		await user.save();
		const user2 = await User.findOneOrFail({ email: UPDATED_EMAIL });

		expect(user.email).toStrictEqual(UPDATED_EMAIL);
		expect(user2.email).toStrictEqual(UPDATED_EMAIL);
	});

	test("Deleting a user", async () => {
		const dummyUserData = DummyUser.createDummyData();

		const user = User.create(dummyUserData);
		await user.save();
		await user.remove();
		const foundUser = await User.findOne({ email: dummyUserData.email });

		expect(foundUser).toBeUndefined();
	});
});
