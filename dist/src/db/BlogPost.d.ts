import { BaseEntity } from "typeorm";
export interface BlogPostCreateAttributes {
    title: string;
    docId: string;
}
export interface BlogPostAttributes extends BlogPostCreateAttributes {
    id: number;
}
export declare class BlogPost extends BaseEntity implements BlogPostAttributes {
    id: number;
    docId: string;
    title: string;
}
