import { RequireFirebaseSessionMiddleware } from "@app/middlewares/RequireFirebaseSessionMiddleware";
import { RequireRoleMiddleware } from "@app/middlewares/RequireRoleMiddleware";
import {
	MiddlewareConsumer,
	Module,
	NestModule,
	RequestMethod
} from "@nestjs/common";
import { BlogPostController } from "./blog-post.controller";
import { BlogPostService } from "./blog-post.service";

@Module({
	controllers: [BlogPostController],
	providers: [BlogPostService]
})
export class AuthModule implements NestModule {
	configure = (consumer: MiddlewareConsumer) => {
		consumer.apply(RequireFirebaseSessionMiddleware);
		consumer
			.apply(RequireRoleMiddleware.use("admin"))
			.forRoutes(
				{ method: RequestMethod.PATCH, path: "blog-posts/:id" },
				{ method: RequestMethod.DELETE, path: "blog-posts/:id" },
				{ method: RequestMethod.POST, path: "blog-posts" }
			);
	};
}
