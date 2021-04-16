"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseFirestoreMock = void 0;
const FirebaseAppMock_1 = require("./FirebaseAppMock");
class FirebaseFirestoreMock extends FirebaseAppMock_1.FirebaseAppMock {
}
exports.FirebaseFirestoreMock = FirebaseFirestoreMock;
FirebaseFirestoreMock.resetMocks = () => {
    FirebaseAppMock_1.FirebaseAppMock.firestoreCollectionMock.mockClear();
    FirebaseAppMock_1.FirebaseAppMock.firestoreDocMock.mockClear();
    FirebaseAppMock_1.FirebaseAppMock.docSetMock.mockClear();
    FirebaseAppMock_1.FirebaseAppMock.docs = [];
};
FirebaseFirestoreMock.hasCalledCollection = (collectionName) => {
    return FirebaseAppMock_1.FirebaseAppMock.firestoreCollectionMock.mock.calls.some((parameters) => {
        const collectionNameParam = parameters[0];
        return collectionName === collectionNameParam;
    });
};
FirebaseFirestoreMock.hasCalledCollectionSetWith = (item) => {
    return FirebaseAppMock_1.FirebaseAppMock.docSetMock.mock.calls.some((parameter) => {
        const firstParameter = parameter[0];
        if (item !== null && typeof item === "object") {
            return Object.keys(item).every((key) => {
                return item[key] === firstParameter[key];
            });
        }
        return item === firstParameter;
    });
};
FirebaseFirestoreMock.hasCalledCollectionDocCreateWith = (item) => {
    return FirebaseAppMock_1.FirebaseAppMock.docCreateMock.mock.calls.some((parameter) => {
        const firstParameter = parameter[0];
        if (item !== null && typeof item === "object") {
            return Object.keys(item).every((key) => {
                return item[key] === firstParameter[key];
            });
        }
        return item === firstParameter;
    });
};
FirebaseFirestoreMock.hasCalledCollectionDoc = (docName) => {
    return FirebaseAppMock_1.FirebaseAppMock.firestoreDocMock.mock.calls.some((parameters) => {
        const docNameParameter = parameters[0];
        return docName === docNameParameter;
    });
};
FirebaseFirestoreMock.hasDeletedDocument = (collectionName, docName) => {
    const hasCalledCollection = FirebaseFirestoreMock.hasCalledCollection(collectionName);
    const hasCalledDocument = FirebaseFirestoreMock.hasCalledCollectionDoc(docName);
    const hasCalledDelete = FirebaseAppMock_1.FirebaseAppMock.docDeleteMock.mock.calls.length > 0;
    return hasCalledCollection && hasCalledDocument && hasCalledDelete;
};
//# sourceMappingURL=FirebaseFirestoreMock.js.map