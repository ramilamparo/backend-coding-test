import { ServerResponse, StatusCode } from "@libs/ResponseBuilder";
import { Response as ExpressResponse } from "express";
import { BlogPostAttributes } from "src/db/BlogPost";
import { BlogPostService } from "./blog-post.service";
export declare type BlogPostResponseObject = BlogPostAttributes;
export declare type BlogPostControllerPostResponse = ServerResponse<BlogPostResponseObject | null>;
export declare type BlogPostControllerGetResponse = ServerResponse<BlogPostResponseObject[] | null>;
export declare type BlogPostControllerPostParams = Pick<BlogPostAttributes, "title">;
export declare type BlogPostControllerPatchParams = Pick<BlogPostAttributes, "title">;
export declare class BlogPostController {
    service: BlogPostService;
    constructor(service: BlogPostService);
    createBlogPost(res: ExpressResponse, newBlogPost: BlogPostControllerPostParams): Promise<{
        success: boolean;
        message: string;
        code: StatusCode;
        data: BlogPostAttributes | null;
    }>;
    updateBlogPost(res: ExpressResponse, blogPostId: string | number, blogPost: BlogPostControllerPostParams): Promise<{
        success: boolean;
        message: string;
        code: StatusCode;
        data: BlogPostAttributes | null;
    }>;
    getBlogPost(res: ExpressResponse, blogPostId: string | number): Promise<{
        success: boolean;
        message: string;
        code: StatusCode;
        data: BlogPostAttributes | null;
    }>;
    getBlogPosts(res: ExpressResponse): Promise<BlogPostControllerGetResponse>;
    getBlogPosts(res: ExpressResponse, from: number, to: number): Promise<BlogPostControllerGetResponse>;
    deleteBlogPost(res: ExpressResponse, id: string | number): Promise<{
        success: boolean;
        message: string;
        code: StatusCode;
        data: null;
    }>;
    private mapBlogPostModelToBlogPostObjectResponse;
}
