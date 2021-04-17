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
	Query,
	Res
} from "@nestjs/common";
import { Response } from "express";
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
		@Res({ passthrough: true }) res: Response,
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
			res.status(201);
		} catch (e) {
			response.handleExpressError(e, res);
		}
		return response.toObject();
	}

	@Patch("/:id")
	public async updateBlogPost(
		@Res({ passthrough: true }) res: Response,
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
			res.status(200);
		} catch (e) {
			response.handleExpressError(e, res);
		}
		return response.toObject();
	}

	@Get("/:id")
	public async getBlogPost(
		@Res({ passthrough: true }) res: Response,
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
			res.status(200);
		} catch (e) {
			response.handleExpressError(e, res);
		}
		return response.toObject();
	}

	public getBlogPosts(res: Response): Promise<BlogPostControllerGetResponse>;
	public getBlogPosts(
		res: Response,
		from: number,
		to: number
	): Promise<BlogPostControllerGetResponse>;
	@Get()
	public async getBlogPosts(
		@Res({ passthrough: true }) res: Response,
		@Query("from") from?: number | string,
		@Query("to") to?: number | string
	): Promise<BlogPostControllerGetResponse> {
		const response = new ResponseBuilder<BlogPostResponseObject[]>();
		try {
			let blogPosts: BlogPost[] = [];
			if (from && to) {
				blogPosts = await this.service.getPaginatedBlogPosts(
					Number(from),
					Number(to)
				);
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
			res.status(200);
		} catch (e) {
			response.handleExpressError(e, res);
		}
		return response.toObject();
	}

	@Delete("/:id")
	public async deleteBlogPost(
		@Res({ passthrough: true }) res: Response,
		@Param("id") id: string | number
	) {
		const response = new ResponseBuilder<null>();
		try {
			await this.service.deleteBlogPost(Number(id));
			response.setSuccess(true);
			response.setCode(StatusCode.SUCCESS);
			response.setMessage("Deleted blog post.");
			res.status(200);
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
