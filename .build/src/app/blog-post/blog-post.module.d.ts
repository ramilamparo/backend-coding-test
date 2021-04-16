import { MiddlewareConsumer, NestModule } from "@nestjs/common";
export declare class BlogPostModule implements NestModule {
    configure: (consumer: MiddlewareConsumer) => void;
}
