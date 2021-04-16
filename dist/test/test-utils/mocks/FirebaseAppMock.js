"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseAppMock = void 0;
const uuid_1 = require("uuid");
class FirebaseAppMock {
}
exports.FirebaseAppMock = FirebaseAppMock;
FirebaseAppMock.users = [];
FirebaseAppMock.docs = [];
FirebaseAppMock.authCreateUserMock = jest.fn((user) => {
    const newUser = {
        id: uuid_1.v4(),
        value: user
    };
    FirebaseAppMock.users.push(newUser);
    return Promise.resolve({ uid: newUser.id, ...user });
});
FirebaseAppMock.authVerifySessionCookie = jest.fn();
FirebaseAppMock.authDeleteUserMock = jest.fn((userId) => {
    const userIndex = FirebaseAppMock.users.findIndex((user) => user.id === userId);
    if (userIndex >= 0) {
        FirebaseAppMock.users.splice(userIndex, 1);
    }
});
FirebaseAppMock.authGetUser = jest.fn((userId) => {
    const foundUser = FirebaseAppMock.users.find((user) => user.id === userId);
    if (!foundUser) {
        return Promise.resolve(undefined);
    }
    return Promise.resolve({ uid: foundUser.id, ...foundUser.value });
});
FirebaseAppMock.authMocks = jest.fn(() => ({
    createUser: FirebaseAppMock.authCreateUserMock,
    deleteUser: FirebaseAppMock.authDeleteUserMock,
    getUser: FirebaseAppMock.authGetUser,
    verifySessionCookie: FirebaseAppMock.authVerifySessionCookie
}));
FirebaseAppMock.docSetMock = jest.fn((newDoc, docName) => {
    if (docName) {
        const existingDocIndex = FirebaseAppMock.docs.findIndex((doc) => {
            return doc.name === docName;
        });
        if (existingDocIndex >= 0) {
            const document = FirebaseAppMock.docs[existingDocIndex];
            FirebaseAppMock.docs[existingDocIndex] = {
                ...document,
                value: {
                    ...document.value,
                    ...newDoc
                }
            };
            return Promise.resolve();
        }
    }
    return Promise.reject(new Error(`Document name ${docName} does not exist.`));
});
FirebaseAppMock.docCreateMock = jest.fn((newDoc, docId) => {
    const collectionName = FirebaseAppMock.getLastCollectionNameUsed();
    const newData = {
        name: docId,
        collection: collectionName,
        value: newDoc
    };
    FirebaseAppMock.docs.push(newData);
    return Promise.resolve();
});
FirebaseAppMock.docDeleteMock = jest.fn((docName) => {
    const existingDocIndex = FirebaseAppMock.docs.findIndex((doc) => {
        doc.name === docName;
    });
    FirebaseAppMock.docs.splice(existingDocIndex, 1);
});
FirebaseAppMock.docGetMock = jest.fn(() => {
    const docName = FirebaseAppMock.getLastDocNameUsed();
    if (docName) {
        const foundDoc = FirebaseAppMock.docs.find((doc) => doc.name === docName);
        if (foundDoc) {
            return Promise.resolve({ id: foundDoc.name, ...foundDoc.value });
        }
    }
    return Promise.resolve();
});
FirebaseAppMock.firestoreDocMock = jest.fn((id = uuid_1.v4()) => {
    return {
        create: (newDoc) => FirebaseAppMock.docCreateMock(newDoc, id),
        set: (newDoc) => FirebaseAppMock.docSetMock(newDoc, id),
        delete: FirebaseAppMock.docDeleteMock,
        get: FirebaseAppMock.docGetMock,
        id: id
    };
});
FirebaseAppMock.firestoreCollectionMock = jest.fn(() => ({
    doc: FirebaseAppMock.firestoreDocMock
}));
FirebaseAppMock.firestoreMocks = jest.fn(() => ({
    collection: FirebaseAppMock.firestoreCollectionMock
}));
FirebaseAppMock.firebasemock = jest.mock("firebase-admin", () => ({
    initializeApp: () => ({
        auth: FirebaseAppMock.authMocks,
        firestore: FirebaseAppMock.firestoreMocks
    })
}));
FirebaseAppMock.getLastDocNameUsed = () => {
    const lastDocCall = FirebaseAppMock.firestoreDocMock.mock.calls[FirebaseAppMock.firestoreDocMock.mock.calls.length - 1];
    const docName = lastDocCall[0];
    if (docName === undefined) {
        return null;
    }
    if (typeof docName !== "string") {
        throw new Error(`Invalid doc name ${docName}`);
    }
    return docName;
};
FirebaseAppMock.getLastCollectionNameUsed = () => {
    const lastCollectionCall = FirebaseAppMock.firestoreCollectionMock.mock.calls[FirebaseAppMock.firestoreCollectionMock.mock.calls.length - 1];
    const collectionName = lastCollectionCall[0];
    if (typeof collectionName !== "string") {
        throw new Error(`Invalid collection name ${collectionName}`);
    }
    return collectionName;
};
//# sourceMappingURL=FirebaseAppMock.js.map