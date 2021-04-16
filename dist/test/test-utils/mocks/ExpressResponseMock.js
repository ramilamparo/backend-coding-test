"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressResponseMock = void 0;
class ExpressResponseMock {
    constructor() {
        this.status = jest.fn(() => this);
        this.cookie = jest.fn();
        this.castToExpressResponse = () => {
            return this;
        };
        this.hasCalledStatusWith = (statusCode) => {
            return this.status.mock.calls.some((params) => {
                const statusCodeParam = params[0];
                return statusCode === statusCodeParam;
            });
        };
        this.reset = () => {
            this.status.mockReset();
            this.cookie.mockReset();
        };
    }
}
exports.ExpressResponseMock = ExpressResponseMock;
ExpressResponseMock.createResponseMock = () => {
    return new ExpressResponseMock();
};
//# sourceMappingURL=ExpressResponseMock.js.map