"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseSessionMiddleware = void 0;
const User_1 = require("../../db/User");
const FirebaseFactory_1 = require("../../libs/firebase/FirebaseFactory");
const common_1 = require("@nestjs/common");
const _type_utils_1 = require("../../types");
let ParseSessionMiddleware = class ParseSessionMiddleware {
    async use(req, res, next) {
        const sessionCookie = req.cookies.session || "";
        try {
            const firebaseUser = await FirebaseFactory_1.FirebaseFactory.getFirebaseAuth().verifySessionToken(sessionCookie);
            const user = await User_1.User.findOneOrFail({ email: firebaseUser.email });
            req.user = {
                email: user.email,
                role: user.role
            };
        }
        catch (e) {
        }
        next();
    }
};
ParseSessionMiddleware = __decorate([
    common_1.Injectable()
], ParseSessionMiddleware);
exports.ParseSessionMiddleware = ParseSessionMiddleware;
//# sourceMappingURL=ParseSessionMiddleware.js.map