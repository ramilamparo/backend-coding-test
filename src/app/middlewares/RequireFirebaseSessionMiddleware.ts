import { ResponseBuilder, StatusCode } from "@libs/ResponseBuilder";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Response, NextFunction } from "express";
import { SessionRequest } from "./ParseSessionMiddleware";

@Injectable()
export class RequireFirebaseSessionMiddleware implements NestMiddleware {
	use(req: SessionRequest, res: Response, next: NextFunction) {
		if (!req.user) {
			const response = new ResponseBuilder(null, {
				code: StatusCode.INVALID_SESSION,
				message: "You need to be logged in to access this resource.",
				success: false
			});
			res.status(403);
			return res.json(response.toObject());
		}
		next();
	}
}
