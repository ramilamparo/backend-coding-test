import { FirebaseAuthMock } from "@test-utils/mocks/FirebaseAuthMock";
import { MockDB } from "@test-utils/mocks/MockDB";
import { ParseSessionMiddleware } from "@app/middlewares/ParseSessionMiddleware";
import { User } from "@db/User";
import { UserRole } from "@type-utils*";

describe("ParseSessionMiddleware", () => {
	const middleware = new ParseSessionMiddleware();
	let dbMock: MockDB;

	beforeAll(async () => {
		dbMock = await MockDB.mock();
	});

	beforeEach(async () => {
		await dbMock.reset();
	});

	it("Attaches user to request object on success.", async () => {
		const EMAIL = "test@mail.com";
		const ROLE: UserRole = "admin";
		const req: any = {
			cookies: {
				session: ""
			}
		};
		const res: any = {};
		const next = jest.fn();

		FirebaseAuthMock.mockVerifySessionCookieReturnValueOnce(
			Promise.resolve({
				email: EMAIL
			})
		);
		await User.create({
			dateOfBirth: new Date(),
			email: EMAIL,
			firebaseId: "",
			role: ROLE
		}).save();
		await middleware.use(req, res, next);

		expect(req.user.email).toEqual(EMAIL);
		expect(req.user.role).toEqual(ROLE);
	});

	it("Does not attach user to request object on fail.", async () => {
		const req: any = { cookies: { session: "" } };
		const res: any = {};
		const next = jest.fn();

		FirebaseAuthMock.mockVerifySessionCookieRejectOnce();
		await middleware.use(req, res, next);

		expect(req.user).toBeUndefined();
		expect(next).toBeCalled();
	});
});
