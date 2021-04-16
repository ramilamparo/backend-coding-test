"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseBuilder = exports.StatusCode = void 0;
const InvalidParametersError_1 = require("../app/exceptions/InvalidParametersError");
const InvalidPermissionError_1 = require("../app/exceptions/InvalidPermissionError");
const InvalidSessionError_1 = require("../app/exceptions/InvalidSessionError");
const ResourceNotFoundError_1 = require("../app/exceptions/ResourceNotFoundError");
var StatusCode;
(function (StatusCode) {
    StatusCode["UNKNOWN"] = "UNKNOWN";
    StatusCode["SUCCESS"] = "SUCCESS";
    StatusCode["INVALID_PARAMETERS"] = "INVALID_PARAMETERS";
    StatusCode["INVALID_PERMISSION"] = "INVALID_PERMISSION";
    StatusCode["INVALID_SESSION"] = "INVALID_SESSION";
    StatusCode["RESOURCE_NOT_FOUND"] = "RESOURCE_NOT_FOUND";
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
class ResponseBuilder {
    constructor(data = null, meta = {
        success: false,
        message: "Unknown server error",
        code: StatusCode.UNKNOWN
    }) {
        this.data = data;
        this.meta = meta;
        this.setData = (data) => {
            this.data = data;
        };
        this.setSuccess = (success) => {
            this.meta.success = success;
        };
        this.setCode = (code) => {
            this.meta.code = code;
        };
        this.setMessage = (message) => {
            this.meta.message = message;
        };
        this.handleExpressError = (e, res) => {
            if (e instanceof InvalidParametersError_1.InvalidParametersError) {
                this.setCode(StatusCode.INVALID_PARAMETERS);
                res.status(422);
            }
            else if (e instanceof InvalidPermissionError_1.InvalidPermissionError) {
                this.setCode(StatusCode.INVALID_PERMISSION);
                res.status(403);
            }
            else if (e instanceof InvalidSessionError_1.InvalidSessionError) {
                this.setCode(StatusCode.INVALID_SESSION);
                res.status(403);
            }
            else if (e instanceof ResourceNotFoundError_1.ResourceNotFoundError) {
                this.setCode(StatusCode.RESOURCE_NOT_FOUND);
                res.status(404);
            }
            else {
                console.error(e);
                res.status(500);
            }
            this.setMessage(e.message);
        };
        this.handleExpressSuccess = (message, res) => {
            this.setMessage(message);
            this.setCode(StatusCode.SUCCESS);
            this.setSuccess(true);
            res.status(200);
        };
        this.toObject = () => {
            return {
                data: this.data,
                ...this.meta
            };
        };
    }
}
exports.ResponseBuilder = ResponseBuilder;
//# sourceMappingURL=ResponseBuilder.js.map