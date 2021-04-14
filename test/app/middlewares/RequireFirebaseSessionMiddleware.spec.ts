import { RequireFirebaseSessionMiddleware } from "@app/middlewares/RequireFirebaseSessionMiddleware";

describe("RequireFirebaseSessionMiddleware", () => {
	const middleware = new RequireFirebaseSessionMiddleware();

	it("Throws an error if the user is not signed in.", () => {
		const req: any = {};
		const res: any = {};
		const next = jest.fn();

		expect(() => {
			middleware.use(req, res, next);
		}).toThrowError();
		expect(next).not.toBeCalled();
	});
	it("Calls next when the user is signed in.", () => {
		const req: any = {
			user: {
				email: "test@mail.com",
				role: "admin"
			}
		};
		const res: any = {};
		const next = jest.fn();

		middleware.use(req, res, next);

		expect(next).toBeCalled();
	});
});
