import { datasource } from '~/ormconfig';
import { Floor } from '~/packages/database/models/models';

class FloorService {
  private floorRepository = datasource.getRepository(Floor);

  async createFloor(floorData: Partial<Floor>): Promise<Floor> {
    try {
      const floor = this.floorRepository.create(floorData);
      await this.floorRepository.save(floor);
      return floor;
    } catch (error) {
      console.error('An error occurred: ', error);
      throw error;
    }
  }

  async getFloorById(id: number): Promise<Floor | null> {
    return await this.floorRepository.findOneBy({ id });
  }

  async getFloorsByShelfId(shelfId: number): Promise<Floor[] | []> {
    const floors = await this.floorRepository.find({
      where: {
        shelve_id: shelfId,
      },
    });
    return floors;
  }

  async getFloorAll(): Promise<Floor[] | null> {
    return await this.floorRepository.find();
  }

  async updateFloor(id: number, floorData: Partial<Floor>): Promise<Floor | null> {
    try {
      const floor = await this.floorRepository.findOneBy({ id });
      if (!floor) {
        return null;
      }

      this.floorRepository.merge(floor, floorData);
      await this.floorRepository.save(floor);
      return floor;
    } catch (error) {
      console.error('Error updating floor:', error);
      throw error;
    }
  }

  async deleteFloor(id: number): Promise<void> {
    await this.floorRepository.delete(id);
  }
}

export const floorService = new FloorService();
