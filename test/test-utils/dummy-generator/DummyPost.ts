import { BlogPostAttributes } from "@db/BlogPost";
import * as faker from "faker";

export type DummyBlogPostAttributes = Pick<
	BlogPostAttributes,
	"title" | "docId"
>;

export class DummyBlogPost implements DummyBlogPost {
	public title: string;
	public docId: string;

	constructor(attributes: DummyBlogPost) {
		this.title = attributes.title;
		this.docId = attributes.docId;
	}

	public static createDummyData = (
		attributes?: Partial<DummyBlogPostAttributes>
	) => {
		return new DummyBlogPost({
			title: faker.unique(faker.lorem.sentence),
			docId: faker.unique(faker.git.commitSha),
			...attributes
		});
	};
}
