import { DBConnection } from "@db/DBConnection";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";

async function bootstrap() {
	await DBConnection.initialize();
	const app = await NestFactory.create(AppModule);
	await app.listen(3000);
}
bootstrap();
