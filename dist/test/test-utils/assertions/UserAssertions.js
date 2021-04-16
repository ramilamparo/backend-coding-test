"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAssertions = void 0;
const _type_utils_1 = require("../../../src/types");
const User_1 = require("../../../src/db/User");
class UserAssertions {
}
exports.UserAssertions = UserAssertions;
UserAssertions.expectIsUserAttributesEqualTo = (user1, user2) => {
    Object.keys(user1).forEach((key) => {
        expect(user1[key]).toStrictEqual(user2[key]);
    });
};
UserAssertions.expectUserAttributesToNotHavePassword = (user) => {
    expect(user.password).toBeUndefined();
};
UserAssertions.expectUserToHaveFirebaseId = (user) => {
    expect(user.firebaseId).toBeDefined();
};
UserAssertions.expectUserToHaveUniqueId = (user) => {
    expect(user.id).toBeDefined();
};
//# sourceMappingURL=UserAssertions.js.map