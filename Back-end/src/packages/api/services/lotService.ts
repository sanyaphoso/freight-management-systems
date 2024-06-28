import { datasource } from '~/ormconfig';
import { Lot, LotMapping, Material, MaterialHistory, MaterialHistoryType } from '~/packages/database/models/models';

class LotService {
  private lotRepository = datasource.getRepository(Lot);

  async createLot(lotData: Partial<Lot>, materialId: number): Promise<Partial<Lot>> {
    return await datasource.transaction(async (transactionalEntityManager) => {
      try {
        const lot = transactionalEntityManager.create(Lot, lotData);
        await transactionalEntityManager.save(Lot, lot);

        const lotMapping = transactionalEntityManager.create(LotMapping, { material_id: materialId, lot_id: lot.id });
        await transactionalEntityManager.save(LotMapping, lotMapping);

        const material = await transactionalEntityManager.findOneBy(Material, { id: materialId });
        material.total += Number(lot.amount);
        await transactionalEntityManager.save(Material, material);

        return lot;
      } catch (error) {
        console.error('An error occurred: ', error);
        throw error;
      }
    });
  }

  async getLotById(id: number): Promise<Lot | null> {
    return await this.lotRepository.findOneBy({ id });
  }

  async getLotAll(): Promise<Lot[] | null> {
    return await this.lotRepository.find();
  }

  async getLotByMaterialId(materialId: number): Promise<Lot[]> {
    const material = await datasource
      .getRepository(Material)
      .createQueryBuilder('material')
      .leftJoinAndSelect('material.lotMappings', 'lotMapping')
      .leftJoinAndSelect('lotMapping.lot', 'lot')
      .where('material.id = :id', { id: materialId })
      .orderBy('lot.created_at', 'ASC')
      .getOne();
    const lots: Lot[] = [];
    for (const value of material.lotMappings) {
      const lot = await value.lot;
      lots.push(lot);
    }
    return lots;
  }

  async updateLot(id: number, lotData: Partial<Lot>): Promise<Lot | null> {
    const lot = await this.lotRepository.findOneBy({ id });
    if (!lot) {
      return null;
    }
    this.lotRepository.merge(lot, lotData);
    await this.lotRepository.save(lot);
    return lot;
  }

  async deleteLot(id: number): Promise<void> {
    await this.lotRepository.delete(id);
  }

  async depositLot(materialId: number, lotData: Partial<Lot>, userId: number): Promise<Partial<Material>> {
    return await datasource.transaction(async (transactionalEntityManager) => {
      try {
        const lot = transactionalEntityManager.create(Lot, {
          ...lotData,
          available_amount: lotData.amount,
        });
        await transactionalEntityManager.save(Lot, lot);

        const lotMapping = transactionalEntityManager.create(LotMapping, { material_id: materialId, lot_id: lot.id });
        await transactionalEntityManager.save(LotMapping, lotMapping);

        const material = await transactionalEntityManager.findOneBy(Material, { id: materialId });
        material.total += Number(lot.amount);
        await transactionalEntityManager.save(Material, material);

        const materialHistory = await transactionalEntityManager.create(MaterialHistory, {
          material_id: materialId,
          amount: Number(lotData.amount),
          remark: '',
          update_by: userId,
          type: MaterialHistoryType.AddMaterial,
        });
        await transactionalEntityManager.save(MaterialHistory, materialHistory);

        return material;
      } catch (error) {
        console.error('An error occurred: ', error);
        throw error;
      }
    });
  }

  async withdrawLot(materialId: number, amount: number, userId: number): Promise<Partial<Material>> {
    return await datasource.transaction(async (transactionalEntityManager) => {
      try {
        const material = await transactionalEntityManager
          .getRepository(Material)
          .createQueryBuilder('material')
          .leftJoinAndSelect('material.lotMappings', 'lotMapping')
          .leftJoinAndSelect('lotMapping.lot', 'lot')
          .where('material.id = :id', { id: materialId })
          .orderBy('lot.created_at', 'ASC')
          .getOne();
        const total = material.total - amount;
        const realAmount = amount;

        if (total < 0) {
          throw Error('not enough material');
        }

        material.total = total;
        transactionalEntityManager.save(Material, material);

        if (material) {
          for (const value of material.lotMappings) {
            const lot = await value.lot;
            amount = Number(lot.available_amount) - amount;
            if (amount < 0) {
              lot.available_amount = String(0);
              await transactionalEntityManager.save(Lot, lot);
              amount = amount * -1;
            } else {
              lot.available_amount = String(amount);
              await transactionalEntityManager.save(Lot, lot);
              break;
            }
          }
        }

        const materialHistory = await transactionalEntityManager.create(MaterialHistory, {
          material_id: materialId,
          amount: realAmount,
          remark: '',
          update_by: userId,
          type: MaterialHistoryType.WithdrawMaterial,
        });
        await transactionalEntityManager.save(MaterialHistory, materialHistory);

        return material;
      } catch (error) {
        console.error('An error occurred: ', error);
        throw error;
      }
    });
  }
}

export const lotService = new LotService();
