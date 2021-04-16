import { UserRole } from "@type-utils*";
import { Response, NextFunction } from "express";
import { SessionRequest } from "./ParseSessionMiddleware";
export declare class RequireRoleMiddleware {
    static use(role: UserRole | UserRole[]): (req: SessionRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
}
