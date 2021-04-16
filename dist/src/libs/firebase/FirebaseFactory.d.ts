import { FirebaseAuth } from "./FirebaseAuth";
import { FirebaseFirestore } from "./FirebaseFirestore";
export declare class FirebaseFactory {
    private static firebaseApp;
    static getFirebaseAuth: () => FirebaseAuth;
    static getFirebaseFirestore: () => FirebaseFirestore;
}
