import { MockDB } from "@test-utils/mocks/MockDB";
import { BlogPost } from "@db/BlogPost";
import { DummyBlogPost } from "@test-utils/dummy-generator/DummyPost";

describe("BlogPost Model", () => {
	let mockConnection: MockDB;

	beforeAll(async () => {
		mockConnection = await MockDB.mock();
	});

	beforeEach(() => {
		return mockConnection.reset();
	});

	describe("Creating a BlogPost", () => {
		test("Creating one", async () => {
			const dummyBlogPost = DummyBlogPost.createDummyData();

			const blogPost = await BlogPost.create(dummyBlogPost).save();

			expect(blogPost).toBeInstanceOf(BlogPost);
		});
	});

	describe("Reading BlogPosts", () => {
		test("All BlogPosts", async () => {
			const blogPosts = [
				DummyBlogPost.createDummyData(),
				DummyBlogPost.createDummyData()
			];

			await Promise.all(
				blogPosts.map((blogPost) =>
					BlogPost.create({
						title: blogPost.title,
						docId: blogPost.docId
					}).save()
				)
			);

			const foundBlogPosts = await BlogPost.find();

			const hasAllBlogPosts = blogPosts.every((dummyUser) => {
				const isUserFound = foundBlogPosts.find((blogPost) => {
					const sameTitle = blogPost.title === dummyUser.title;
					return sameTitle;
				});
				return Boolean(isUserFound);
			});

			expect(foundBlogPosts).toHaveLength(2);
			expect(hasAllBlogPosts).toStrictEqual(true);
		});

		test("One BlogPost", async () => {
			const dummyBlogPost = DummyBlogPost.createDummyData();

			await BlogPost.create(dummyBlogPost).save();
			const foundBlogPost = await BlogPost.findOneOrFail({
				title: dummyBlogPost.title
			});

			expect(foundBlogPost.title).toStrictEqual(dummyBlogPost.title);
		});
	});

	test("Updating a BlogPost", async () => {
		const dummyBlogPost = DummyBlogPost.createDummyData();
		const UPDATED_TITLE = "testing";

		const user = BlogPost.create(dummyBlogPost);
		await user.save();
		user.title = UPDATED_TITLE;
		await user.save();
		const user2 = await BlogPost.findOneOrFail({ title: UPDATED_TITLE });

		expect(user.title).toStrictEqual(UPDATED_TITLE);
		expect(user2.title).toStrictEqual(UPDATED_TITLE);
	});

	test("Deleting a BlogPost", async () => {
		const dummyBlogPost = DummyBlogPost.createDummyData();

		const blogPost = BlogPost.create(dummyBlogPost);
		await blogPost.save();
		await blogPost.remove();
		const foundBlogPost = await BlogPost.findOne({
			title: dummyBlogPost.title
		});

		expect(foundBlogPost).toBeUndefined();
	});
});
