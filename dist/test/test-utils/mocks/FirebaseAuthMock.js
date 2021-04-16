"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseAuthMock = void 0;
const uuid_1 = require("uuid");
const FirebaseAppMock_1 = require("./FirebaseAppMock");
class FirebaseAuthMock extends FirebaseAppMock_1.FirebaseAppMock {
}
exports.FirebaseAuthMock = FirebaseAuthMock;
FirebaseAuthMock.getIdTokenMock = jest.fn(() => Promise.resolve(uuid_1.v4()));
FirebaseAuthMock.signInWithEmailAndPasswordMock = jest.fn(() => Promise.resolve({ user: { getIdToken: FirebaseAuthMock.getIdTokenMock } }));
FirebaseAuthMock.authMock = jest.fn(() => ({
    signInWithEmailAndPassword: FirebaseAuthMock.signInWithEmailAndPasswordMock
}));
FirebaseAuthMock.firebaseClientAppMock = jest.fn(() => ({
    auth: FirebaseAuthMock.authMock
}));
FirebaseAuthMock.firebaseClientMock = jest.mock("firebase", () => ({
    initializeApp: FirebaseAuthMock.firebaseClientAppMock
}));
FirebaseAuthMock.resetMocks = () => {
    FirebaseAppMock_1.FirebaseAppMock.authCreateUserMock.mockClear();
    FirebaseAppMock_1.FirebaseAppMock.authDeleteUserMock.mockClear();
    FirebaseAppMock_1.FirebaseAppMock.authVerifySessionCookie.mockClear();
    FirebaseAppMock_1.FirebaseAppMock.users = [];
};
FirebaseAuthMock.hasCreatedUser = (email, password) => {
    return FirebaseAppMock_1.FirebaseAppMock.authCreateUserMock.mock.calls.some((parameters) => {
        const { email: emailParam, password: passwordParam } = parameters[0];
        return email === emailParam && password === passwordParam;
    });
};
FirebaseAuthMock.hasDeletedUser = (userId) => {
    return FirebaseAppMock_1.FirebaseAppMock.authDeleteUserMock.mock.calls.some((parameters) => {
        const firebaseUserId = parameters[0];
        return firebaseUserId === userId;
    });
};
FirebaseAuthMock.mockVerifySessionCookieReturnValueOnce = (returnedData) => {
    FirebaseAppMock_1.FirebaseAppMock.authVerifySessionCookie.mockReturnValueOnce(returnedData);
};
FirebaseAuthMock.hasVerifiedCookie = (cookie) => {
    return FirebaseAppMock_1.FirebaseAppMock.authVerifySessionCookie.mock.calls.some((params) => {
        const cookieParam = params[0];
        return cookie === cookieParam;
    });
};
FirebaseAuthMock.mockVerifySessionCookieRejectOnce = () => {
    FirebaseAppMock_1.FirebaseAppMock.authVerifySessionCookie.mockImplementationOnce(() => {
        return Promise.reject();
    });
};
FirebaseAuthMock.hasSignedInWith = (email, password) => {
    return FirebaseAuthMock.signInWithEmailAndPasswordMock.mock.calls.some((params) => {
        const emailParam = params[0];
        const passwordParam = params[1];
        return emailParam === email && password === passwordParam;
    });
};
FirebaseAuthMock.mockInvalidSignInOnce = () => {
    FirebaseAuthMock.signInWithEmailAndPasswordMock.mockRejectedValueOnce(new Error());
};
FirebaseAuthMock.mockGetIdTokenResponseOnce = (token) => {
    FirebaseAuthMock.getIdTokenMock.mockResolvedValueOnce(token);
};
//# sourceMappingURL=FirebaseAuthMock.js.map