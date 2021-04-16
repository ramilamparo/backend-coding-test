"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = __importDefault(require("./schema"));
const handlerResolver_1 = require("../../libs/handlerResolver");
exports.default = {
    handler: `${handlerResolver_1.handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: "post",
                path: "hello",
                request: {
                    schema: {
                        "application/json": schema_1.default
                    }
                }
            }
        }
    ]
};
//# sourceMappingURL=index.js.map