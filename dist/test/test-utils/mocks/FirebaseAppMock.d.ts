/// <reference types="jest" />
import * as firebase from "firebase-admin";
interface User {
    id: string;
    value: firebase.auth.CreateRequest;
}
interface Docs<T> {
    name: string;
    collection: string;
    value: T;
}
export declare class FirebaseAppMock {
    protected static users: User[];
    protected static docs: Docs<object>[];
    protected static authCreateUserMock: jest.Mock<Promise<{
        uid: string;
        multiFactor?: firebase.auth.MultiFactorCreateSettings | undefined;
        disabled?: boolean | undefined;
        displayName?: string | null | undefined;
        email?: string | undefined;
        emailVerified?: boolean | undefined;
        password?: string | undefined;
        phoneNumber?: string | null | undefined;
        photoURL?: string | null | undefined;
        providerToLink?: firebase.auth.UserProvider | undefined;
        providersToUnlink?: string[] | undefined;
    }>, [user: firebase.auth.CreateRequest]>;
    protected static authVerifySessionCookie: jest.Mock<any, any>;
    protected static authDeleteUserMock: jest.Mock<void, [userId: string]>;
    protected static authGetUser: jest.Mock<Promise<undefined> | Promise<{
        uid: string;
        multiFactor?: firebase.auth.MultiFactorCreateSettings | undefined;
        disabled?: boolean | undefined;
        displayName?: string | null | undefined;
        email?: string | undefined;
        emailVerified?: boolean | undefined;
        password?: string | undefined;
        phoneNumber?: string | null | undefined;
        photoURL?: string | null | undefined;
        providerToLink?: firebase.auth.UserProvider | undefined;
        providersToUnlink?: string[] | undefined;
    }>, [userId: string]>;
    protected static authMocks: jest.Mock<{
        createUser: jest.Mock<Promise<{
            uid: string;
            multiFactor?: firebase.auth.MultiFactorCreateSettings | undefined;
            disabled?: boolean | undefined;
            displayName?: string | null | undefined;
            email?: string | undefined;
            emailVerified?: boolean | undefined;
            password?: string | undefined;
            phoneNumber?: string | null | undefined;
            photoURL?: string | null | undefined;
            providerToLink?: firebase.auth.UserProvider | undefined;
            providersToUnlink?: string[] | undefined;
        }>, [user: firebase.auth.CreateRequest]>;
        deleteUser: jest.Mock<void, [userId: string]>;
        getUser: jest.Mock<Promise<undefined> | Promise<{
            uid: string;
            multiFactor?: firebase.auth.MultiFactorCreateSettings | undefined;
            disabled?: boolean | undefined;
            displayName?: string | null | undefined;
            email?: string | undefined;
            emailVerified?: boolean | undefined;
            password?: string | undefined;
            phoneNumber?: string | null | undefined;
            photoURL?: string | null | undefined;
            providerToLink?: firebase.auth.UserProvider | undefined;
            providersToUnlink?: string[] | undefined;
        }>, [userId: string]>;
        verifySessionCookie: jest.Mock<any, any>;
    }, []>;
    protected static docSetMock: jest.Mock<unknown, [object, string]>;
    protected static docCreateMock: jest.Mock<Promise<void>, [newDoc: object, docId: string]>;
    protected static docDeleteMock: jest.Mock<void, [docName: string]>;
    protected static docGetMock: jest.Mock<Promise<void> | Promise<{
        id: string;
    }>, []>;
    protected static firestoreDocMock: jest.Mock;
    protected static firestoreCollectionMock: jest.Mock<unknown, unknown[]>;
    protected static firestoreMocks: jest.Mock<{
        collection: jest.Mock<unknown, unknown[]>;
    }, []>;
    protected static firebasemock: typeof jest;
    protected static getLastDocNameUsed: () => string | null;
    protected static getLastCollectionNameUsed: () => string;
}
export {};
