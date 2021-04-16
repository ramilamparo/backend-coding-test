"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseAuth = void 0;
const firebase_1 = __importDefault(require("firebase"));
const InvalidSessionError_1 = require("@app/exceptions/InvalidSessionError");
const InvalidParametersError_1 = require("@app/exceptions/InvalidParametersError");
const firebase_2 = require("@config/firebase");
class FirebaseAuth {
    constructor(auth) {
        this.auth = auth;
        this.createUser = async (email, password) => {
            const user = await this.auth.createUser({
                email,
                password
            });
            if (!user.email) {
                throw new Error("Email is not provided!");
            }
            return {
                email: user.email,
                uid: user.uid
            };
        };
        this.getUser = async (firebaseId) => {
            const foundUser = await this.auth.getUser(firebaseId);
            return foundUser;
        };
        this.deleteUser = async (firebaseId) => {
            await this.auth.deleteUser(firebaseId);
        };
        this.verifySessionToken = async (cookie) => {
            try {
                const user = await this.auth.verifySessionCookie(cookie);
                if (!user.email) {
                    throw new Error("User did not sign up with email.");
                }
                return {
                    email: user.email
                };
            }
            catch (e) {
                throw new InvalidSessionError_1.InvalidSessionError();
            }
        };
        this.signIn = async (email, password) => {
            var _a;
            try {
                const userCredential = await FirebaseAuth.firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password);
                const sessionToken = await ((_a = userCredential.user) === null || _a === void 0 ? void 0 : _a.getIdToken(true));
                if (sessionToken) {
                    return sessionToken;
                }
            }
            catch (e) {
                throw new InvalidParametersError_1.InvalidParametersError();
            }
            throw new Error("Cannot sign in user.");
        };
    }
}
exports.FirebaseAuth = FirebaseAuth;
FirebaseAuth.firebase = firebase_1.default.initializeApp(firebase_2.client);
FirebaseAuth.create = (app) => {
    return new FirebaseAuth(app.auth());
};
//# sourceMappingURL=FirebaseAuth.js.map