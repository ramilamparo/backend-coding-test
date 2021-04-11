import _ from "lodash";
import { ResourceNotFoundError } from "@app/exceptions/ResourceNotFoundError";
import { BlogPost, BlogPostCreateAttributes } from "@db/BlogPost";
import { FirebaseFactory } from "@libs/firebase/FirebaseFactory";

export type BlogPostServiceCreateAttributes = Pick<
	BlogPostCreateAttributes,
	"title"
>;
export class BlogPostService {
	private static FIRESTORE_COLLECTION = "blog-post";
	private static firestore = FirebaseFactory.getFirebaseFirestore();

	public getAll = async () => {
		return BlogPost.find();
	};

	public getPaginatedBlogPosts = (from: number, to: number) => {
		return BlogPost.find({
			order: { id: "ASC" },
			take: to - from + 1,
			skip: from > 0 ? from - 1 : from
		});
	};

	public getOne = async (id: number) => {
		const foundBlogPost = await BlogPost.findOne(id);
		if (!foundBlogPost) {
			throw new ResourceNotFoundError();
		}
		return foundBlogPost;
	};

	public createBlogPost = async (title: string) => {
		const firestoreDoc = await BlogPostService.firestore.create(
			BlogPostService.FIRESTORE_COLLECTION,
			{ title }
		);
		const createdBlogPost = BlogPost.create({ title, docId: firestoreDoc.id });
		await createdBlogPost.save();
		await createdBlogPost.reload();
		return createdBlogPost;
	};

	public updateBlogPost = async (
		id: number,
		attributes: Partial<BlogPostCreateAttributes>
	) => {
		const foundBlogPost = await this.getOne(id);
		Object.assign(foundBlogPost, _.pick(attributes, "title"));
		BlogPostService.firestore.update(
			BlogPostService.FIRESTORE_COLLECTION,
			foundBlogPost.docId,
			{ title: attributes.title }
		);
		await foundBlogPost.save();
		await foundBlogPost.reload();
		return foundBlogPost;
	};

	public deleteBlogPost = async (id: number) => {
		const foundBlogPost = await this.getOne(id);
		await foundBlogPost.remove();
	};
}
