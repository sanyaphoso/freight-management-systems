import { faker } from '@faker-js/faker';
import { server } from '~/__tests__/config/helpers';
import { floorService } from '~/packages/api/services/floorService';
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
  });

  afterAll(async () => {
    shelfService.deleteShelf(shelfId);
    floorService.deleteFloor(floorId);
    unitService.deleteUnit(unitId);
  });

  it('should create floor success', async () => {
    try {
      const { status, body } = await server
        .post('/material')
        .auth(token, { type: 'bearer' })
        .field('name', materialData.name)
        .field('detail', materialData.detail)
        .field('total', materialData.total)
        .field('floor_id', floorId)
        .field('unit_id', unitId)
        .attach('image_url', materialData.imageUrl)
        .type('form');
      materialId = body.data.id;
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get material by id', async () => {
    try {
      const { status } = await await server.get(`/material/${materialId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get material all', async () => {
    try {
      const { status } = await await server.get(`/material`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should update material by id', async () => {
    try {
      const { status } = await await server
        .put(`/material/${materialId}`)
        .auth(token, { type: 'bearer' })
        .field('name', materialData.name + 'update')
        .field('detail', materialData.detail)
        .field('total', materialData.total)
        .field('floor_id', floorId)
        .field('unit_id', unitId)
        .attach('image_url', materialData.imageUrl);
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should delete material by id', async () => {
    try {
      const { status } = await await server.delete(`/material/${materialId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });
});
