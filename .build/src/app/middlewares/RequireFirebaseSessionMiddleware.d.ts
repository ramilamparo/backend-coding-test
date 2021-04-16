import { NestMiddleware } from "@nestjs/common";
import { Response, NextFunction } from "express";
import { SessionRequest } from "./ParseSessionMiddleware";
export declare class RequireFirebaseSessionMiddleware implements NestMiddleware {
    use(req: SessionRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
}
