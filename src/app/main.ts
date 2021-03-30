import { NestFactory } from "@nestjs/core";
import firebase from "firebase-admin";
import { AppModule } from "./app.module";
import { serviceAccountKey } from "../config/firebase";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(3000);
}
bootstrap();
