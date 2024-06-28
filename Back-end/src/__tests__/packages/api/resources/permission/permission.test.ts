import { faker } from '@faker-js/faker';
import { server } from '~/__tests__/config/helpers';
import { userService } from '~/packages/api/services/userService';

describe('Permission API', () => {
  let permissionData;
  let token;
  let permissionId;

  beforeAll(() => {
    permissionData = {
      name: faker.animal.bird(),
      action: faker.word.noun(),
    };
  });

  beforeEach(async () => {
    token = await userService.login('test2', 'kongkung');
  });

  it('should create permission success', async () => {
    try {
      const { status, body } = await server
        .post('/permission')
        .auth(token, { type: 'bearer' })
        .field('name', permissionData.name)
        .field('action', permissionData.action)
        .type('form');
      permissionId = body.data.id;
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get permission by id', async () => {
    try {
      const { status } = await await server.get(`/permission/${permissionId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get permission all', async () => {
    try {
      const { status } = await await server.get(`/permission`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should update permission by id', async () => {
    try {
      const { status } = await await server
        .put(`/permission/${permissionId}`)
        .auth(token, { type: 'bearer' })
        .field('name', permissionData.name + 'update')
        .field('action', permissionData.action);
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should delete permission by id', async () => {
    try {
      const { status } = await await server.delete(`/permission/${permissionId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });
});
