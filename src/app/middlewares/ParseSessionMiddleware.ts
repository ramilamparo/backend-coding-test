import { Request, Response, NextFunction } from "express";
import { User } from "@db/User";
import { FirebaseFactory } from "@libs/firebase/FirebaseFactory";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { UserRole } from "@type-utils*";

export interface SessionRequest extends Request {
	user: {
		email: string;
		role: UserRole;
	};
}

@Injectable()
export class ParseSessionMiddleware implements NestMiddleware {
	async use(req: SessionRequest, res: Response, next: NextFunction) {
		const sessionCookie = req.cookies.session || "";
		try {
			const firebaseUser = await FirebaseFactory.getFirebaseAuth().verifySessionToken(
				sessionCookie
			);
			const user = await User.findOneOrFail({ email: firebaseUser.email });
			req.user = {
				email: user.email,
				role: user.role
			};
		} catch (e) {
			// Normal. User is not logged in...
		}

		next();
	}
}
