"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hello_1 = __importDefault(require("./src/functions/hello"));
const serverlessConfiguration = {
    service: "backend-coding-test",
    frameworkVersion: "2",
    custom: {
        webpack: {
            webpackConfig: "./webpack.config.js",
            includeModules: true
        }
    },
    plugins: ["serverless-webpack"],
    provider: {
        name: "aws",
        runtime: "nodejs14.x",
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1"
        },
        lambdaHashingVersion: "20201221"
    },
    functions: { hello: hello_1.default }
};
module.exports = serverlessConfiguration;
//# sourceMappingURL=serverless.js.map