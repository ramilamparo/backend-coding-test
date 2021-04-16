"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const InvalidParametersError_1 = require("../exceptions/InvalidParametersError");
const FirebaseFactory_1 = require("../../libs/firebase/FirebaseFactory");
const common_1 = require("@nestjs/common");
const _type_utils_1 = require("../../types");
const User_1 = require("../../db/User");
const firebaseAuth = FirebaseFactory_1.FirebaseFactory.getFirebaseAuth();
let AuthService = class AuthService {
    constructor() {
        this.createUser = async (email, password, dateOfBirth, role) => {
            const newFirebaseUser = await firebaseAuth.createUser(email, password);
            const newUser = User_1.User.create({
                email: newFirebaseUser.email,
                dateOfBirth,
                firebaseId: newFirebaseUser.uid,
                role
            });
            await newUser.save();
            return newUser;
        };
        this.signIn = async (email, password) => {
            const auth = FirebaseFactory_1.FirebaseFactory.getFirebaseAuth();
            const token = await auth.signIn(email, password);
            const userData = await this.getUserByEmail(email);
            return {
                email,
                dateOfBirth: userData.dateOfBirth,
                role: userData.role,
                id: userData.id,
                firebaseId: userData.firebaseId,
                token
            };
        };
        this.getUserByEmail = async (email) => {
            try {
                const foundUser = await User_1.User.findOneOrFail({
                    where: {
                        email
                    }
                });
                return foundUser;
            }
            catch (e) {
                throw new InvalidParametersError_1.InvalidParametersError();
            }
        };
    }
};
AuthService = __decorate([
    common_1.Injectable()
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map