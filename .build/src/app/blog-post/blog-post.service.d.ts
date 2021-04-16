import { BlogPost, BlogPostCreateAttributes } from "@db/BlogPost";
export declare type BlogPostServiceCreateAttributes = Pick<BlogPostCreateAttributes, "title">;
export declare class BlogPostService {
    private static FIRESTORE_COLLECTION;
    private static firestore;
    getAll: () => Promise<BlogPost[]>;
    getPaginatedBlogPosts: (from: number, to: number) => Promise<BlogPost[]>;
    getOne: (id: number) => Promise<BlogPost>;
    createBlogPost: (title: string) => Promise<BlogPost>;
    updateBlogPost: (id: number, attributes: Partial<BlogPostCreateAttributes>) => Promise<BlogPost>;
    deleteBlogPost: (id: number) => Promise<void>;
}
