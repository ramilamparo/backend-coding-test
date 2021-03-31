import { DBConnection } from "../../../src/db/DBConnection";
import { Connection, createConnection, EntityMetadata } from "typeorm";

export class MockDB extends DBConnection {
	private connection: Promise<Connection>;

	constructor() {
		super();
		this.connection = this.createConnection();
	}

	private createConnection = () => {
		return createConnection({
			type: "sqlite",
			database: ":memory:",
			dropSchema: true,
			entities: DBConnection.entities,
			synchronize: true,
			logging: false
		});
	};

	public reset = async () => {
		await this.cleanAll();
	};

	public close = async () => {
		const connection = await this.connection;
		connection.close();
	};

	private getEntities = async () => {
		const connection = await this.connection;
		const entities: EntityMetadata[] = connection.entityMetadatas;
		return entities;
	};

	private cleanAll = async () => {
		const entities = await this.getEntities();
		const connection = await this.connection;
		try {
			for (const entity of entities) {
				const repository = connection.getRepository(entity.name);
				await repository.query(`DELETE FROM \`${entity.tableName}\`;`);
			}
		} catch (error) {
			throw new Error(`ERROR: Cleaning test db: ${error}`);
		}
	};
}
