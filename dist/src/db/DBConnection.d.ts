import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
export declare abstract class DBConnection {
    protected static entities: PostgresConnectionOptions["entities"];
    static initialize: () => Promise<import("typeorm").Connection>;
}
