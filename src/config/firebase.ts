import { ServiceAccount } from "firebase-admin";

const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY;
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

export const serviceAccount: ServiceAccount = {
	clientEmail: FIREBASE_CLIENT_EMAIL,
	privateKey: (FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
	projectId: FIREBASE_PROJECT_ID
};

export const client = {
	apiKey: "AIzaSyCNIRjeB5qCnfRE4Zc3n79hP7hq1tw2vx0",
	authDomain: "backend-coding-test.firebaseapp.com",
	projectId: "backend-coding-test",
	storageBucket: "backend-coding-test.appspot.com",
	messagingSenderId: "514918828737",
	appId: "1:514918828737:web:42dfc4203ba430bdb7a240",
	measurementId: "G-M0F8WHTSDK"
};
