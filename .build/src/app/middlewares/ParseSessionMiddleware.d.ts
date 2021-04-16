import { Request, Response, NextFunction } from "express";
import { NestMiddleware } from "@nestjs/common";
import { UserRole } from "@type-utils*";
export interface SessionRequest extends Request {
    user: {
        email: string;
        role: UserRole;
    };
}
export declare class ParseSessionMiddleware implements NestMiddleware {
    use(req: SessionRequest, res: Response, next: NextFunction): Promise<void>;
}
