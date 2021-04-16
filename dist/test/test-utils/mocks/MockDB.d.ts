import { DBConnection } from "../../../src/db/DBConnection";
import { Connection } from "typeorm";
export declare class MockDB extends DBConnection {
    private connection;
    constructor(connection: Connection);
    static mock: () => Promise<MockDB>;
    private static connection;
    reset: () => Promise<void>;
    close: () => Promise<void>;
    private getEntities;
    private cleanAll;
}
