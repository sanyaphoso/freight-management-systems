import { faker } from '@faker-js/faker';
import { server } from '~/__tests__/config/helpers';
import { shelfService } from '~/packages/api/services/shelfService';
import { userService } from '~/packages/api/services/userService';

describe('Floor API', () => {
  let shelfData;
  let floorData;
  let token;
  let shelfId;

  beforeAll(() => {
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
  });

  beforeEach(async () => {
    token = await userService.login('test2', 'kongkung');
    shelfId = (await shelfService.createShelf({ ...shelfData })).id;
  });

  afterEach(async () => {
    shelfService.deleteShelf(shelfId);
  });

  it('should create floor success', async () => {
    try {
      const { status, body } = await server
        .post('/floor')
        .auth(token, { type: 'bearer' })
        .field('name', floorData.name)
        .field('detail', floorData.detail)
        .field('shelf_id', shelfId)
        .attach('image_url', floorData.imageUrl)
        .type('form');
      shelfId = body.data.id;
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get floor by id', async () => {
    try {
      const { status } = await await server.get(`/floor/${shelfId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get floor by shelf id', async () => {
    try {
      const { status } = await await server.get(`/floor/shelf/${shelfId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get floor all', async () => {
    try {
      const { status } = await await server.get(`/floor`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should update floor by id', async () => {
    try {
      const { status } = await await server
        .put(`/floor/${shelfId}`)
        .auth(token, { type: 'bearer' })
        .field('name', floorData.name + 'update')
        .field('detail', floorData.detail)
        .field('shelf_id', shelfId)
        .attach('image_url', floorData.imageUrl);
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should delete floor by id', async () => {
    try {
      const { status } = await await server.delete(`/floor/${shelfId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });
});
