import { faker } from '@faker-js/faker';
import { server } from '~/__tests__/config/helpers';
import { floorService } from '~/packages/api/services/floorService';
import { materialService } from '~/packages/api/services/materialService';
import { shelfService } from '~/packages/api/services/shelfService';
import { unitService } from '~/packages/api/services/unitService';
import { userService } from '~/packages/api/services/userService';
import { MaterialHistoryType } from '~/packages/database/models/models';

describe('MaterialHistory API', () => {
  let materialHistoryData;
  let token;
  let materialHistoryId;

  let shelfData;
  let floorData;
  let unitData;
  let materialData;
  let materialId;
  let shelfId;
  let floorId;
  let unitId;

  beforeAll(async () => {
    shelfData = {
      name: faker.animal.bird(),
      detail: faker.lorem.paragraph(),
      imageUrl: './src/__tests__/images/user_image.jpg',
    };

    floorData = {
      name: faker.animal.bird(),
      detail: faker.lorem.paragraph(),
      imageUrl: './src/__tests__/images/user_image.jpg',
    };

    unitData = {
      name: faker.animal.bird(),
      detail: faker.lorem.paragraph(),
    };

    materialData = {
      name: faker.word.words(2),
      detail: faker.lorem.paragraph(),
      total: '0',
      imageUrl: './src/__tests__/images/user_image.jpg',
    };

    token = await userService.login('test2', 'kongkung');
    shelfId = (await shelfService.createShelf({ ...shelfData })).id;
    floorId = (await floorService.createFloor({ ...floorData, shelve_id: shelfId })).id;
    unitId = (await unitService.createUnit({ ...unitData })).id;
    materialId = (await materialService.createMaterial({ ...materialData, unit_id: unitId, floor_id: floorId })).id;

    materialHistoryData = {
      remark: faker.lorem.paragraph(),
      amount: 100,
      type: MaterialHistoryType.AddMaterial,
    };
  });

  afterAll(async () => {
    shelfService.deleteShelf(shelfId);
    floorService.deleteFloor(floorId);
    unitService.deleteUnit(unitId);
    materialService.deleteMaterial(materialId);
  });

  it('should create materialHistory success', async () => {
    try {
      const { status, body } = await server
        .post('/material-history')
        .auth(token, { type: 'bearer' })
        .field('material_id', materialId)
        .field('remark', materialHistoryData.remark)
        .field('amount', materialHistoryData.amount)
        .field('type', materialHistoryData.type)
        .type('form');
      materialHistoryId = body.data.id;
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get materialHistory by id', async () => {
    try {
      const { status } = await await server.get(`/material-history/${materialHistoryId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get materialHistory all', async () => {
    try {
      const { status } = await await server.get(`/material-history`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should update materialHistory by id', async () => {
    try {
      const { status } = await await server
        .put(`/material-history/${materialHistoryId}`)
        .auth(token, { type: 'bearer' })
        .field('material_id', materialId)
        .field('remark', materialHistoryData.remark + 'update')
        .field('amount', materialHistoryData.amount)
        .field('type', materialHistoryData.type)
        .type('form');
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should delete materialHistory by id', async () => {
    try {
      const { status } = await await server.delete(`/material-history/${materialHistoryId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });
});
