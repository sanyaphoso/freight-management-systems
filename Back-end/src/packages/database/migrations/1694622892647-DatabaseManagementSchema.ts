import { MigrationInterface, QueryRunner } from 'typeorm';
import config from '~/config';

export class CreateInitialTables1694622892647 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users
    await queryRunner.query(`
        CREATE TABLE ${config.DB.MAIN_SCHEMA}."users" (
            "id" SERIAL PRIMARY KEY,
            "image_url" VARCHAR,
            "full_name" VARCHAR NOT NULL,
            "username" VARCHAR NOT NULL,
            "password" VARCHAR NOT NULL,
            "update_at" TIMESTAMP NOT NULL DEFAULT now() ,
            "created_at" TIMESTAMP NOT NULL DEFAULT now()
        );
    `);

    // Roles
    await queryRunner.query(`
        CREATE TABLE ${config.DB.MAIN_SCHEMA}."roles" (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR NOT NULL,
            "update_at" TIMESTAMP NOT NULL DEFAULT now(),
            "created_at" TIMESTAMP NOT NULL DEFAULT now()
        );
    `);

    // Role Mapping
    await queryRunner.query(`
        CREATE TABLE ${config.DB.MAIN_SCHEMA}."role_mapping" (
            "id" SERIAL PRIMARY KEY,
            "role_id" INTEGER,
            "user_id" INTEGER,
            "update_at" TIMESTAMP NOT NULL DEFAULT now(),
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            FOREIGN KEY ("role_id") REFERENCES ${config.DB.MAIN_SCHEMA}."roles" ("id"),
            FOREIGN KEY ("user_id") REFERENCES ${config.DB.MAIN_SCHEMA}."users" ("id")
        );
    `);

    // Permissions
    await queryRunner.query(`
        CREATE TABLE ${config.DB.MAIN_SCHEMA}."permissions" (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR NOT NULL,
            "action" VARCHAR NOT NULL,
            "update_at" TIMESTAMP NOT NULL DEFAULT now(),
            "created_at" TIMESTAMP NOT NULL DEFAULT now()
        );
    `);

    // Permission Mapping
    await queryRunner.query(`
        CREATE TABLE ${config.DB.MAIN_SCHEMA}."permission_mapping" (
           "id" SERIAL PRIMARY KEY,
            "role_id" INTEGER,
            "permission_id" INTEGER,
            "update_at" TIMESTAMP NOT NULL DEFAULT now(),
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            FOREIGN KEY ("role_id") REFERENCES ${config.DB.MAIN_SCHEMA}."roles" ("id"),
            FOREIGN KEY ("permission_id") REFERENCES ${config.DB.MAIN_SCHEMA}."permissions" ("id")
        );
    `);

    // Units
    await queryRunner.query(`
        CREATE TABLE ${config.DB.MAIN_SCHEMA}."units" (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR NOT NULL,
            "detail" VARCHAR,
            "update_at" TIMESTAMP NOT NULL DEFAULT now(),
            "created_at" TIMESTAMP NOT NULL DEFAULT now()
        );
    `);

    // Shelves
    await queryRunner.query(`
        CREATE TABLE ${config.DB.MAIN_SCHEMA}."shelves" (
            "id" SERIAL PRIMARY KEY,
            "image_url" VARCHAR,
            "name" VARCHAR NOT NULL,
            "detail" VARCHAR,
            "update_at" TIMESTAMP NOT NULL DEFAULT now(),
            "created_at" TIMESTAMP NOT NULL DEFAULT now()
        );
    `);

    // Floors
    await queryRunner.query(`
        CREATE TABLE ${config.DB.MAIN_SCHEMA}."floors" (
            "id" SERIAL PRIMARY KEY,
            "shelve_id" INTEGER,
            "image_url" VARCHAR,
            "name" VARCHAR NOT NULL,
            "detail" VARCHAR,
            "update_at" TIMESTAMP NOT NULL DEFAULT now(),
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            FOREIGN KEY ("shelve_id") REFERENCES ${config.DB.MAIN_SCHEMA}."shelves" ("id")
        );
    `);

    // Materials
    await queryRunner.query(`
        CREATE TABLE ${config.DB.MAIN_SCHEMA}."materials" (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR NOT NULL,
            "image_url" VARCHAR,
            "detail" VARCHAR,
            "floor_id" INTEGER,
            "total" INTEGER,
            "unit_id" INTEGER,
            "update_at" TIMESTAMP NOT NULL DEFAULT now(),
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            FOREIGN KEY ("floor_id") REFERENCES ${config.DB.MAIN_SCHEMA}."floors" ("id"),
            FOREIGN KEY ("unit_id") REFERENCES ${config.DB.MAIN_SCHEMA}."units" ("id")
        );
    `);

    // Lots
    await queryRunner.query(`
        CREATE TABLE ${config.DB.MAIN_SCHEMA}."lots" (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR NOT NULL,
            "buy_date" TIMESTAMP NOT NULL,
            "price" VARCHAR NOT NULL,
            "amount" VARCHAR NOT NULL,
            "available_amount" VARCHAR NOT NULL,
            "detail" VARCHAR,
            "update_at" TIMESTAMP NOT NULL DEFAULT now(),
            "created_at" TIMESTAMP NOT NULL DEFAULT now()
        );
    `);

    // Lot Mapping
    await queryRunner.query(`
     CREATE TABLE ${config.DB.MAIN_SCHEMA}."lot_mapping" (
         "id" SERIAL PRIMARY KEY,
         "material_id" INTEGER,
         "lot_id" INTEGER,
         "update_at" TIMESTAMP NOT NULL DEFAULT now(),
         "created_at" TIMESTAMP NOT NULL DEFAULT now(),
         FOREIGN KEY ("material_id") REFERENCES ${config.DB.MAIN_SCHEMA}."materials" ("id"),
         FOREIGN KEY ("lot_id") REFERENCES ${config.DB.MAIN_SCHEMA}."lots" ("id")
     );
 `);

    // Material History
    await queryRunner.query(`
        CREATE TABLE ${config.DB.MAIN_SCHEMA}."material_history" (
            "id" SERIAL PRIMARY KEY,
            "material_id" INTEGER,
            "remark" VARCHAR,
            "type" VARCHAR NOT NULL,
            "amount" INTEGER,
            "update_by" INTEGER,
            "update_at" TIMESTAMP NOT NULL DEFAULT now(),
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            FOREIGN KEY ("update_by") REFERENCES ${config.DB.MAIN_SCHEMA}."users" ("id"),
            FOREIGN KEY ("material_id") REFERENCES ${config.DB.MAIN_SCHEMA}."materials" ("id")
        );
    `);

    // Orders Group
    await queryRunner.query(`
        CREATE TABLE ${config.DB.MAIN_SCHEMA}."orders_group" (
            "id" SERIAL PRIMARY KEY,
            "node" JSON NULL,
            "status" VARCHAR NOT NULL,
            "update_at" TIMESTAMP NOT NULL DEFAULT now(),
            "created_at" TIMESTAMP NOT NULL DEFAULT now()
        );
    `);

    // Orders
    await queryRunner.query(`
        CREATE TABLE ${config.DB.MAIN_SCHEMA}."orders" (
            "id" SERIAL PRIMARY KEY,
            "orders_group_id" INTEGER,
            "customer_name" VARCHAR NOT NULL,
            "name" VARCHAR NOT NULL,
            "detail" VARCHAR,
            "address" VARCHAR NOT NULL,
            "send_date" TIMESTAMP,
            "latitude" VARCHAR,
            "longitude" VARCHAR,
            "status" VARCHAR NOT NULL,
            "update_at" TIMESTAMP NOT NULL DEFAULT now(),
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            FOREIGN KEY ("orders_group_id") REFERENCES ${config.DB.MAIN_SCHEMA}."orders_group" ("id")
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE ${config.DB.MAIN_SCHEMA}."material_history" DROP CONSTRAINT if exists "fk_material_history_material_id"`);
    await queryRunner.query(`ALTER TABLE ${config.DB.MAIN_SCHEMA}."material_history" DROP CONSTRAINT if exists "fk_material_history_update_by"`);
    await queryRunner.query(`ALTER TABLE ${config.DB.MAIN_SCHEMA}."lot_mapping" DROP CONSTRAINT if exists "fk_lot_mapping_material_id"`);
    await queryRunner.query(`ALTER TABLE ${config.DB.MAIN_SCHEMA}."lot_mapping" DROP CONSTRAINT if exists "fk_lot_mapping_lot_id"`);
    await queryRunner.query(`ALTER TABLE ${config.DB.MAIN_SCHEMA}."materials" DROP CONSTRAINT if exists "fk_materials_floor_id"`);
    await queryRunner.query(`ALTER TABLE ${config.DB.MAIN_SCHEMA}."materials" DROP CONSTRAINT if exists "fk_materials_unit_id"`);
    await queryRunner.query(`ALTER TABLE ${config.DB.MAIN_SCHEMA}."floors" DROP CONSTRAINT if exists "fk_floors_shelve_id"`);
    await queryRunner.query(`ALTER TABLE ${config.DB.MAIN_SCHEMA}."permission_mapping" DROP CONSTRAINT if exists "fk_permission_mapping_role_id"`);
    await queryRunner.query(`ALTER TABLE ${config.DB.MAIN_SCHEMA}."permission_mapping" DROP CONSTRAINT if exists "fk_permission_mapping_permission_id"`);
    await queryRunner.query(`ALTER TABLE ${config.DB.MAIN_SCHEMA}."role_mapping" DROP CONSTRAINT if exists "fk_role_mapping_role_id"`);
    await queryRunner.query(`ALTER TABLE ${config.DB.MAIN_SCHEMA}."role_mapping" DROP CONSTRAINT if exists "fk_role_mapping_user_id"`);
    await queryRunner.query(`ALTER TABLE ${config.DB.MAIN_SCHEMA}."orders" DROP CONSTRAINT if exists "fk_orders_orders_group_id"`);

    await queryRunner.query(`DROP TABLE ${config.DB.MAIN_SCHEMA}."orders" CASCADE;`);
    await queryRunner.query(`DROP TABLE ${config.DB.MAIN_SCHEMA}."orders_group" CASCADE;`);
    await queryRunner.query(`DROP TABLE ${config.DB.MAIN_SCHEMA}."material_history" CASCADE;`);
    await queryRunner.query(`DROP TABLE ${config.DB.MAIN_SCHEMA}."lots" CASCADE;`);
    await queryRunner.query(`DROP TABLE ${config.DB.MAIN_SCHEMA}."lot_mapping" CASCADE;`);
    await queryRunner.query(`DROP TABLE ${config.DB.MAIN_SCHEMA}."floors" CASCADE;`);
    await queryRunner.query(`DROP TABLE ${config.DB.MAIN_SCHEMA}."shelves" CASCADE;`);
    await queryRunner.query(`DROP TABLE ${config.DB.MAIN_SCHEMA}."units" CASCADE;`);
    await queryRunner.query(`DROP TABLE ${config.DB.MAIN_SCHEMA}."materials" CASCADE;`);
    await queryRunner.query(`DROP TABLE ${config.DB.MAIN_SCHEMA}."permissions" CASCADE;`);
    await queryRunner.query(`DROP TABLE ${config.DB.MAIN_SCHEMA}."permission_mapping" CASCADE;`);
    await queryRunner.query(`DROP TABLE ${config.DB.MAIN_SCHEMA}."roles" CASCADE;`);
    await queryRunner.query(`DROP TABLE ${config.DB.MAIN_SCHEMA}."role_mapping" CASCADE;`);
    await queryRunner.query(`DROP TABLE ${config.DB.MAIN_SCHEMA}."users" CASCADE;`);
  }
}
