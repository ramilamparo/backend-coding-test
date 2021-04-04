import { app, firestore } from "firebase-admin";

export interface FirebaseBlogPostCreateAttributes {
	title: string;
}

export interface FirebaseBlogPostAttributes
	extends FirebaseBlogPostCreateAttributes {
	uid: string;
}

export class FirebaseFirestore {
	private constructor(private firestore: firestore.Firestore) {}

	public static create = (app: app.App) => {
		return new FirebaseFirestore(app.firestore());
	};

	public create = async <T>(collectionName: string, documentValue: T) => {
		const newDocument = this.firestore.collection(collectionName).doc();
		await newDocument.create(documentValue);
		return {
			id: newDocument.id,
			...documentValue
		};
	};

	public getOne = async <T>(
		collectionName: string,
		documentId: string
	): Promise<T | undefined> => {
		const foundDocument = ((await this.firestore
			.collection(collectionName)
			.doc(documentId)
			.get()) as unknown) as T;

		return foundDocument;
	};

	public update = async <T>(
		collectionName: string,
		documentId: string,
		newValue: Partial<T>
	) => {
		await this.firestore
			.collection(collectionName)
			.doc(documentId)
			.set(newValue, {
				merge: true
			});
		const found = await this.getOne<T>(collectionName, documentId);
		if (!found) {
			throw new Error("Cannot update collection!");
		}
		return found;
	};

	public delete = async (collectionName: string, documentId: string) => {
		await this.firestore.collection(collectionName).doc(documentId).delete();
	};
}
