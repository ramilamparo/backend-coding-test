import { database } from "@config/database";
import { createConnection, getConnection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { BlogPost } from "./BlogPost";
import { User } from "./User";

export abstract class DBConnection {
	protected static entities: PostgresConnectionOptions["entities"] = [
		User,
		BlogPost
	];

	public static initialize = async () => {
		try {
			const connection = getConnection();
			if (!connection.isConnected) {
				await connection.connect();
			}
			return connection;
		} catch (e) {
			return createConnection({
				type: "postgres",
				database: "backend-coding-test",
				entities: DBConnection.entities,
				logging: true,
				host: database.host,
				username: database.username,
				password: database.password,
				port: Number(database.port),
				logger: "simple-console",
				synchronize: true
			});
		}
	};
}
