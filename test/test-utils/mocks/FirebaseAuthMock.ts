import { v4 as uuidv4 } from "uuid";
import { FirebaseAppMock } from "./FirebaseAppMock";

export class FirebaseAuthMock extends FirebaseAppMock {
	private static signInWithEmailAndPasswordMock = jest.fn<
		any,
		[string, string]
	>(() =>
		Promise.resolve({ user: { getIdToken: () => Promise.resolve(uuidv4()) } })
	);

	private static authMock = jest.fn(() => ({
		signInWithEmailAndPassword: FirebaseAuthMock.signInWithEmailAndPasswordMock
	}));

	private static firebaseClientMock = jest.mock("firebase", () => ({
		auth: FirebaseAuthMock.authMock
	}));

	public static resetMocks = () => {
		FirebaseAppMock.authCreateUserMock.mockClear();
		FirebaseAppMock.authDeleteUserMock.mockClear();
		FirebaseAppMock.authVerifySessionCookie.mockClear();
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

	public static mockVerifySessionCookieReturnValueOnce = <T>(
		returnedData: T
	) => {
		FirebaseAppMock.authVerifySessionCookie.mockReturnValueOnce(returnedData);
	};

	public static hasVerifiedCookie = (cookie: string) => {
		return FirebaseAppMock.authVerifySessionCookie.mock.calls.some((params) => {
			const cookieParam = params[0];

			return cookie === cookieParam;
		});
	};

	public static mockVerifySessionCookieRejectOnce = () => {
		FirebaseAppMock.authVerifySessionCookie.mockImplementationOnce(() => {
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
}
