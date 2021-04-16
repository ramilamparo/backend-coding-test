import { app, auth } from "firebase-admin";
export interface FirebaseAuthUserAttributes {
    email: string;
    uid: string;
}
export declare class FirebaseAuth {
    private auth;
    private constructor();
    private static firebase;
    static create: (app: app.App) => FirebaseAuth;
    createUser: (email: string, password: string) => Promise<FirebaseAuthUserAttributes>;
    getUser: (firebaseId: string) => Promise<auth.UserRecord>;
    deleteUser: (firebaseId: string) => Promise<void>;
    verifySessionToken: (cookie: string) => Promise<{
        email: string;
    }>;
    signIn: (email: string, password: string) => Promise<string>;
}
