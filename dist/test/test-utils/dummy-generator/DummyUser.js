"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyUser = void 0;
const faker = __importStar(require("faker"));
const uuid_1 = require("uuid");
const DateUtils_1 = require("../../../src/libs/DateUtils");
const auth_controller_1 = require("../../../src/app/auth/auth.controller");
class DummyUser {
    constructor(attributes) {
        this.email = attributes.email;
        this.dateOfBirth = attributes.dateOfBirth;
        this.firebaseId = attributes.firebaseId;
        this.password = attributes.password;
        this.id = attributes.id;
        this.role = attributes.role;
    }
}
exports.DummyUser = DummyUser;
DummyUser.createDummyData = (attributes) => {
    const email = faker.unique(faker.internet.email).toLowerCase();
    const uniqueId = uuid_1.v4();
    return new DummyUser({
        dateOfBirth: DateUtils_1.DateUtils.dateToUnix(new Date()),
        id: DateUtils_1.DateUtils.dateToUnix(new Date()),
        password: uniqueId,
        email: email,
        firebaseId: uniqueId,
        role: DummyUser.getRandomRole(),
        ...attributes
    });
};
DummyUser.getRandomRole = () => {
    return faker.random.arrayElement(["admin", "standard"]);
};
//# sourceMappingURL=DummyUser.js.map