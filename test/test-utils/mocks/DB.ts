import { DBConnection } from "../../../src/db/DBConnection";
import { Connection, EntityMetadata } from "typeorm";

export class MockDB {
	constructor() {
		this.connection = DBConnection.initialize();
	}

	private connection: Promise<Connection>;

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
