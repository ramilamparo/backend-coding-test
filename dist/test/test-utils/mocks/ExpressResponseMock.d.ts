/// <reference types="jest" />
import { Response } from "express";
export declare class ExpressResponseMock {
    static createResponseMock: () => ExpressResponseMock;
    status: jest.Mock<this, [number]>;
    cookie: jest.Mock<void, [string]>;
    castToExpressResponse: () => Response<any, Record<string, any>>;
    hasCalledStatusWith: (statusCode: number) => boolean;
    reset: () => void;
}
