"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPostService = void 0;
const lodash_1 = __importDefault(require("lodash"));
const ResourceNotFoundError_1 = require("@app/exceptions/ResourceNotFoundError");
const BlogPost_1 = require("@db/BlogPost");
const FirebaseFactory_1 = require("@libs/firebase/FirebaseFactory");
class BlogPostService {
    constructor() {
        this.getAll = async () => {
            return BlogPost_1.BlogPost.find();
        };
        this.getPaginatedBlogPosts = (from, to) => {
            return BlogPost_1.BlogPost.find({
                order: { id: "ASC" },
                take: to - from + 1,
                skip: from > 0 ? from - 1 : from
            });
        };
        this.getOne = async (id) => {
            const foundBlogPost = await BlogPost_1.BlogPost.findOne(id);
            if (!foundBlogPost) {
                throw new ResourceNotFoundError_1.ResourceNotFoundError();
            }
            return foundBlogPost;
        };
        this.createBlogPost = async (title) => {
            const firestoreDoc = await BlogPostService.firestore.create(BlogPostService.FIRESTORE_COLLECTION, { title });
            const createdBlogPost = BlogPost_1.BlogPost.create({ title, docId: firestoreDoc.id });
            await createdBlogPost.save();
            await createdBlogPost.reload();
            return createdBlogPost;
        };
        this.updateBlogPost = async (id, attributes) => {
            const foundBlogPost = await this.getOne(id);
            Object.assign(foundBlogPost, lodash_1.default.pick(attributes, "title"));
            BlogPostService.firestore.update(BlogPostService.FIRESTORE_COLLECTION, foundBlogPost.docId, { title: attributes.title });
            await foundBlogPost.save();
            await foundBlogPost.reload();
            return foundBlogPost;
        };
        this.deleteBlogPost = async (id) => {
            const foundBlogPost = await this.getOne(id);
            await foundBlogPost.remove();
        };
    }
}
exports.BlogPostService = BlogPostService;
BlogPostService.FIRESTORE_COLLECTION = "blog-post";
BlogPostService.firestore = FirebaseFactory_1.FirebaseFactory.getFirebaseFirestore();
//# sourceMappingURL=blog-post.service.js.map