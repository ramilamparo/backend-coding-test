import { FirebaseAuthMock } from "@test-utils/mocks/FirebaseAuthMock";
import "@test-utils/mocks/FirebaseFirestoreMock";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request, { Response, SuperAgentTest } from "supertest";
import { MockDB } from "@test-utils/mocks/MockDB";
import { AppModule } from "../src/app/app.module";
import { UserRole } from "@type-utils*";
import {
	DummyBlogPost,
	DummyBlogPostAttributes
} from "@test-utils/dummy-generator/DummyPost";
import {
	DummyUser,
	DummyUserAttributes
} from "@test-utils/dummy-generator/DummyUser";
import { BlogPostResponseObject } from "@app/blog-post/blog-post.controller";

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
		describe("/auth/signup (POST)", () => {
			it("Returns user data on response.", async () => {
				const { response, user } = await signUpUser(app);
				expect(response.status).toEqual(201);
				expectAuthResponseToContainUserData(
					response.body,
					user.email,
					user.role,
					user.dateOfBirth
				);
			});
		});
		describe("/auth/signin (POST)", () => {
			it("Returns a cookie", async () => {
				const agent = request.agent(app.getHttpServer());
				const { user } = await signUpUser(app);
				const response = await signInUser(agent, user);
				expect(response.status).toEqual(200);
				expectResponseToHaveSetCookie(response);
				expectAuthResponseToContainUserData(
					response.body,
					user.email,
					user.role,
					user.dateOfBirth
				);
			});
		});
	});
	describe("Blog post routes.", () => {
		describe("/blog-posts (POST)", () => {
			it("Creating blog posts without being signed should not be allowed.", async () => {
				const blogPost = DummyBlogPost.createDummyData();
				const response = await request(app.getHttpServer())
					.post("/blog-posts")
					.send({ title: blogPost.title });

				expect(response.status).toEqual(403);
				expect(response.body.data).toBeNull();
			});

			it("Creating blog posts as standard user should not be allowed.", async () => {
				const blogPost = DummyBlogPost.createDummyData();
				const agent = request.agent(app.getHttpServer());
				const { user } = await signUpUser(app, { role: "standard" });
				await signInUser(agent, user);
				const response = await agent
					.post("/blog-posts")
					.send({ title: blogPost.title });

				expect(response.status).toEqual(403);
				expect(response.body.data).toBeNull();
			});

			it("Creating blog posts as admin should be allowed", async () => {
				const blogPost = DummyBlogPost.createDummyData();
				const agent = request.agent(app.getHttpServer());
				const { user } = await signUpUser(app, { role: "admin" });
				await signInUser(agent, user);
				FirebaseAuthMock.mockVerifySessionCookieReturnValueOnce({
					email: user.email
				});
				const response = await agent
					.post("/blog-posts")
					.send({ title: blogPost.title });

				expect(response.status).toEqual(201);
				expect(response.body.data.title).toEqual(blogPost.title);
				expect(response.body.data.docId).toBeDefined();
				expect(response.body.data.id).toBeDefined();
			});
		});

		describe("/blog-posts/:id (GET)", () => {
			it("Returns the created blog post.", async () => {
				const { createResponse } = await createABlogPost(app);

				// User a standard user to view a blog post.
				const standardUser = DummyUser.createDummyData({ role: "standard" });
				const standardUserAgent = request.agent(app.getHttpServer());

				await signUpUser(app, standardUser);
				await signInUser(standardUserAgent, standardUser);
				FirebaseAuthMock.mockVerifySessionCookieReturnValueOnce({
					email: standardUser.email
				});
				const response = await standardUserAgent.get(
					`/blog-posts/${createResponse.body.data.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body.title).toEqual(createResponse.body.title);
				expect(response.body.id).toEqual(createResponse.body.id);
				expect(response.body.docId).toEqual(createResponse.body.docId);
			});
			it("Does not return the created blog post when user is not signed in.", async () => {
				const { createResponse } = await createABlogPost(app);

				// User a standard user to view a blog post.
				const standardUser = DummyUser.createDummyData({ role: "standard" });
				await signUpUser(app, standardUser);
				const standardUserAgent = request.agent(app.getHttpServer());
				await signInUser(standardUserAgent, standardUser);
				const response = await standardUserAgent.get(
					`/blog-posts/${createResponse.body.id}`
				);

				expect(response.status).toEqual(403);
				expect(response.body.data).toBeNull();
			});
		});

		describe("/blog-posts (GET)", () => {
			describe("Getting all blog posts.", () => {
				it("Reads all created blog posts.", async () => {
					const createdResponse = await createManyBlogPosts(app, 105);
					const { user } = await signUpUser(app);
					const agent = request.agent(app.getHttpServer());
					await signInUser(agent, user);

					FirebaseAuthMock.mockVerifySessionCookieReturnValueOnce({
						email: user.email
					});
					const foundBlogPosts = await agent.get("/blog-posts");

					foundBlogPosts.body.data.forEach(
						(blogPost: BlogPostResponseObject) => {
							expect(blogPost.id).toBeDefined();
							expect(blogPost.title).toBeDefined();
							expect(blogPost.docId).toBeDefined();
						}
					);

					expect(foundBlogPosts.body.data).toHaveLength(
						createdResponse.created.length
					);
				});
			});
			describe("Getting paginated blog posts.", () => {
				it("Paginates posts.", async () => {
					await createManyBlogPosts(app, 105);
					const { user } = await signUpUser(app);
					const agent = request.agent(app.getHttpServer());
					await signInUser(agent, user);

					FirebaseAuthMock.mockVerifySessionCookieReturnValueOnce({
						email: user.email
					});
					const foundBlogPostsPage1 = await agent.get(
						"/blog-posts?from=1&to=100"
					);
					FirebaseAuthMock.mockVerifySessionCookieReturnValueOnce({
						email: user.email
					});
					const foundBlogPostsPage2 = await agent.get(
						"/blog-posts?from=101&to=105"
					);

					[
						...foundBlogPostsPage1.body.data,
						...foundBlogPostsPage2.body.data
					].forEach((blogPost: BlogPostResponseObject) => {
						expect(blogPost.id).toBeDefined();
						expect(blogPost.title).toBeDefined();
						expect(blogPost.docId).toBeDefined();
					});

					expect(foundBlogPostsPage1.body.data).toHaveLength(100);
					expect(foundBlogPostsPage2.body.data).toHaveLength(5);
				});
			});
		});
		describe("/blog-posts/:id (PATCH)", () => {
			it("Returns the updated object.", async () => {
				const {
					createResponse,
					adminUser,
					adminUserAgent
				} = await createABlogPost(app);

				const NEW_TITLE = createResponse.body.data.title + " asdf test";

				FirebaseAuthMock.mockVerifySessionCookieReturnValueOnce({
					email: adminUser.email
				});
				const patchResponse = await adminUserAgent
					.patch(`/blog-posts/${createResponse.body.data.id}`)
					.send({
						title: NEW_TITLE
					});

				expect(patchResponse.body.data.title).toEqual(NEW_TITLE);
			});
		});
		describe("/blog-posts/:id (DELETE)", () => {
			it("Deletes the post.", async () => {
				const {
					createResponse,
					adminUser,
					adminUserAgent
				} = await createABlogPost(app);

				FirebaseAuthMock.mockVerifySessionCookieReturnValueOnce({
					email: adminUser.email
				});
				await adminUserAgent.delete(
					`/blog-posts/${createResponse.body.data.id}`
				);

				FirebaseAuthMock.mockVerifySessionCookieReturnValueOnce({
					email: adminUser.email
				});
				const getResponse = await adminUserAgent.get(
					`/blog-posts/${createResponse.body.data.id}`
				);

				expect(getResponse.status).toEqual(404);
				expect(getResponse.body.data).toEqual(null);
			});
		});
	});
});

const expectAuthResponseToContainUserData = (
	responseBody: any,
	email: string,
	role: UserRole,
	birthday: string
) => {
	expect(responseBody.data.email).toEqual(email);
	expect(responseBody.data.role).toEqual(role);
	expect(responseBody.data.dateOfBirth).toEqual(birthday);
	expect(responseBody.data.id).toBeDefined();
	expect(responseBody.data.firebaseId).toBeDefined();
};

const expectResponseToHaveSetCookie = (response: Response) => {
	const setcookieRegex = /session=.+;/;
	expect(setcookieRegex.test(response.headers["set-cookie"])).toBeTruthy();
};

const signUpUser = async (
	app: INestApplication,
	overrides?: Partial<DummyUserAttributes>
) => {
	const randomUser = DummyUser.createDummyData(overrides);
	const response = await request(app.getHttpServer())
		.post("/auth/signup")
		.send({
			email: randomUser.email,
			password: randomUser.password,
			role: randomUser.role,
			dateOfBirth: randomUser.dateOfBirth
		});
	return { user: randomUser, response };
};

const signInUser = (
	agent: SuperAgentTest,
	user: { email: string; password: string }
) => {
	return agent.post("/auth/signin").send(user);
};

const createABlogPost = async (
	app: INestApplication,
	blogPostOverrides?: Partial<DummyBlogPostAttributes>
) => {
	const blogPost = DummyBlogPost.createDummyData({
		...blogPostOverrides
	});
	const adminUser = DummyUser.createDummyData({ role: "admin" });
	const adminUserAgent = request.agent(app.getHttpServer());
	await signUpUser(app, adminUser);
	await signInUser(adminUserAgent, adminUser);

	const createResponse = await createABlogPostForUser(
		blogPost,
		adminUser,
		adminUserAgent
	);

	return {
		createResponse,
		adminUser,
		adminUserAgent
	};
};

const createManyBlogPosts = async (app: INestApplication, count: number) => {
	const adminUser = DummyUser.createDummyData({ role: "admin" });
	const adminUserAgent = request.agent(app.getHttpServer());
	await signUpUser(app, adminUser);
	await signInUser(adminUserAgent, adminUser);

	const promises: request.Test[] = [];

	for (let i = 0; i < count; i++) {
		const blogPost = DummyBlogPost.createDummyData();
		promises.push(createABlogPostForUser(blogPost, adminUser, adminUserAgent));
	}
	const responses = await Promise.all(promises);

	return {
		created: responses,
		adminUser
	};
};

const createABlogPostForUser = (
	blogPost: DummyBlogPost,
	user: DummyUser,
	userAgent: SuperAgentTest
) => {
	FirebaseAuthMock.mockVerifySessionCookieReturnValueOnce({
		email: user.email
	});
	return userAgent.post("/blog-posts").send({ title: blogPost.title });
};
