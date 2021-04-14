import { FirebaseAppMock } from "./FirebaseAppMock";

export class FirebaseAuthMock extends FirebaseAppMock {
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
}
