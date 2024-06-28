import { datasource } from '~/ormconfig';
import { Unit } from '~/packages/database/models/models';

class UnitService {
  private unitRepository = datasource.getRepository(Unit);

  async createUnit(unitData: Partial<Unit>): Promise<Unit> {
    try {
      const unit = this.unitRepository.create(unitData);
      await this.unitRepository.save(unit);
      return unit;
    } catch (error) {
      console.error('An error occurred: ', error);
      throw error;
    }
  }

  async getUnitById(id: number): Promise<Unit | null> {
    return await this.unitRepository.findOneBy({ id });
  }

  async getUnitAll(): Promise<Unit[] | null> {
    return await this.unitRepository.find();
  }

  async updateUnit(id: number, unitData: Partial<Unit>): Promise<Unit | null> {
    try {
      const unit = await this.unitRepository.findOneBy({ id });
      if (!unit) {
        return null;
      }

      this.unitRepository.merge(unit, unitData);
      await this.unitRepository.save(unit);
      return unit;
    } catch (error) {
      console.error('Error updating unit:', error);
      throw error;
    }
  }

  async deleteUnit(id: number): Promise<void> {
    await this.unitRepository.delete(id);
  }
}

export const unitService = new UnitService();
