"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireFirebaseSessionMiddleware = void 0;
const ResponseBuilder_1 = require("@libs/ResponseBuilder");
const common_1 = require("@nestjs/common");
let RequireFirebaseSessionMiddleware = class RequireFirebaseSessionMiddleware {
    use(req, res, next) {
        if (!req.user) {
            const response = new ResponseBuilder_1.ResponseBuilder(null, {
                code: ResponseBuilder_1.StatusCode.INVALID_SESSION,
                message: "You are not logged in.",
                success: false
            });
            return res.json(response.toObject());
        }
        next();
    }
};
RequireFirebaseSessionMiddleware = __decorate([
    common_1.Injectable()
], RequireFirebaseSessionMiddleware);
exports.RequireFirebaseSessionMiddleware = RequireFirebaseSessionMiddleware;
//# sourceMappingURL=RequireFirebaseSessionMiddleware.js.map