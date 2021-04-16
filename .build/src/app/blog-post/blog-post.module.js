"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPostModule = void 0;
const RequireFirebaseSessionMiddleware_1 = require("@app/middlewares/RequireFirebaseSessionMiddleware");
const RequireRoleMiddleware_1 = require("@app/middlewares/RequireRoleMiddleware");
const common_1 = require("@nestjs/common");
const blog_post_controller_1 = require("./blog-post.controller");
const blog_post_service_1 = require("./blog-post.service");
let BlogPostModule = class BlogPostModule {
    constructor() {
        this.configure = (consumer) => {
            consumer.apply(RequireFirebaseSessionMiddleware_1.RequireFirebaseSessionMiddleware);
            consumer
                .apply(RequireRoleMiddleware_1.RequireRoleMiddleware.use("admin"))
                .forRoutes({ method: common_1.RequestMethod.PATCH, path: "blog-posts/:id" }, { method: common_1.RequestMethod.DELETE, path: "blog-posts/:id" }, { method: common_1.RequestMethod.POST, path: "blog-posts" });
        };
    }
};
BlogPostModule = __decorate([
    common_1.Module({
        controllers: [blog_post_controller_1.BlogPostController],
        providers: [blog_post_service_1.BlogPostService]
    })
], BlogPostModule);
exports.BlogPostModule = BlogPostModule;
//# sourceMappingURL=blog-post.module.js.map