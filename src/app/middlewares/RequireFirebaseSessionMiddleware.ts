import { InvalidSessionError } from "@app/exceptions/InvalidSessionError";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Response, NextFunction } from "express";
import { SessionRequest } from "./ParseSessionMiddleware";

@Injectable()
export class RequireFirebaseSessionMiddleware implements NestMiddleware {
	use(req: SessionRequest, res: Response, next: NextFunction) {
		if (!req.user) {
			throw new InvalidSessionError();
		}
		next();
	}
}
