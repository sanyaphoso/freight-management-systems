import { faker } from '@faker-js/faker';
import { server } from '~/__tests__/config/helpers';
import { floorService } from '~/packages/api/services/floorService';
import { materialService } from '~/packages/api/services/materialService';
import { shelfService } from '~/packages/api/services/shelfService';
import { unitService } from '~/packages/api/services/unitService';
import { userService } from '~/packages/api/services/userService';

describe('Floor API', () => {
  let shelfData;
  let floorData;
  let unitData;
  let materialData;
  let token;
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
    materialId = (await materialService.createMaterial({ ...materialData, floor_id: floorId, unit_id: unitId })).id;
  });

  afterAll(async () => {
    shelfService.deleteShelf(shelfId);
    floorService.deleteFloor(floorId);
    unitService.deleteUnit(unitId);
    materialService.deleteMaterial(materialId);
  });

  it('should deposit lot success', async () => {
    try {
      const { status } = await server
        .post('/lot/deposit')
        .auth(token, { type: 'bearer' })
        .field('material_id', materialId)
        .field('name', faker.internet.userName())
        .field('amount', '100')
        .field('price', '100')
        .field('detail', faker.lorem.paragraph())
        .field('buy_date', '2024-01-23 19:15:03.890831')
        .type('form');
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get lot by material id', async () => {
    try {
      const { status } = await await server.get(`/lot/${materialId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get material all', async () => {
    try {
      const { status } = await await server.get(`/lot`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should withdraw lot success', async () => {
    try {
      const { status } = await server.post('/lot/withdraw').auth(token, { type: 'bearer' }).field('material_id', materialId).field('amount', '100').type('form');
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });
});
