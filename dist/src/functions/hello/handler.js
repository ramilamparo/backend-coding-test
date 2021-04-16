"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
require("source-map-support/register");
const apiGateway_1 = require("../../libs/apiGateway");
const apiGateway_2 = require("../../libs/apiGateway");
const lambda_1 = require("../../libs/lambda");
const hello = async (event) => {
    return apiGateway_2.formatJSONResponse({
        message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
        event
    });
};
exports.main = lambda_1.middyfy(hello);
//# sourceMappingURL=handler.js.map