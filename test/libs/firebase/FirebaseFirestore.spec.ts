import { FirebaseFirestoreMock } from "@test-utils/mocks/FirebaseFirestoreMock";
import { FirebaseFactory } from "@libs/firebase/FirebaseFactory";

describe("FirebaseFirestore", () => {
	const firebaseFirestore = FirebaseFactory.getFirebaseFirestore();
	afterEach(() => {
		FirebaseFirestoreMock.resetMocks();
	});

	it("Creates a document on a collection", async () => {
		const COLLECTION_NAME = "blog-posts";
		const COLLECTION_DOCUMENT = { title: "TEST" };

		const newDocument = await firebaseFirestore.create(
			COLLECTION_NAME,
			COLLECTION_DOCUMENT
		);

		expect(newDocument.id).toBeDefined();
		expect(newDocument.title).toEqual(COLLECTION_DOCUMENT.title);
		expect(
			FirebaseFirestoreMock.hasCalledCollection(COLLECTION_NAME)
		).toBeTruthy();
		expect(
			FirebaseFirestoreMock.hasCalledCollectionDocCreateWith(
				COLLECTION_DOCUMENT
			)
		).toBeTruthy();
	});

	it("Reads a document on a collection", async () => {
		const COLLECTION_NAME = "blog-posts";
		const COLLECTION_DOCUMENT = { title: "TEST" };

		const newDocument = await firebaseFirestore.create(
			COLLECTION_NAME,
			COLLECTION_DOCUMENT
		);
		const foundDocument = await firebaseFirestore.getOne<
			typeof COLLECTION_DOCUMENT
		>(COLLECTION_NAME, newDocument.id);

		if (!foundDocument) {
			throw new Error(`Document ${newDocument.id} not found!`);
		}

		expect(foundDocument.title).toEqual(foundDocument.title);
		expect(
			FirebaseFirestoreMock.hasCalledCollection(COLLECTION_NAME)
		).toBeTruthy();
		expect(
			FirebaseFirestoreMock.hasCalledCollectionDoc(newDocument.id)
		).toBeTruthy();
	});

	it("Updates a document on a collection", async () => {
		const COLLECTION_NAME = "blog-posts";
		const COLLECTION_DOCUMENT = { title: "TEST" };
		const UPDATE_COLLECTION_DOCUMENT = { title: "TEST2" };

		const newDocument = await firebaseFirestore.create(
			COLLECTION_NAME,
			COLLECTION_DOCUMENT
		);
		const updatedDocument = await firebaseFirestore.update(
			COLLECTION_NAME,
			newDocument.id,
			UPDATE_COLLECTION_DOCUMENT
		);
		const foundDocument = await firebaseFirestore.getOne<
			typeof COLLECTION_DOCUMENT & { id: string }
		>(COLLECTION_NAME, newDocument.id);

		if (!foundDocument) {
			throw new Error("Document not found!");
		}

		expect(foundDocument.id).toBeDefined();
		expect(updatedDocument.title).toEqual(foundDocument.title);
		expect(
			FirebaseFirestoreMock.hasCalledCollection(COLLECTION_NAME)
		).toBeTruthy();
		expect(
			FirebaseFirestoreMock.hasCalledCollectionDoc(newDocument.id)
		).toBeTruthy();
		expect(
			FirebaseFirestoreMock.hasCalledCollectionSetWith(
				UPDATE_COLLECTION_DOCUMENT
			)
		).toBeTruthy();
	});

	it("Deletes a record on a collection", async () => {
		const COLLECTION_NAME = "blog-posts";
		const COLLECTION_DOCUMENT = { title: "TEST" };

		const newDocument = await firebaseFirestore.create(
			COLLECTION_NAME,
			COLLECTION_DOCUMENT
		);
		await firebaseFirestore.delete(COLLECTION_NAME, newDocument.id);
		const foundDocument = await firebaseFirestore.getOne(
			COLLECTION_NAME,
			newDocument.id
		);

		expect(foundDocument).toBeUndefined();
		expect(
			FirebaseFirestoreMock.hasDeletedDocument(COLLECTION_NAME, newDocument.id)
		);
	});
});
