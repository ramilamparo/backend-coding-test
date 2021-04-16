"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnection = void 0;
const database_1 = require("../config/database");
const typeorm_1 = require("typeorm");
const BlogPost_1 = require("./BlogPost");
const User_1 = require("./User");
class DBConnection {
}
exports.DBConnection = DBConnection;
DBConnection.entities = [
    User_1.User,
    BlogPost_1.BlogPost
];
DBConnection.initialize = () => {
    return typeorm_1.createConnection({
        type: "postgres",
        database: "backend-coding-test",
        entities: DBConnection.entities,
        logging: true,
        host: database_1.database.host,
        username: database_1.database.username,
        password: database_1.database.password,
        port: Number(database_1.database.port)
    });
};
//# sourceMappingURL=DBConnection.js.map