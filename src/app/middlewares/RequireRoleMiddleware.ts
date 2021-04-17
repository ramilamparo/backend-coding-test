import { InvalidPermissionError } from "@app/exceptions/InvalidPermissionError";
import { InvalidSessionError } from "@app/exceptions/InvalidSessionError";
import { ResponseBuilder } from "@libs/ResponseBuilder";
import { UserRole } from "@type-utils";
import { Response, NextFunction } from "express";
import { SessionRequest } from "./ParseSessionMiddleware";

export class RequireRoleMiddleware {
	public static use(role: UserRole | UserRole[]) {
		return (req: SessionRequest, res: Response, next: NextFunction) => {
			try {
				if (!req.user) {
					throw new InvalidSessionError();
				}
				const userRole = req.user.role;
				if (Array.isArray(role)) {
					if (!role.includes(userRole)) {
						throw new InvalidPermissionError();
					}
				} else if (role !== userRole) {
					throw new InvalidPermissionError();
				}
			} catch (e) {
				const response = new ResponseBuilder();
				response.handleExpressError(e, res);
				return res.json(response.toObject());
			}
			next();
		};
	}
}
