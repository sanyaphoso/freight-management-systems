import { DataSource } from 'typeorm';
import config from './config';

export const datasource = new DataSource({
  uuidExtension: 'uuid-ossp',
  type: 'postgres',
  host: config.DB.HOST,
  port: config.DB.PORT,
  database: config.DB.NAME,
  username: config.DB.USER,
  password: config.DB.PASSWORD,
  entities: ['src/packages/database/models/*.ts'],
  migrations: ['src/packages/database/migrations/*.ts'],
  logging: true,
  subscribers: [],
});
