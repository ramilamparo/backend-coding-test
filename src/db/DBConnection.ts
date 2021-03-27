import { createConnection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { EnvVars } from "../config/EnvVars";
import { User } from "./User";

export abstract class DBConnection {
	public static initialize = () => {
		const entities: PostgresConnectionOptions["entities"] = [User];

		if (EnvVars.environment === "test") {
			return createConnection({
				type: "sqlite",
				database: ":memory:",
				dropSchema: true,
				entities,
				synchronize: true,
				logging: false
			});
		}
		return createConnection({
			type: "postgres",
			database: "backend-coding-test",
			entities,
			logging: true
		});
	};
}
