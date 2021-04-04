import { FirebaseAppMock } from "./FirebaseAppMock";

export class FirebaseFirestoreMock extends FirebaseAppMock {
	public static resetMocks = () => {
		FirebaseAppMock.firestoreCollectionMock.mockClear();
		FirebaseAppMock.firestoreDocMock.mockClear();
		FirebaseAppMock.docSetMock.mockClear();
		FirebaseAppMock.docs = [];
	};

	public static hasCalledCollection = (collectionName: string) => {
		return FirebaseAppMock.firestoreCollectionMock.mock.calls.some(
			(parameters) => {
				const collectionNameParam = parameters[0];

				return collectionName === collectionNameParam;
			}
		);
	};

	public static hasCalledCollectionSetWith = <T>(item: T) => {
		return FirebaseAppMock.docSetMock.mock.calls.some((parameter) => {
			const firstParameter: T = (parameter[0] as unknown) as T;

			if (item !== null && typeof item === "object") {
				return (Object.keys(item) as Array<keyof T>).every((key) => {
					return item[key] === firstParameter[key];
				});
			}

			return item === firstParameter;
		});
	};

	public static hasCalledCollectionDocCreateWith = <T>(item: T) => {
		return FirebaseAppMock.docCreateMock.mock.calls.some((parameter) => {
			const firstParameter: T = (parameter[0] as unknown) as T;

			if (item !== null && typeof item === "object") {
				return (Object.keys(item) as Array<keyof T>).every((key) => {
					return item[key] === firstParameter[key];
				});
			}

			return item === firstParameter;
		});
	};

	public static hasCalledCollectionDoc = (docName: string) => {
		return FirebaseAppMock.firestoreDocMock.mock.calls.some((parameters) => {
			const docNameParameter = parameters[0];
			return docName === docNameParameter;
		});
	};

	public static hasDeletedDocument = (
		collectionName: string,
		docName: string
	) => {
		const hasCalledCollection = FirebaseFirestoreMock.hasCalledCollection(
			collectionName
		);
		const hasCalledDocument = FirebaseFirestoreMock.hasCalledCollectionDoc(
			docName
		);
		const hasCalledDelete = FirebaseAppMock.docDeleteMock.mock.calls.length > 0;

		return hasCalledCollection && hasCalledDocument && hasCalledDelete;
	};
}
