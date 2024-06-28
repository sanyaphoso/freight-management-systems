import { faker } from '@faker-js/faker';
import { server } from '~/__tests__/config/helpers';
import { userService } from '~/packages/api/services/userService';

describe('Unit API', () => {
  let unitData;
  let token;
  let unitId;

  beforeAll(() => {
    unitData = {
      name: faker.animal.bird(),
      detail: faker.lorem.paragraph(),
    };
  });

  beforeEach(async () => {
    token = await userService.login('test2', 'kongkung');
  });

  it('should create unit success', async () => {
    try {
      const { status, body } = await server.post('/unit').auth(token, { type: 'bearer' }).field('name', unitData.name).field('detail', unitData.detail).type('form');
      unitId = body.data.id;
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get unit by id', async () => {
    try {
      const { status } = await await server.get(`/unit/${unitId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get unit all', async () => {
    try {
      const { status } = await await server.get(`/unit`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should update unit by id', async () => {
    try {
      const { status } = await await server
        .put(`/unit/${unitId}`)
        .auth(token, { type: 'bearer' })
        .field('name', unitData.name + 'update')
        .field('detail', unitData.detail);
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should delete unit by id', async () => {
    try {
      const { status } = await await server.delete(`/unit/${unitId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });
});
