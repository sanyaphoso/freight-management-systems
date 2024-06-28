import { EntityManager } from 'typeorm';
import { datasource } from '~/ormconfig';
import { Role, RoleMapping } from '~/packages/database/models/models';
import { CustomError } from '../errors/customerError';

class RoleService {
  private roleRepository = datasource.getRepository(Role);
  private roleMappingRepository = datasource.getRepository(RoleMapping);

  async createRole(roleData: Partial<Role>): Promise<Role> {
    try {
      const role = this.roleRepository.create(roleData);
      await this.roleRepository.save(role);
      return role;
    } catch (error) {
      console.error('An error occurred: ', error);
      throw error;
    }
  }

  async getRoleById(id: number): Promise<Role | null> {
    return await this.roleRepository.findOneBy({ id });
  }

  async getRoleAll(): Promise<Role[] | null> {
    return await this.roleRepository.find();
  }

  async updateRole(id: number, roleData: Partial<Role>): Promise<Role | null> {
    try {
      const role = await this.roleRepository.findOneBy({ id });
      if (!role) {
        return null;
      }

      this.roleRepository.merge(role, roleData);
      await this.roleRepository.save(role);
      return role;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  }

  async deleteRole(id: number): Promise<void> {
    await datasource.transaction(async (transactionalEntityManager) => {
      const roleMappingRepository = transactionalEntityManager.getRepository(RoleMapping);
      await roleMappingRepository.delete({ role_id: id });
      await transactionalEntityManager.getRepository(Role).delete(id);
    });
  }

  async addRoleToUser(userId: number, roleIds: number[]): Promise<RoleMapping[]> {
    return await datasource.transaction(async (transactionalEntityManager: EntityManager) => {
      const roleMappingRepository = transactionalEntityManager.getRepository(RoleMapping);
      const rolesAdded: RoleMapping[] = [];

      await Promise.all(
        roleIds.map(async (roleId) => {
          const existingMapping = await roleMappingRepository.findOne({
            where: {
              user_id: userId,
              role_id: roleId,
            },
          });

          if (!existingMapping) {
            const role = roleMappingRepository.create({
              user_id: userId,
              role_id: roleId,
            });
            const savedRole = await roleMappingRepository.save(role);
            rolesAdded.push(savedRole);
          } else {
            console.error('User already has role:', roleId);
            throw new CustomError(`User already has role: ${roleId}`, 400);
          }
        }),
      );

      const updatedRoles = await roleMappingRepository.find({
        where: {
          user_id: userId,
        },
        relations: ['role', 'role.permission_mapping', 'role.permission_mapping.permission'],
      });

      return updatedRoles;
    });
  }

  async updateRoleToUser(userId: number, roleIds: number[]): Promise<RoleMapping[]> {
    return await datasource.transaction(async (transactionalEntityManager: EntityManager) => {
      const roleMappingRepository = transactionalEntityManager.getRepository(RoleMapping);
      const rolesAdded: RoleMapping[] = [];

      await roleMappingRepository.delete({
        user_id: userId,
      });

      await Promise.all(
        roleIds.map(async (roleId) => {
          const existingMapping = await roleMappingRepository.findOne({
            where: {
              user_id: userId,
              role_id: roleId,
            },
          });

          if (!existingMapping) {
            const role = roleMappingRepository.create({
              user_id: userId,
              role_id: roleId,
            });
            const savedRole = await roleMappingRepository.save(role);
            rolesAdded.push(savedRole);
          } else {
            console.error('User already has role:', roleId);
            throw new CustomError(`User already has role: ${roleId}`, 400);
          }
        }),
      );

      const updatedRoles = await roleMappingRepository.find({
        where: {
          user_id: userId,
        },
        relations: ['role', 'role.permission_mapping', 'role.permission_mapping.permission'],
      });

      return updatedRoles;
    });
  }

  async getRolesByUserId(userId: number): Promise<Role[]> {
    const roleMapping = await this.roleMappingRepository.find({
      where: {
        user_id: userId,
      },
      relations: ['role', 'role.permission_mapping', 'role.permission_mapping.permission'],
    });

    const role = roleMapping.map((roleMap) => roleMap.role);
    return role;
  }
}

export const roleService = new RoleService();
