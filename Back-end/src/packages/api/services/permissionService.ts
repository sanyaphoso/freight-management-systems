import { datasource } from '~/ormconfig';
import { Permission } from '~/packages/database/models/models';

class PermissionService {
  private permissionRepository = datasource.getRepository(Permission);

  async createPermission(permissionData: Partial<Permission>): Promise<Permission> {
    try {
      const permission = this.permissionRepository.create(permissionData);
      await this.permissionRepository.save(permission);
      return permission;
    } catch (error) {
      console.error('An error occurred: ', error);
      throw error;
    }
  }

  async getPermissionById(id: number): Promise<Permission | null> {
    return await this.permissionRepository.findOneBy({ id });
  }

  async getPermissionAll(): Promise<Permission[] | null> {
    return await this.permissionRepository.find();
  }

  async updatePermission(id: number, permissionData: Partial<Permission>): Promise<Permission | null> {
    try {
      const permission = await this.permissionRepository.findOneBy({ id });
      if (!permission) {
        return null;
      }

      this.permissionRepository.merge(permission, permissionData);
      await this.permissionRepository.save(permission);
      return permission;
    } catch (error) {
      console.error('Error updating permission:', error);
      throw error;
    }
  }

  async deletePermission(id: number): Promise<void> {
    await this.permissionRepository.delete(id);
  }
}

export const permissionService = new PermissionService();
