import { Response } from "express";
export interface ServerResponseMeta {
    success: boolean;
    message: string;
    code: StatusCode;
}
export interface ServerResponse<T> extends ServerResponseMeta {
    data: T;
}
export declare enum StatusCode {
    UNKNOWN = "UNKNOWN",
    SUCCESS = "SUCCESS",
    INVALID_PARAMETERS = "INVALID_PARAMETERS",
    INVALID_PERMISSION = "INVALID_PERMISSION",
    INVALID_SESSION = "INVALID_SESSION",
    RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND"
}
export declare class ResponseBuilder<T> {
    data: T | null;
    meta: ServerResponseMeta;
    constructor(data?: T | null, meta?: ServerResponseMeta);
    setData: (data: T) => void;
    setSuccess: (success: boolean) => void;
    setCode: (code: StatusCode) => void;
    setMessage: (message: string) => void;
    handleExpressError: (e: Error, res: Response) => void;
    handleExpressSuccess: (message: string, res: Response) => void;
    toObject: () => {
        success: boolean;
        message: string;
        code: StatusCode;
        data: T | null;
    };
}
