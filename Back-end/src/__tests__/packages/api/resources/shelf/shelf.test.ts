import { faker } from '@faker-js/faker';
import { server } from '~/__tests__/config/helpers';
import { userService } from '~/packages/api/services/userService';

describe('Shelf API', () => {
  let shelfData;
  let token;
  let shelfId;

  beforeAll(() => {
    shelfData = {
      name: faker.animal.bird(),
      detail: faker.lorem.paragraph(),
      imageUrl: './src/__tests__/images/user_image.jpg',
    };
  });

  beforeEach(async () => {
    token = await userService.login('test2', 'kongkung');
  });

  it('should create shelf success', async () => {
    try {
      const { status, body } = await server
        .post('/shelf')
        .auth(token, { type: 'bearer' })
        .field('name', shelfData.name)
        .field('detail', shelfData.detail)
        .attach('image_url', shelfData.imageUrl)
        .type('form');
      shelfId = body.data.id;
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get shelf by id', async () => {
    try {
      const { status } = await await server.get(`/shelf/${shelfId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get shelf all', async () => {
    try {
      const { status } = await await server.get(`/shelf`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should update shelf by id', async () => {
    try {
      const { status } = await await server
        .put(`/shelf/${shelfId}`)
        .auth(token, { type: 'bearer' })
        .field('name', shelfData.name + 'update')
        .field('detail', shelfData.detail)
        .attach('image_url', shelfData.imageUrl);
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should delete shelf by id', async () => {
    try {
      const { status } = await await server.delete(`/shelf/${shelfId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });
});
