import * as firebase from "firebase-admin";
import { v4 as uuidv4 } from "uuid";

interface User {
	id: string;
	value: firebase.auth.CreateRequest;
}

interface Docs<T> {
	name: string;
	collection: string;
	value: T;
}

export class FirebaseAppMock {
	protected static users: User[] = [];
	protected static docs: Docs<object>[] = [];

	protected static credentialCertMock = jest.fn();

	protected static authCreateUserMock = jest.fn(
		(user: firebase.auth.CreateRequest) => {
			const newUser = {
				id: uuidv4(),
				value: user
			};
			FirebaseAppMock.users.push(newUser);
			return Promise.resolve({ uid: newUser.id, ...user });
		}
	);

	protected static authVerifyIdTokenMock = jest.fn();

	protected static authDeleteUserMock = jest.fn((userId: string) => {
		const userIndex = FirebaseAppMock.users.findIndex(
			(user) => user.id === userId
		);
		if (userIndex >= 0) {
			FirebaseAppMock.users.splice(userIndex, 1);
		}
	});

	protected static authGetUserMock = jest.fn((userId: string) => {
		const foundUser = FirebaseAppMock.users.find((user) => user.id === userId);
		if (!foundUser) {
			return Promise.resolve(undefined);
		}
		return Promise.resolve({ uid: foundUser.id, ...foundUser.value });
	});

	protected static authMocks = jest.fn(() => ({
		createUser: FirebaseAppMock.authCreateUserMock,
		deleteUser: FirebaseAppMock.authDeleteUserMock,
		getUser: FirebaseAppMock.authGetUserMock,
		verifyIdToken: FirebaseAppMock.authVerifyIdTokenMock
	}));

	protected static docSetMock = jest.fn<unknown, [object, string]>(
		(newDoc, docName) => {
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
			return Promise.reject(
				new Error(`Document name ${docName} does not exist.`)
			);
		}
	);

	protected static docCreateMock = jest.fn((newDoc: object, docId: string) => {
		const collectionName = FirebaseAppMock.getLastCollectionNameUsed();
		const newData = {
			name: docId,
			collection: collectionName,
			value: newDoc
		};
		FirebaseAppMock.docs.push(newData);
		return Promise.resolve();
	});

	protected static docDeleteMock = jest.fn((docName: string) => {
		const existingDocIndex = FirebaseAppMock.docs.findIndex((doc) => {
			doc.name === docName;
		});
		FirebaseAppMock.docs.splice(existingDocIndex, 1);
	});

	protected static docGetMock = jest.fn(() => {
		const docName = FirebaseAppMock.getLastDocNameUsed();

		if (docName) {
			const foundDoc = FirebaseAppMock.docs.find((doc) => doc.name === docName);
			if (foundDoc) {
				return Promise.resolve({ id: foundDoc.name, ...foundDoc.value });
			}
		}

		return Promise.resolve();
	});

	protected static firestoreDocMock: jest.Mock = jest.fn<unknown, [string]>(
		(id: string = uuidv4()) => {
			return {
				create: (newDoc: object) => FirebaseAppMock.docCreateMock(newDoc, id),
				set: (newDoc: object) => FirebaseAppMock.docSetMock(newDoc, id),
				delete: FirebaseAppMock.docDeleteMock,
				get: FirebaseAppMock.docGetMock,
				id: id
			};
		}
	);

	protected static firestoreCollectionMock = jest.fn<unknown, unknown[]>(
		() => ({
			doc: FirebaseAppMock.firestoreDocMock
		})
	);

	protected static firestoreMocks = jest.fn(() => ({
		collection: FirebaseAppMock.firestoreCollectionMock
	}));

	protected static firebasemock = jest.mock("firebase-admin", () => ({
		initializeApp: () => ({
			auth: FirebaseAppMock.authMocks,
			firestore: FirebaseAppMock.firestoreMocks
		}),
		credential: {
			cert: FirebaseAppMock.credentialCertMock
		}
	}));

	protected static getLastDocNameUsed = () => {
		const lastDocCall =
			FirebaseAppMock.firestoreDocMock.mock.calls[
				FirebaseAppMock.firestoreDocMock.mock.calls.length - 1
			];
		const docName = lastDocCall[0];
		if (docName === undefined) {
			return null;
		}
		if (typeof docName !== "string") {
			throw new Error(`Invalid doc name ${docName}`);
		}
		return docName;
	};

	protected static getLastCollectionNameUsed = () => {
		const lastCollectionCall =
			FirebaseAppMock.firestoreCollectionMock.mock.calls[
				FirebaseAppMock.firestoreCollectionMock.mock.calls.length - 1
			];
		const collectionName: unknown = lastCollectionCall[0];
		if (typeof collectionName !== "string") {
			throw new Error(`Invalid collection name ${collectionName}`);
		}
		return collectionName;
	};
}
