import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import config from '~/config';

export enum LogisticType {
  InProgress = 'in_progress',
  Pending = 'pending',
  Success = 'success',
}

export enum MaterialHistoryType {
  WithdrawMaterial = 'withdraw_material',
  AddMaterial = 'add_material',
}

export enum OrderType {
  InProgress = 'in_progress',
  Pending = 'pending',
  Success = 'success',
}

@Entity(config.DB.MAIN_SCHEMA + '.' + 'users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image_url: string;

  @Column()
  full_name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @UpdateDateColumn({ type: 'timestamp' })
  update_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => RoleMapping, (role_mapping) => role_mapping.user)
  role_mappings: RoleMapping[];

  @OneToMany(() => MaterialHistory, (materialHistory) => materialHistory.updatedBy)
  materialHistories: MaterialHistory[];
}

@Entity(config.DB.MAIN_SCHEMA + '.' + 'roles')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @UpdateDateColumn({ type: 'timestamp' })
  update_at: Date;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => RoleMapping, (role_mapping) => role_mapping.role)
  role_mappings: RoleMapping[];

  @OneToMany(() => PermissionMapping, (permission_mapping) => permission_mapping.role)
  permission_mapping: PermissionMapping[];
}

@Entity(config.DB.MAIN_SCHEMA + '.' + 'role_mapping')
export class RoleMapping extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role_id: number;

  @Column()
  user_id: number;

  @Column()
  @UpdateDateColumn({ type: 'timestamp' })
  update_at: Date;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => Role, (role) => role.role_mappings)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => User, (user) => user.role_mappings)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

@Entity(config.DB.MAIN_SCHEMA + '.' + 'permissions')
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  action: string;

  @Column()
  @UpdateDateColumn({ type: 'timestamp' })
  update_at: Date;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => PermissionMapping, (permission_mapping) => permission_mapping.permission)
  permission_mapping: PermissionMapping[];
}

@Entity(config.DB.MAIN_SCHEMA + '.' + 'permission_mapping')
export class PermissionMapping extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role_id: number;

  @Column()
  permission_id: number;

  @Column()
  @UpdateDateColumn({ type: 'timestamp' })
  update_at: Date;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => Role, (role) => role.permission_mapping)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.permission_mapping)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}

@Entity(config.DB.MAIN_SCHEMA + '.' + 'materials')
export class Material extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image_url: string;

  @Column()
  detail: string;

  @Column()
  floor_id: number;

  @Column()
  total: number;

  @Column()
  unit_id: number;

  @Column()
  @UpdateDateColumn({ type: 'timestamp' })
  update_at: Date;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => LotMapping, (lotMapping) => lotMapping.material)
  lotMappings: LotMapping[];

  @OneToMany(() => MaterialHistory, (materialHistory) => materialHistory.material)
  materialHistories: MaterialHistory[];

  @ManyToOne(() => Floor, (floor) => floor.materials)
  @JoinColumn({ name: 'floor_id' })
  floor: Promise<Floor>;
}

@Entity(config.DB.MAIN_SCHEMA + '.' + 'units')
export class Unit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  detail: string;

  @Column()
  @UpdateDateColumn({ type: 'timestamp' })
  update_at: Date;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}

@Entity(config.DB.MAIN_SCHEMA + '.' + 'shelves')
export class Shelf extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image_url: string;

  @Column()
  name: string;

  @Column()
  detail: string;

  @Column()
  @UpdateDateColumn({ type: 'timestamp' })
  update_at: Date;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => Floor, (floor) => floor.shelf)
  floors: Floor[];
}

@Entity(config.DB.MAIN_SCHEMA + '.' + 'floors')
export class Floor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shelve_id: number;

  @Column()
  image_url: string;

  @Column()
  name: string;

  @Column()
  detail: string;

  @Column()
  @UpdateDateColumn({ type: 'timestamp' })
  update_at: Date;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => Shelf, (shelf) => shelf.floors)
  @JoinColumn({ name: 'shelve_id' })
  shelf: Shelf;

  @OneToMany(() => Material, (material) => material.floor)
  materials: Material[];
}

@Entity(config.DB.MAIN_SCHEMA + '.' + 'lot_mapping')
export class LotMapping extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  material_id: number;

  @Column()
  lot_id: number;

  @Column()
  @UpdateDateColumn({ type: 'timestamp' })
  update_at: Date;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => Material, (material) => material.lotMappings)
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @ManyToOne(() => Lot, (lot) => lot.lotMappings)
  @JoinColumn({ name: 'lot_id' })
  lot: Promise<Lot>;
}

@Entity(config.DB.MAIN_SCHEMA + '.' + 'lots')
export class Lot extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  buy_date: Date;

  @Column()
  price: string;

  @Column()
  amount: string;

  @Column()
  available_amount: string;

  @Column()
  detail: string;

  @Column()
  @UpdateDateColumn({ type: 'timestamp' })
  update_at: Date;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => LotMapping, (lotMapping) => lotMapping.lot)
  lotMappings: LotMapping[];
}

@Entity(config.DB.MAIN_SCHEMA + '.' + 'material_history')
export class MaterialHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  material_id: number;

  @Column()
  remark: string;

  @Column({
    type: 'enum',
    enum: MaterialHistoryType,
  })
  type: MaterialHistoryType;

  @Column()
  amount: number;

  @Column()
  update_by: number;

  @Column()
  @UpdateDateColumn({ type: 'timestamp' })
  update_at: Date;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => Material, (material) => material.materialHistories)
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @ManyToOne(() => User, (user) => user.materialHistories)
  @JoinColumn({ name: 'update_by' })
  updatedBy: User;
}

@Entity(config.DB.MAIN_SCHEMA + '.' + 'orders_group')
export class OrdersGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  node: any;

  @Column({
    type: 'enum',
    enum: LogisticType,
  })
  status: LogisticType;

  @UpdateDateColumn()
  update_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Order, (order) => order.orderGroup)
  orders: Order[];
}

@Entity(config.DB.MAIN_SCHEMA + '.' + 'orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orders_group_id?: number;

  @Column()
  customer_name: string;

  @Column()
  name: string;

  @Column()
  detail: string;

  @Column()
  address: string;

  @Column()
  send_date?: Date;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column({
    type: 'enum',
    enum: OrderType,
  })
  status: OrderType;

  @UpdateDateColumn()
  update_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => OrdersGroup, (ordersGroup) => ordersGroup.orders)
  @JoinColumn({ name: 'orders_group_id' })
  orderGroup: OrdersGroup;
}
