import "@test-utils/mocks/FirebaseAuthMock";
import "@test-utils/mocks/FirebaseFirestoreMock";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request, { Response } from "supertest";
import { MockDB } from "@test-utils/mocks/MockDB";
import { AppModule } from "../src/app/app.module";
import { UserRole } from "@type-utils*";

describe("AppController (e2e)", () => {
	let app: INestApplication;
	let mockDB: MockDB;

	beforeAll(async () => {
		mockDB = await MockDB.mock();
	});

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();
		app = moduleFixture.createNestApplication();
		await app.init();
		await mockDB.reset();
	});

	it("/ (GET)", () => {
		return request(app.getHttpServer())
			.get("/")
			.expect(200)
			.expect("Hello World!");
	});

	describe("Auth routes.", () => {
		const EMAIL = "test@mail.com";
		const PASSWORD = "12345";
		const ROLE = "admin";
		const BIRTHDAY = Math.floor(new Date().valueOf() / 1000);
		describe("/auth/signup (POST)", () => {
			it("Returns user data on response.", async () => {
				const response = await request(app.getHttpServer())
					.post("/auth/signup")
					.send({
						email: EMAIL,
						password: PASSWORD,
						role: ROLE,
						dateOfBirth: BIRTHDAY
					});
				expect(response.status).toEqual(201);
				expectAuthResponseToContainUserData(
					response.body,
					EMAIL,
					ROLE,
					BIRTHDAY
				);
			});
		});
		describe("/auth/signin (POST)", () => {
			it("Returns a cookie", async () => {
				await request(app.getHttpServer()).post("/auth/signup").send({
					email: EMAIL,
					password: PASSWORD,
					role: ROLE,
					dateOfBirth: BIRTHDAY
				});
				const response = await request(app.getHttpServer())
					.post("/auth/signin")
					.send({
						email: EMAIL,
						password: PASSWORD
					});
				expect(response.status).toEqual(200);
				expectResponseToHaveSetCookie(response);
				expectAuthResponseToContainUserData(
					response.body,
					EMAIL,
					ROLE,
					BIRTHDAY
				);
			});
		});
	});
	// describe("Blog post routes.", () => {
	// 	describe("/blog-posts (POST)", () => {});
	// 	describe("/blog-posts (GET)", () => {});
	// 	describe("/blog-posts/:id (GET)", () => {});
	// 	describe("/blog-posts/:id (PATCH)", () => {});
	// 	describe("/blog-posts/:id (DELETE)", () => {});
	// });
});

const expectAuthResponseToContainUserData = (
	responseBody: any,
	email: string,
	role: UserRole,
	birthday: number
) => {
	expect(responseBody.data.email).toEqual(email);
	expect(responseBody.data.role).toEqual(role);
	expect(responseBody.data.dateOfBirth).toEqual(birthday);
	expect(responseBody.data.id).toBeDefined();
	expect(responseBody.data.firebaseId).toBeDefined();
};

const expectResponseToHaveSetCookie = (response: Response) => {
	console.log(response.headers);
	const setcookieRegex = /session=.+;/;
	expect(setcookieRegex.test(response.headers["set-cookie"])).toBeTruthy();
};
