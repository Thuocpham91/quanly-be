import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require("dotenv");

dotenv.config();
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_DATABASE, SECRETKEY, EXPIRESIN } = process.env;

console.log("========================================");
console.log("DB_HOST", DB_HOST);
console.log("DB_USERNAME", DB_USERNAME);
console.log("DB_PASSWORD", DB_PASSWORD);
console.log("DB_PORT", DB_PORT);
console.log("DB_DATABASE", DB_DATABASE);
console.log("SECRETKEY", SECRETKEY);
console.log("EXPIRESIN", EXPIRESIN);
console.log("========================================");

export const configTypeORM: PostgresConnectionOptions = {
  type: "postgres",
  host: DB_HOST,
  port: +DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  logging: true,
  synchronize: true,
  dropSchema: false,
  migrations: ["dist/db/migrations/*.js", "src/db/migrations/*.ts"],
  ssl: false,
  extra: {
    max: 20,
    connectionTimeoutMillis: 10000,
  },
  // schema: 'public'
};
