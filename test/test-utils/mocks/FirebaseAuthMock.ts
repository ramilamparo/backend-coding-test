import { v4 as uuidv4 } from "uuid";
import { FirebaseAppMock } from "./FirebaseAppMock";

export class FirebaseAuthMock extends FirebaseAppMock {
	private static getIdTokenMock = jest.fn(() => Promise.resolve(uuidv4()));
	private static signInWithEmailAndPasswordMock = jest.fn<
		any,
		[string, string]
	>(() =>
		Promise.resolve({ user: { getIdToken: FirebaseAuthMock.getIdTokenMock } })
	);

	private static authMock = jest.fn(() => ({
		signInWithEmailAndPassword: FirebaseAuthMock.signInWithEmailAndPasswordMock
	}));

	private static firebaseClientAppMock = jest.fn(() => ({
		auth: FirebaseAuthMock.authMock
	}));

	private static firebaseClientMock = jest.mock("firebase", () => ({
		initializeApp: FirebaseAuthMock.firebaseClientAppMock
	}));

	public static resetMocks = () => {
		FirebaseAppMock.authCreateUserMock.mockClear();
		FirebaseAppMock.authDeleteUserMock.mockClear();
		FirebaseAppMock.authVerifyIdTokenMock.mockClear();
		FirebaseAppMock.users = [];
	};

	public static hasCreatedUser = (email: string, password: string) => {
		return FirebaseAppMock.authCreateUserMock.mock.calls.some((parameters) => {
			const { email: emailParam, password: passwordParam } = parameters[0];
			return email === emailParam && password === passwordParam;
		});
	};

	public static hasDeletedUser = (userId: string) => {
		return FirebaseAppMock.authDeleteUserMock.mock.calls.some((parameters) => {
			const firebaseUserId = parameters[0];
			return firebaseUserId === userId;
		});
	};

	public static mockVerifySessionCookieReturnValueOnce = (returnedData: {
		email: string;
	}) => {
		FirebaseAppMock.authVerifyIdTokenMock.mockReturnValueOnce(returnedData);
	};

	public static hasVerifiedCookie = (cookie: string) => {
		return FirebaseAppMock.authVerifyIdTokenMock.mock.calls.some((params) => {
			const cookieParam = params[0];

			return cookie === cookieParam;
		});
	};

	public static mockVerifySessionCookieRejectOnce = () => {
		FirebaseAppMock.authVerifyIdTokenMock.mockImplementationOnce(() => {
			return Promise.reject();
		});
	};

	public static hasSignedInWith = (email: string, password: string) => {
		return FirebaseAuthMock.signInWithEmailAndPasswordMock.mock.calls.some(
			(params) => {
				const emailParam = params[0];
				const passwordParam = params[1];
				return emailParam === email && password === passwordParam;
			}
		);
	};

	public static mockInvalidSignInOnce = () => {
		FirebaseAuthMock.signInWithEmailAndPasswordMock.mockRejectedValueOnce(
			new Error()
		);
	};

	public static mockGetIdTokenResponseOnce = (token: string) => {
		FirebaseAuthMock.getIdTokenMock.mockResolvedValueOnce(token);
	};
}
