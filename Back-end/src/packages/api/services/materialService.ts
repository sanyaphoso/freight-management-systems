import { datasource } from '~/ormconfig';
import { Material } from '~/packages/database/models/models';

class MaterialService {
  private materialRepository = datasource.getRepository(Material);

  async createMaterial(materialData: Partial<Material>): Promise<Material> {
    try {
      const material = this.materialRepository.create(materialData);
      await this.materialRepository.save(material);
      return material;
    } catch (error) {
      console.error('An error occurred: ', error);
      throw error;
    }
  }

  async getMaterialById(id: number): Promise<Material | null> {
    return await this.materialRepository.findOneBy({ id });
  }

  async getMaterialAll(): Promise<Material[] | null> {
    return await this.materialRepository.find();
  }

  async updateMaterial(id: number, materialData: Partial<Material>): Promise<Material | null> {
    try {
      const material = await this.materialRepository.findOneBy({ id });
      if (!material) {
        return null;
      }

      this.materialRepository.merge(material, materialData);
      await this.materialRepository.save(material);
      return material;
    } catch (error) {
      console.error('Error updating material:', error);
      throw error;
    }
  }

  async deleteMaterial(id: number): Promise<void> {
    await this.materialRepository.delete(id);
  }
}

export const materialService = new MaterialService();
