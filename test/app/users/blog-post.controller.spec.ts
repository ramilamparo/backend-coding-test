import { FirebaseFirestoreMock } from "@test-utils/mocks/FirebaseFirestoreMock";
import {
	BlogPostController,
	BlogPostControllerPostResponse,
	BlogPostControllerGetResponse
} from "@app/blog-post/blog-post.controller";
import { BlogPostService } from "@app/blog-post/blog-post.service";
import { ResourceNotFoundError } from "@app/exceptions/ResourceNotFoundError";
import { Test, TestingModule } from "@nestjs/testing";
import { DummyBlogPost } from "@test-utils/dummy-generator/DummyPost";
import { MockDB } from "@test-utils/mocks/MockDB";

describe("Blog Post Controller", () => {
	let blogPostController: BlogPostController;
	let mockDB: MockDB;

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

			expect(blogPost.title).toEqual(dummyPost.title);
			expect(blogPost.id).toBeDefined();
			expect(blogPost.docId).toBeDefined();
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
				const blogPost = await insertOneBlogPostToController(
					blogPostController
				);
				const foundBlogPost = await blogPostController.getBlogPost(blogPost.id);

				expect(foundBlogPost.title).toEqual(blogPost.title);
			});
			it("Should throw an error on a missing blog post.", async () => {
				try {
					await blogPostController.getBlogPost(999);
					throw new Error("Blog post did not throw an error!");
				} catch (e) {
					expect(e).toBeInstanceOf(ResourceNotFoundError);
				}
			});
		});

		describe("Getting multiple blog posts.", () => {
			it("Should get all", async () => {
				const createdBlogPosts = await insertManyBlogPostToController(
					blogPostController,
					200
				);
				const foundBlogPosts = await blogPostController.getBlogPosts();

				createdBlogPosts.forEach((createdBlogPost) => {
					const foundBlogPost = foundBlogPosts.find((blogPost) => {
						return blogPost.id === createdBlogPost.id;
					});
					if (!foundBlogPost) {
						throw new Error(`${createdBlogPost.id} not created.`);
					}
					expect(createdBlogPost.title).toEqual(foundBlogPost.title);
				});
			});
			it("Should return a paginated set of blog posts.", async () => {
				const createdUsers = await insertManyBlogPostToController(
					blogPostController,
					100
				);
				const blogPostsPage1 = await blogPostController.getBlogPosts(1, 50);
				const blogPostsPage2 = await blogPostController.getBlogPosts(51, 100);
				const blogPostsPage3 = await blogPostController.getBlogPosts(101, 200);

				expect(blogPostsPage1).toHaveLength(50);
				expect(blogPostsPage2).toHaveLength(50);
				expect(blogPostsPage3).toHaveLength(0);

				createdUsers.forEach((createBlogPost) => {
					let foundBlogPost: BlogPostControllerGetResponse | undefined;
					foundBlogPost = blogPostsPage1.find((blogPost) => {
						return blogPost.title === createBlogPost.title;
					});
					if (!foundBlogPost) {
						foundBlogPost = blogPostsPage2.find((blogPost) => {
							return blogPost.title === createBlogPost.title;
						});
					}
					if (!foundBlogPost) {
						throw new Error(`User with ID ${createBlogPost.id} is not found.`);
					}
					expect(createBlogPost.title).toEqual(foundBlogPost.title);
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
			const updatedPost = await blogPostController.updateBlogPost(
				createdPost.id,
				{
					title: UPDATED_TITLE
				}
			);
			const foundBlogPost = await blogPostController.getBlogPost(
				createdPost.id
			);

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
			const response = await insertOneBlogPostToController(blogPostController);
			await blogPostController.deleteBlogPost(response.id);

			expect(
				FirebaseFirestoreMock.hasDeletedDocument("blog-post", response.docId)
			);
			try {
				await blogPostController.getBlogPost(response.id);
				throw new Error("Blog post still still exists!");
			} catch (e) {
				expect(e).toBeInstanceOf(ResourceNotFoundError);
			}
		});
	});
});

const insertOneBlogPostToController = (
	controller: BlogPostController,
	blogPost: DummyBlogPost = DummyBlogPost.createDummyData()
) => {
	return controller.createBlogPost(blogPost);
};

const insertManyBlogPostToController = (
	controller: BlogPostController,
	count: number
) => {
	const promises: Promise<BlogPostControllerPostResponse>[] = [];

	for (let i = 0; i < count; i++) {
		promises.push(insertOneBlogPostToController(controller));
	}

	return Promise.all(promises);
};
