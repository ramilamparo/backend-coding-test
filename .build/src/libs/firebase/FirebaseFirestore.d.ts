import { app } from "firebase-admin";
export interface FirebaseBlogPostCreateAttributes {
    title: string;
}
export interface FirebaseBlogPostAttributes extends FirebaseBlogPostCreateAttributes {
    uid: string;
}
export declare class FirebaseFirestore {
    private firestore;
    private constructor();
    static create: (app: app.App) => FirebaseFirestore;
    create: <T>(collectionName: string, documentValue: T) => Promise<{
        id: string;
    } & T>;
    getOne: <T>(collectionName: string, documentId: string) => Promise<T | undefined>;
    update: <T>(collectionName: string, documentId: string, newValue: Partial<T>) => Promise<T>;
    delete: (collectionName: string, documentId: string) => Promise<void>;
}
