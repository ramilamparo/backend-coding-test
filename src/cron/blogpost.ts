import { BlogPost } from "@db/BlogPost";
import { DBConnection } from "@db/DBConnection";
import { Handler } from "aws-lambda";
import * as faker from "faker";

async function updateBlogPostTitles() {
	await DBConnection.initialize();
	const blogPosts = await BlogPost.find();

	const promises = blogPosts.map((blogPost) => {
		blogPost.title += faker.lorem.word();
		return blogPost.save();
	});

	await Promise.all(promises);
}

export const handler: Handler = async () => {
	await updateBlogPostTitles();
};
