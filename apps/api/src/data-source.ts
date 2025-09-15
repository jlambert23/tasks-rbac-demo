import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";

import { User } from "./entity/User";
import { Role } from "./entity/Role";

const options: DataSourceOptions & SeederOptions = {
  type: "sqlite",
  database: "./data/database.sqlite",
  synchronize: true,
  logging: false,
  entities: [User, Role],
  migrations: [],
  subscribers: [],
  seeds: ["src/database/seeds/**/*{.ts,.js}"],
  seedTracking: false,
};

export const AppDataSource = new DataSource(options);
