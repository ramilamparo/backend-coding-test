import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { MockDB } from "@test-utils/mocks/MockDB";
import { FirebaseAuthMock } from "@test-utils/mocks/FirebaseAuthMock";
import { FirebaseFirestoreMock } from "@test-utils/mocks/FirebaseFirestoreMock";
import { AppModule } from "./../src/app/app.module";

describe("AppController (e2e)", () => {
	let app: INestApplication;
	let mockDB: MockDB;

	beforeAll(async () => {
		await mockDB.reset();
	});

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it("/ (GET)", () => {
		request(app.getHttpServer()).get("/").expect(200).expect("Hello World!");
	});

	// describe("Auth routes.", () => {
	// 	describe("/auth/signin (POST)", () => {
	// 		it("Returns a cookie", () => {
	// 			request(app.getHttpServer()).post("/auth/signin").send({});
	// 		});
	// 	});
	// 	describe("/auth/signup (POST)", () => {});
	// });
	// describe("Blog post routes.", () => {
	// 	describe("/blog-posts (POST)", () => {});
	// 	describe("/blog-posts (GET)", () => {});
	// 	describe("/blog-posts/:id (GET)", () => {});
	// 	describe("/blog-posts/:id (PATCH)", () => {});
	// 	describe("/blog-posts/:id (DELETE)", () => {});
	// });
});
