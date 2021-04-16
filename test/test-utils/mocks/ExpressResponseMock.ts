import { Response } from "express";

export class ExpressResponseMock {
	public static createResponseMock = () => {
		return new ExpressResponseMock();
	};

	public status = jest.fn<this, [number]>(() => this);

	public cookie = jest.fn<void, [string]>();

	public castToExpressResponse = () => {
		return (this as unknown) as Response;
	};

	public hasCalledStatusWith = (statusCode: number) => {
		return this.status.mock.calls.some((params) => {
			const statusCodeParam = params[0];
			return statusCode === statusCodeParam;
		});
	};

	public reset = () => {
		this.status.mockReset();
		this.cookie.mockReset();
	};
}
