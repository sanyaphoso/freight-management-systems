import { datasource } from '~/ormconfig';
import { Shelf } from '~/packages/database/models/models';

class ShelfService {
  private shelfRepository = datasource.getRepository(Shelf);

  async createShelf(shelfData: Partial<Shelf>): Promise<Shelf> {
    try {
      const shelf = this.shelfRepository.create(shelfData);
      await this.shelfRepository.save(shelf);
      return shelf;
    } catch (error) {
      console.error('An error occurred: ', error);
      throw error;
    }
  }

  async getShelfById(id: number): Promise<Shelf | null> {
    return await this.shelfRepository.findOneBy({ id });
  }

  async getShelfAll(): Promise<Shelf[] | null> {
    return await this.shelfRepository.find();
  }

  async updateShelf(id: number, shelfData: Partial<Shelf>): Promise<Shelf | null> {
    try {
      const shelf = await this.shelfRepository.findOneBy({ id });
      if (!shelf) {
        return null;
      }

      this.shelfRepository.merge(shelf, shelfData);
      await this.shelfRepository.save(shelf);
      return shelf;
    } catch (error) {
      console.error('Error updating shelf:', error);
      throw error;
    }
  }

  async deleteShelf(id: number): Promise<void> {
    await this.shelfRepository.delete(id);
  }
}

export const shelfService = new ShelfService();
