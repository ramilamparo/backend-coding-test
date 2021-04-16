import {
	ResponseBuilder,
	ServerResponse,
	StatusCode
} from "@libs/ResponseBuilder";
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Response
} from "@nestjs/common";
import { Response as ExpressResponse } from "express";
import { BlogPost, BlogPostAttributes } from "src/db/BlogPost";
import { BlogPostService } from "./blog-post.service";

export type BlogPostResponseObject = BlogPostAttributes;

export type BlogPostControllerPostResponse = ServerResponse<BlogPostResponseObject | null>;

export type BlogPostControllerGetResponse = ServerResponse<
	BlogPostResponseObject[] | null
>;

export type BlogPostControllerPostParams = Pick<BlogPostAttributes, "title">;

export type BlogPostControllerPatchParams = Pick<BlogPostAttributes, "title">;

@Controller("/blog-posts")
export class BlogPostController {
	constructor(public service: BlogPostService) {}

	@Post()
	public async createBlogPost(
		@Response() res: ExpressResponse,
		@Body() newBlogPost: BlogPostControllerPostParams
	) {
		const response = new ResponseBuilder<BlogPostResponseObject>();
		try {
			const blogPost = await this.service.createBlogPost(newBlogPost.title);

			const blogPostData = this.mapBlogPostModelToBlogPostObjectResponse(
				blogPost
			);
			response.setData(blogPostData);
			response.setSuccess(true);
			response.setCode(StatusCode.SUCCESS);
			response.setMessage("Successfully created blog post.");
		} catch (e) {
			response.handleExpressError(e, res);
		}
		return response.toObject();
	}

	@Patch("/:id")
	public async updateBlogPost(
		@Response() res: ExpressResponse,
		@Param("id") blogPostId: string | number,
		@Body() blogPost: BlogPostControllerPostParams
	) {
		const response = new ResponseBuilder<BlogPostResponseObject>();
		try {
			const updatedBlogPost = await this.service.updateBlogPost(
				Number(blogPostId),
				blogPost
			);
			const blogPostData = this.mapBlogPostModelToBlogPostObjectResponse(
				updatedBlogPost
			);
			response.setData(blogPostData);
			response.setSuccess(true);
			response.setCode(StatusCode.SUCCESS);
			response.setMessage("Successfully created blog post.");
		} catch (e) {
			response.handleExpressError(e, res);
		}
		return response.toObject();
	}

	@Get("/:id")
	public async getBlogPost(
		@Response() res: ExpressResponse,
		@Param("id") blogPostId: string | number
	) {
		const response = new ResponseBuilder<BlogPostResponseObject>();
		try {
			const blogPost = await this.service.getOne(Number(blogPostId));
			const blogPostData = this.mapBlogPostModelToBlogPostObjectResponse(
				blogPost
			);
			response.setData(blogPostData);
			response.setSuccess(true);
			response.setCode(StatusCode.SUCCESS);
			response.setMessage("Found blog post.");
		} catch (e) {
			response.handleExpressError(e, res);
		}
		return response.toObject();
	}

	public getBlogPosts(
		res: ExpressResponse
	): Promise<BlogPostControllerGetResponse>;
	public getBlogPosts(
		res: ExpressResponse,
		from: number,
		to: number
	): Promise<BlogPostControllerGetResponse>;
	@Get()
	public async getBlogPosts(
		@Response() res: ExpressResponse,
		from?: number,
		to?: number
	): Promise<BlogPostControllerGetResponse> {
		const response = new ResponseBuilder<BlogPostResponseObject[]>();
		try {
			let blogPosts: BlogPost[] = [];
			if (from && to) {
				blogPosts = await this.service.getPaginatedBlogPosts(from, to);
			} else {
				blogPosts = await this.service.getAll();
			}

			const blogPostData = blogPosts.map(
				this.mapBlogPostModelToBlogPostObjectResponse
			);
			response.setData(blogPostData);
			response.setSuccess(true);
			response.setCode(StatusCode.SUCCESS);
			response.setMessage("Found blog posts.");
		} catch (e) {
			response.handleExpressError(e, res);
		}
		return response.toObject();
	}

	@Delete("/:id")
	public async deleteBlogPost(
		@Response() res: ExpressResponse,
		@Param("id") id: string | number
	) {
		const response = new ResponseBuilder<null>();
		try {
			await this.service.deleteBlogPost(Number(id));
			response.setSuccess(true);
			response.setCode(StatusCode.SUCCESS);
			response.setMessage("Deleted blog post.");
		} catch (e) {
			response.handleExpressError(e, res);
		}
		return response.toObject();
	}

	private mapBlogPostModelToBlogPostObjectResponse = (
		blogPost: BlogPostAttributes
	): BlogPostResponseObject => {
		return {
			docId: blogPost.docId,
			id: blogPost.id,
			title: blogPost.title
		};
	};
}
