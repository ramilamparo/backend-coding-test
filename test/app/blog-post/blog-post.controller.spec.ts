import { FirebaseFirestoreMock } from "@test-utils/mocks/FirebaseFirestoreMock";
import {
	BlogPostController,
	BlogPostResponseObject
} from "@app/blog-post/blog-post.controller";
import { BlogPostService } from "@app/blog-post/blog-post.service";
import { ResourceNotFoundError } from "@app/exceptions/ResourceNotFoundError";
import { Test, TestingModule } from "@nestjs/testing";
import { DummyBlogPost } from "@test-utils/dummy-generator/DummyPost";
import { MockDB } from "@test-utils/mocks/MockDB";
import { ExpressResponseMock } from "@test-utils/mocks/ExpressResponseMock";
import { ServerResponse, StatusCode } from "@libs/ResponseBuilder";

describe("Blog Post Controller", () => {
	let blogPostController: BlogPostController;
	let mockDB: MockDB;
	const res = new ExpressResponseMock();

	beforeAll(async () => {
		mockDB = await MockDB.mock();
		const app: TestingModule = await Test.createTestingModule({
			controllers: [BlogPostController],
			providers: [BlogPostService]
		}).compile();
		blogPostController = app.get(BlogPostController);
	});

	afterEach(async () => {
		await mockDB.reset();
		FirebaseFirestoreMock.resetMocks();
	});

	describe("Creating blog post", () => {
		it("Should return a blog post object", async () => {
			const dummyPost = DummyBlogPost.createDummyData();
			const blogPost = await insertOneBlogPostToController(
				blogPostController,
				dummyPost
			);

			if (!blogPost.data) {
				throw new Error("Blog post did not return data.");
			}

			expect(blogPost.data.title).toEqual(dummyPost.title);
			expect(blogPost.data.id).toBeDefined();
			expect(blogPost.data.docId).toBeDefined();
			expect(
				FirebaseFirestoreMock.hasCalledCollectionDocCreateWith({
					title: dummyPost.title
				})
			).toBeTruthy();
		});
	});

	describe("Reading blog post", () => {
		describe("Getting one blog post.", () => {
			it("Should get one", async () => {
				const { data: blogPost } = await insertOneBlogPostToController(
					blogPostController
				);
				const { data: foundBlogPost } = await blogPostController.getBlogPost(
					res.castToExpressResponse(),
					blogPost.id
				);
				if (!foundBlogPost) {
					throw new Error("Blog post get has no response.");
				}

				expect(foundBlogPost.title).toEqual(blogPost.title);
			});
			it("Should throw an error on a missing blog post.", async () => {
				const response = await blogPostController.getBlogPost(
					res.castToExpressResponse(),
					999
				);
				expect(response.data).toBeNull();
				expect(response.code).toEqual(StatusCode.RESOURCE_NOT_FOUND);
			});
		});

		describe("Getting multiple blog posts.", () => {
			it("Should get all", async () => {
				const createdBlogPosts = await insertManyBlogPostToController(
					blogPostController,
					200
				);
				const foundBlogPosts = await blogPostController.getBlogPosts(
					res.castToExpressResponse()
				);

				createdBlogPosts.forEach((createdBlogPost) => {
					if (!foundBlogPosts.data) {
						throw new Error("Blog post did not return data.");
					}

					const foundBlogPost = foundBlogPosts.data.find((blogPost) => {
						return blogPost.id === createdBlogPost.data.id;
					});
					if (!foundBlogPost) {
						throw new Error(`${createdBlogPost.data.id} not created.`);
					}
					expect(createdBlogPost.data.title).toEqual(foundBlogPost.title);
				});
			});
			it("Should return a paginated set of blog posts.", async () => {
				const createdUsers = await insertManyBlogPostToController(
					blogPostController,
					100
				);
				const blogPostsPage1 = await blogPostController.getBlogPosts(
					res.castToExpressResponse(),
					1,
					50
				);
				const blogPostsPage2 = await blogPostController.getBlogPosts(
					res.castToExpressResponse(),
					51,
					100
				);
				const blogPostsPage3 = await blogPostController.getBlogPosts(
					res.castToExpressResponse(),
					101,
					200
				);

				expect(blogPostsPage1.data).toHaveLength(50);
				expect(blogPostsPage2.data).toHaveLength(50);
				expect(blogPostsPage3.data).toHaveLength(0);

				createdUsers.forEach((createBlogPost) => {
					let foundBlogPost: BlogPostResponseObject | undefined;
					if (!blogPostsPage1.data) {
						throw new Error("Blog post page 1 did not return data.");
					}
					if (!blogPostsPage2.data) {
						throw new Error("Blog post page 2 did not return data.");
					}

					foundBlogPost = blogPostsPage1.data.find((blogPost) => {
						return blogPost.title === createBlogPost.data.title;
					});
					if (!foundBlogPost) {
						foundBlogPost = blogPostsPage2.data.find((blogPost) => {
							return blogPost.title === createBlogPost.data.title;
						});
					}
					if (!foundBlogPost) {
						throw new Error(
							`User with ID ${createBlogPost.data.id} is not found.`
						);
					}
					expect(createBlogPost.data.title).toEqual(foundBlogPost.title);
				});
			});
		});
	});

	describe("Updating blog post", () => {
		it("Should update the blog post.", async () => {
			const UPDATED_TITLE = "testing";
			const createdPost = await insertOneBlogPostToController(
				blogPostController
			);
			const { data: updatedPost } = await blogPostController.updateBlogPost(
				res.castToExpressResponse(),
				createdPost.data.id,
				{
					title: UPDATED_TITLE
				}
			);
			const { data: foundBlogPost } = await blogPostController.getBlogPost(
				res.castToExpressResponse(),
				createdPost.data.id
			);
			if (!updatedPost) {
				throw new Error("Update blog post did not return a response.");
			}
			if (!foundBlogPost) {
				throw new Error("Cannot find blog post.");
			}

			expect(foundBlogPost.title).toEqual(UPDATED_TITLE);
			expect(updatedPost.title).toEqual(UPDATED_TITLE);
			expect(
				FirebaseFirestoreMock.hasCalledCollectionSetWith({
					title: UPDATED_TITLE
				})
			).toBeTruthy();
		});
	});

	describe("Deleting blog post", () => {
		it("Should delete the post on the DB and Firebase", async () => {
			const deleteResponse = await insertOneBlogPostToController(
				blogPostController
			);
			await blogPostController.deleteBlogPost(
				res.castToExpressResponse(),
				deleteResponse.data.id
			);

			expect(
				FirebaseFirestoreMock.hasDeletedDocument(
					"blog-post",
					deleteResponse.data.docId
				)
			);
			const getReponse = await blogPostController.getBlogPost(
				res.castToExpressResponse(),
				deleteResponse.data.id
			);
			expect(getReponse.code).toEqual(StatusCode.RESOURCE_NOT_FOUND);
		});
	});
});

const insertOneBlogPostToController = async (
	controller: BlogPostController,
	blogPost: DummyBlogPost = DummyBlogPost.createDummyData()
): Promise<ServerResponse<BlogPostResponseObject>> => {
	const { data, ...meta } = await controller.createBlogPost(
		new ExpressResponseMock().castToExpressResponse(),
		blogPost
	);
	if (!data) {
		throw new Error("Cannot create blog post.");
	}
	return {
		data,
		...meta
	};
};

const insertManyBlogPostToController = (
	controller: BlogPostController,
	count: number
) => {
	const promises: Promise<ServerResponse<BlogPostResponseObject>>[] = [];

	for (let i = 0; i < count; i++) {
		promises.push(insertOneBlogPostToController(controller));
	}

	return Promise.all(promises);
};
