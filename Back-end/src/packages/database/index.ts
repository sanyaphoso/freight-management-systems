import "reflect-metadata";
import { DataSource } from "typeorm";
import { datasource } from "~/ormconfig";

export async function getConnection(): Promise<DataSource> {
  return datasource.initialize();
}

export async function closeConnection(): Promise<void> {
  return datasource.destroy();
}
