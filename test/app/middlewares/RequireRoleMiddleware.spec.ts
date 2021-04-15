import { RequireRoleMiddleware } from "@app/middlewares/RequireRoleMiddleware";

describe("RequireRoleMiddleware", () => {
	const next = jest.fn();
	beforeEach(() => {
		next.mockReset();
	});
	describe("When user is logged in.", () => {
		const req: any = {
			user: {
				email: "test@mail.com",
				role: "admin"
			}
		};
		const res: any = {};

		it("Throws an error if the user does not meet the required roles.", () => {
			expect(() => {
				RequireRoleMiddleware.use(["standard"])(req, res, next);
			}).toThrowError();
			expect(next).not.toBeCalled();
		});
		it("Throws an error if the user does not meet the required role.", () => {
			expect(() => {
				RequireRoleMiddleware.use("standard")(req, res, next);
			}).toThrowError();
			expect(next).not.toBeCalled();
		});
		it("Does not throw an error if the user does meet the one of the required roles.", () => {
			RequireRoleMiddleware.use(["admin", "standard"])(req, res, next);
			expect(next).toBeCalled();
		});
		it("Does not throw an error if the user does meet the required role.", () => {
			RequireRoleMiddleware.use("admin")(req, res, next);
			expect(next).toBeCalled();
		});
	});
	describe("When user is not logged in.", () => {
		const req: any = {};
		const res: any = {};
		it("Throws an error if the user does not meet the required roles.", () => {
			expect(() => {
				RequireRoleMiddleware.use(["standard", "admin"])(req, res, next);
			}).toThrowError();
			expect(next).not.toBeCalled();
		});
		it("Throws an error if the user does not meet the required role.", () => {
			expect(() => {
				RequireRoleMiddleware.use("standard")(req, res, next);
			}).toThrowError();
			expect(next).not.toBeCalled();
		});
	});
});
