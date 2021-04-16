import { BlogPostAttributes } from "@db/BlogPost";
export declare type DummyBlogPostAttributes = Pick<BlogPostAttributes, "title" | "docId">;
export declare class DummyBlogPost implements DummyBlogPost {
    title: string;
    docId: string;
    constructor(attributes: DummyBlogPost);
    static createDummyData: (attributes?: Partial<DummyBlogPostAttributes> | undefined) => DummyBlogPost;
}
