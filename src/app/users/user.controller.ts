import { Controller, Post } from "@nestjs/common";

@Controller("users")
export class UserController {
	constructor(public service: UserService) {}

	@Post()
	public addProduct = (): unknown => {};
}
