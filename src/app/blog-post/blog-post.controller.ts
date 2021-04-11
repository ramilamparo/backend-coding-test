import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post
} from "@nestjs/common";
import { BlogPostAttributes } from "src/db/BlogPost";
import { BlogPostService } from "./blog-post.service";

export type BlogPostControllerPostResponse = BlogPostAttributes;

export type BlogPostControllerGetResponse = BlogPostAttributes;

export type BlogPostControllerPostParams = Pick<BlogPostAttributes, "title">;

export type BlogPostControllerPatchParams = Pick<BlogPostAttributes, "title">;

@Controller("blog-posts")
export class BlogPostController {
	constructor(public service: BlogPostService) {}

	@Post()
	public createBlogPost(@Body() blogPost: BlogPostControllerPostParams) {
		return this.service.createBlogPost(blogPost.title);
	}

	@Patch("/:id")
	public updateBlogPost(
		@Param("id") blogPostId: string | number,
		@Body() blogPost: BlogPostControllerPostParams
	) {
		return this.service.updateBlogPost(Number(blogPostId), blogPost);
	}

	@Get("/:id")
	public async getBlogPost(@Param("id") blogPostId: string | number) {
		return this.service.getOne(Number(blogPostId));
	}
	public getBlogPosts(
		from: number,
		to: number
	): Promise<BlogPostControllerGetResponse[]>;
	public getBlogPosts(): Promise<BlogPostControllerGetResponse[]>;
	@Get()
	public getBlogPosts(
		from?: number,
		to?: number
	): Promise<BlogPostControllerGetResponse[]> {
		if (from && to) {
			return this.service.getPaginatedBlogPosts(from, to);
		}
		return this.service.getAll();
	}

	@Delete("/:id")
	public async deleteBlogPost(@Param("id") id: string | number) {
		await this.service.deleteBlogPost(Number(id));
	}
}
