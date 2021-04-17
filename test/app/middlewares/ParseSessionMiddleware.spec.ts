import { FirebaseAuthMock } from "@test-utils/mocks/FirebaseAuthMock";
import { MockDB } from "@test-utils/mocks/MockDB";
import { ParseSessionMiddleware } from "@app/middlewares/ParseSessionMiddleware";
import { User } from "@db/User";
import { DummyUser } from "@test-utils/dummy-generator/DummyUser";

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
		const userData = DummyUser.createDummyData({ role: "standard" });
		const req: any = {
			cookies: {
				session: ""
			}
		};
		const res: any = {};
		const next = jest.fn();

		FirebaseAuthMock.mockVerifySessionCookieReturnValueOnce({
			email: userData.email
		});
		await User.create(userData).save();
		await middleware.use(req, res, next);

		expect(req.user.email).toEqual(userData.email);
		expect(req.user.role).toEqual(userData.role);
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
