import { FirebaseAppMock } from "./FirebaseAppMock";
export declare class FirebaseFirestoreMock extends FirebaseAppMock {
    static resetMocks: () => void;
    static hasCalledCollection: (collectionName: string) => boolean;
    static hasCalledCollectionSetWith: <T>(item: T) => boolean;
    static hasCalledCollectionDocCreateWith: <T>(item: T) => boolean;
    static hasCalledCollectionDoc: (docName: string) => boolean;
    static hasDeletedDocument: (collectionName: string, docName: string) => boolean;
}
