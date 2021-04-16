"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPostController = void 0;
const ResponseBuilder_1 = require("@libs/ResponseBuilder");
const common_1 = require("@nestjs/common");
const blog_post_service_1 = require("./blog-post.service");
let BlogPostController = class BlogPostController {
    constructor(service) {
        this.service = service;
        this.mapBlogPostModelToBlogPostObjectResponse = (blogPost) => {
            return {
                docId: blogPost.docId,
                id: blogPost.id,
                title: blogPost.title
            };
        };
    }
    async createBlogPost(res, newBlogPost) {
        const response = new ResponseBuilder_1.ResponseBuilder();
        try {
            const blogPost = await this.service.createBlogPost(newBlogPost.title);
            const blogPostData = this.mapBlogPostModelToBlogPostObjectResponse(blogPost);
            response.setData(blogPostData);
            response.setSuccess(true);
            response.setCode(ResponseBuilder_1.StatusCode.SUCCESS);
            response.setMessage("Successfully created blog post.");
        }
        catch (e) {
            response.handleExpressError(e, res);
        }
        return response.toObject();
    }
    async updateBlogPost(res, blogPostId, blogPost) {
        const response = new ResponseBuilder_1.ResponseBuilder();
        try {
            const updatedBlogPost = await this.service.updateBlogPost(Number(blogPostId), blogPost);
            const blogPostData = this.mapBlogPostModelToBlogPostObjectResponse(updatedBlogPost);
            response.setData(blogPostData);
            response.setSuccess(true);
            response.setCode(ResponseBuilder_1.StatusCode.SUCCESS);
            response.setMessage("Successfully created blog post.");
        }
        catch (e) {
            response.handleExpressError(e, res);
        }
        return response.toObject();
    }
    async getBlogPost(res, blogPostId) {
        const response = new ResponseBuilder_1.ResponseBuilder();
        try {
            const blogPost = await this.service.getOne(Number(blogPostId));
            const blogPostData = this.mapBlogPostModelToBlogPostObjectResponse(blogPost);
            response.setData(blogPostData);
            response.setSuccess(true);
            response.setCode(ResponseBuilder_1.StatusCode.SUCCESS);
            response.setMessage("Found blog post.");
        }
        catch (e) {
            response.handleExpressError(e, res);
        }
        return response.toObject();
    }
    async getBlogPosts(res, from, to) {
        const response = new ResponseBuilder_1.ResponseBuilder();
        try {
            let blogPosts = [];
            if (from && to) {
                blogPosts = await this.service.getPaginatedBlogPosts(from, to);
            }
            else {
                blogPosts = await this.service.getAll();
            }
            const blogPostData = blogPosts.map(this.mapBlogPostModelToBlogPostObjectResponse);
            response.setData(blogPostData);
            response.setSuccess(true);
            response.setCode(ResponseBuilder_1.StatusCode.SUCCESS);
            response.setMessage("Found blog posts.");
        }
        catch (e) {
            response.handleExpressError(e, res);
        }
        return response.toObject();
    }
    async deleteBlogPost(res, id) {
        const response = new ResponseBuilder_1.ResponseBuilder();
        try {
            await this.service.deleteBlogPost(Number(id));
            response.setSuccess(true);
            response.setCode(ResponseBuilder_1.StatusCode.SUCCESS);
            response.setMessage("Deleted blog post.");
        }
        catch (e) {
            response.handleExpressError(e, res);
        }
        return response.toObject();
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Response()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BlogPostController.prototype, "createBlogPost", null);
__decorate([
    common_1.Patch("/:id"),
    __param(0, common_1.Response()),
    __param(1, common_1.Param("id")),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], BlogPostController.prototype, "updateBlogPost", null);
__decorate([
    common_1.Get("/:id"),
    __param(0, common_1.Response()),
    __param(1, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BlogPostController.prototype, "getBlogPost", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], BlogPostController.prototype, "getBlogPosts", null);
__decorate([
    common_1.Delete("/:id"),
    __param(0, common_1.Response()),
    __param(1, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BlogPostController.prototype, "deleteBlogPost", null);
BlogPostController = __decorate([
    common_1.Controller("/blog-posts"),
    __metadata("design:paramtypes", [blog_post_service_1.BlogPostService])
], BlogPostController);
exports.BlogPostController = BlogPostController;
//# sourceMappingURL=blog-post.controller.js.map