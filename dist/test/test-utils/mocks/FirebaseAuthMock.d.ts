import { FirebaseAppMock } from "./FirebaseAppMock";
export declare class FirebaseAuthMock extends FirebaseAppMock {
    private static getIdTokenMock;
    private static signInWithEmailAndPasswordMock;
    private static authMock;
    private static firebaseClientAppMock;
    private static firebaseClientMock;
    static resetMocks: () => void;
    static hasCreatedUser: (email: string, password: string) => boolean;
    static hasDeletedUser: (userId: string) => boolean;
    static mockVerifySessionCookieReturnValueOnce: <T>(returnedData: T) => void;
    static hasVerifiedCookie: (cookie: string) => boolean;
    static mockVerifySessionCookieRejectOnce: () => void;
    static hasSignedInWith: (email: string, password: string) => boolean;
    static mockInvalidSignInOnce: () => void;
    static mockGetIdTokenResponseOnce: (token: string) => void;
}
