import { FirebaseAuthMock } from "@test-utils/mocks/FirebaseAuthMock";
import { DummyUser } from "@test-utils/dummy-generator/DummyUser";
import { FirebaseFactory } from "@libs/firebase/FirebaseFactory";
import { InvalidParametersError } from "@app/exceptions/InvalidParametersError";

describe("FirebaseAuth", () => {
	const firebaseAuth = FirebaseFactory.getFirebaseAuth();
	afterEach(() => {
		FirebaseAuthMock.resetMocks();
	});

	it("Creates a new user", async () => {
		const dummyUser = DummyUser.createDummyData();

		const createdUser = await firebaseAuth.createUser(
			dummyUser.email,
			dummyUser.password
		);

		expect(createdUser.uid).toBeDefined();
		expect(createdUser.email).toEqual(dummyUser.email);
	});

	it("Reads users", async () => {
		const dummyUser = DummyUser.createDummyData();

		const createdUser = await firebaseAuth.createUser(
			dummyUser.email,
			dummyUser.password
		);

		const foundUser = await firebaseAuth.getUser(createdUser.uid);

		expect(foundUser.uid).toEqual(createdUser.uid);
		expect(foundUser.email).toEqual(createdUser.email);
	});

	it("Deletes a user", async () => {
		const dummyUser = DummyUser.createDummyData();

		const createdUser = await firebaseAuth.createUser(
			dummyUser.email,
			dummyUser.password
		);

		await firebaseAuth.deleteUser(createdUser.uid);

		const foundUser = await firebaseAuth.getUser(createdUser.uid);

		expect(foundUser).toBeUndefined();
	});

	describe("Verification of session token", () => {
		it("It verifies session.", async () => {
			const EMAIL = "test@mail.com";
			const COOKIE = "TESTTEST12345";

			FirebaseAuthMock.mockVerifySessionCookieReturnValueOnce({
				email: EMAIL
			});
			const firebaseUser = await firebaseAuth.verifySessionToken(COOKIE);

			expect(FirebaseAuthMock.hasVerifiedCookie(COOKIE)).toBeTruthy();
			expect(firebaseUser.email).toEqual(EMAIL);
		});
		it("Throws an error if user is not found or session is invalid.", async () => {
			FirebaseAuthMock.mockVerifySessionCookieRejectOnce();

			expect(firebaseAuth.verifySessionToken("")).rejects.toBeDefined();
		});
	});

	describe("Signing in with a session token.", () => {
		it("It returns a token upon successful sign in.", async () => {
			const EMAIL = "test@mail.com";
			const PASSWORD = "TESTTEST12345";

			const sessionToken = await firebaseAuth.signIn(EMAIL, PASSWORD);

			expect(FirebaseAuthMock.hasSignedInWith(EMAIL, PASSWORD)).toBeTruthy();
			expect(sessionToken).toBeDefined();
		});
		it("Throws an error if user is not found or session is invalid.", async () => {
			FirebaseAuthMock.mockInvalidSignInOnce();
			try {
				await firebaseAuth.signIn("", "");
				throw new Error("Sign in did not throw an error.");
			} catch (e) {
				expect(e).toBeInstanceOf(InvalidParametersError);
			}
		});
	});
});
