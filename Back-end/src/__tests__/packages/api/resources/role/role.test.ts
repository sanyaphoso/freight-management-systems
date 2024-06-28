import { faker } from '@faker-js/faker';
import { server } from '~/__tests__/config/helpers';
import { userService } from '~/packages/api/services/userService';

describe('Role API', () => {
  let roleData;
  let token;
  let roleId;
  let userId;

  beforeAll(async () => {
    roleData = {
      name: faker.animal.bird(),
    };
    const userData = {
      full_name: faker.internet.userName(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      upload_image: faker.internet.url(),
    };
    userId = (await userService.createUser({ ...userData })).id;
  });

  beforeEach(async () => {
    token = await userService.login('test2', 'kongkung');
  });

  it('should create role success', async () => {
    try {
      const { status, body } = await server.post('/role').auth(token, { type: 'bearer' }).field('name', roleData.name).type('form');
      roleId = body.data.id;
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get role by id', async () => {
    try {
      const { status } = await await server.get(`/role/${roleId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get role all', async () => {
    try {
      const { status } = await await server.get(`/role`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should add role user by user id', async () => {
    try {
      const { status } = await server.post('/role/add-role-user').auth(token, { type: 'bearer' }).field('user_id', userId).field('role_ids', roleId).type('form');
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should update role user by user id', async () => {
    try {
      const { status } = await server.post('/role/update-role-user').auth(token, { type: 'bearer' }).field('user_id', userId).field('role_ids', roleId).type('form');
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should update role by id', async () => {
    try {
      const { status } = await await server
        .put(`/role/${roleId}`)
        .auth(token, { type: 'bearer' })
        .field('name', roleData.name + 'update');
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should delete role by id', async () => {
    try {
      const { status } = await await server.delete(`/role/${roleId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });
});
