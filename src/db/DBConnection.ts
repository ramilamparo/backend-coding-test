import { createConnection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { BlogPost } from "./BlogPost";
import { User } from "./User";

export abstract class DBConnection {
	protected static entities: PostgresConnectionOptions["entities"] = [
		User,
		BlogPost
	];

	public static initialize = () => {
		return createConnection({
			type: "postgres",
			database: "backend-coding-test",
			entities: DBConnection.entities,
			logging: true
		});
	};
}
