import { serviceAccount } from "@config/firebase";
import * as firebase from "firebase-admin";
import { FirebaseAuth } from "./FirebaseAuth";
import { FirebaseFirestore } from "./FirebaseFirestore";

export class FirebaseFactory {
	private static firebaseApp = firebase.initializeApp({
		credential: firebase.credential.cert(serviceAccount)
	});

	public static getFirebaseAuth = () => {
		return FirebaseAuth.create(FirebaseFactory.firebaseApp);
	};

	public static getFirebaseFirestore = () => {
		return FirebaseFirestore.create(FirebaseFactory.firebaseApp);
	};
}
