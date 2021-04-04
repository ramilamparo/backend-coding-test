import { DBConnection } from "../../../src/db/DBConnection";
import { Connection, createConnection, EntityMetadata } from "typeorm";

export class MockDB extends DBConnection {
	constructor(private connection: Connection) {
		super();
	}

	public static mock = async () => {
		const connection = await MockDB.connection;
		return new MockDB(connection);
	};

	private static connection = createConnection({
		type: "sqlite",
		database: ":memory:",
		dropSchema: true,
		entities: DBConnection.entities,
		synchronize: true,
		logging: false
	});

	public reset = async () => {
		await this.cleanAll();
	};

	public close = async () => {
		this.connection.close();
	};

	private getEntities = async () => {
		const entities: EntityMetadata[] = this.connection.entityMetadatas;
		return entities;
	};

	private cleanAll = async () => {
		const entities = await this.getEntities();
		try {
			for (const entity of entities) {
				const repository = this.connection.getRepository(entity.name);
				await repository.query(`DELETE FROM \`${entity.tableName}\`;`);
			}
		} catch (error) {
			throw new Error(`ERROR: Cleaning test db: ${error}`);
		}
	};
}
