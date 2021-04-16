import { Response } from "express";
import { InvalidParametersError } from "@app/exceptions/InvalidParametersError";
import { InvalidPermissionError } from "@app/exceptions/InvalidPermissionError";
import { InvalidSessionError } from "@app/exceptions/InvalidSessionError";
import { ResourceNotFoundError } from "@app/exceptions/ResourceNotFoundError";

export interface ServerResponseMeta {
	success: boolean;
	message: string;
	code: StatusCode;
}

export interface ServerResponse<T> extends ServerResponseMeta {
	data: T;
}

export enum StatusCode {
	UNKNOWN = "UNKNOWN",
	SUCCESS = "SUCCESS",
	INVALID_PARAMETERS = "INVALID_PARAMETERS",
	INVALID_PERMISSION = "INVALID_PERMISSION",
	INVALID_SESSION = "INVALID_SESSION",
	RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND"
}

export class ResponseBuilder<T> {
	constructor(
		public data: T | null = null,
		public meta: ServerResponseMeta = {
			success: false,
			message: "Unknown server error",
			code: StatusCode.UNKNOWN
		}
	) {}

	public setData = (data: T) => {
		this.data = data;
	};

	public setSuccess = (success: boolean) => {
		this.meta.success = success;
	};

	public setCode = (code: StatusCode) => {
		this.meta.code = code;
	};

	public setMessage = (message: string) => {
		this.meta.message = message;
	};

	public handleExpressError = (e: Error, res: Response) => {
		if (e instanceof InvalidParametersError) {
			this.setCode(StatusCode.INVALID_PARAMETERS);
			res.status(422);
		} else if (e instanceof InvalidPermissionError) {
			this.setCode(StatusCode.INVALID_PERMISSION);
			res.status(403);
		} else if (e instanceof InvalidSessionError) {
			this.setCode(StatusCode.INVALID_SESSION);
			res.status(403);
		} else if (e instanceof ResourceNotFoundError) {
			this.setCode(StatusCode.RESOURCE_NOT_FOUND);
			res.status(404);
		} else {
			console.error(e);
			res.status(500);
		}
		this.setMessage(e.message);
	};

	public handleExpressSuccess = (message: string, res: Response) => {
		this.setMessage(message);
		this.setCode(StatusCode.SUCCESS);
		this.setSuccess(true);
		res.status(200);
	};

	public toObject = () => {
		return {
			data: this.data,
			...this.meta
		};
	};
}
