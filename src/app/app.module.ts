import cookieParser from "cookie-parser";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ParseSessionMiddleware } from "./middlewares/ParseSessionMiddleware";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { BlogPostModule } from "./blog-post/blog-post.module";

@Module({
	imports: [AuthModule, BlogPostModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule implements NestModule {
	public configure = (consumer: MiddlewareConsumer) => {
		consumer.apply(cookieParser()).forRoutes("*");
		consumer.apply(ParseSessionMiddleware).forRoutes("*");
	};
}
