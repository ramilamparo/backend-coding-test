"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockDB = void 0;
const DBConnection_1 = require("../../../src/db/DBConnection");
const typeorm_1 = require("typeorm");
class MockDB extends DBConnection_1.DBConnection {
    constructor(connection) {
        super();
        this.connection = connection;
        this.reset = async () => {
            await this.cleanAll();
        };
        this.close = async () => {
            this.connection.close();
        };
        this.getEntities = async () => {
            const entities = this.connection.entityMetadatas;
            return entities;
        };
        this.cleanAll = async () => {
            const entities = await this.getEntities();
            try {
                for (const entity of entities) {
                    const repository = this.connection.getRepository(entity.name);
                    await repository.query(`DELETE FROM \`${entity.tableName}\`;`);
                }
            }
            catch (error) {
                throw new Error(`ERROR: Cleaning test db: ${error}`);
            }
        };
    }
}
exports.MockDB = MockDB;
MockDB.mock = async () => {
    const connection = await MockDB.connection;
    return new MockDB(connection);
};
MockDB.connection = typeorm_1.createConnection({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: DBConnection_1.DBConnection.entities,
    synchronize: true,
    logging: false
});
//# sourceMappingURL=MockDB.js.map