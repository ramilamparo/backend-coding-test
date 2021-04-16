"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireRoleMiddleware = void 0;
const InvalidPermissionError_1 = require("@app/exceptions/InvalidPermissionError");
const InvalidSessionError_1 = require("@app/exceptions/InvalidSessionError");
const ResponseBuilder_1 = require("@libs/ResponseBuilder");
class RequireRoleMiddleware {
    static use(role) {
        return (req, res, next) => {
            try {
                if (!req.user) {
                    throw new InvalidSessionError_1.InvalidSessionError();
                }
                const userRole = req.user.role;
                if (Array.isArray(role)) {
                    if (!role.includes(userRole)) {
                        throw new InvalidPermissionError_1.InvalidPermissionError();
                    }
                }
                else if (role !== userRole) {
                    throw new InvalidPermissionError_1.InvalidPermissionError();
                }
            }
            catch (e) {
                const response = new ResponseBuilder_1.ResponseBuilder();
                response.handleExpressError(e, res);
                return res.json(response.toObject());
            }
            next();
        };
    }
}
exports.RequireRoleMiddleware = RequireRoleMiddleware;
//# sourceMappingURL=RequireRoleMiddleware.js.map