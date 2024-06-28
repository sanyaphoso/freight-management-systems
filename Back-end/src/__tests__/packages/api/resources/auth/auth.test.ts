import { faker } from '@faker-js/faker';
import { server } from '~/__tests__/config/helpers';
import { userService } from '~/packages/api/services/userService';
import { getBodyToken } from '~/packages/api/util/jwt';

describe('Users API', () => {
  let userData;
  let token;

  beforeAll(() => {
    userData = {
      fullName: faker.internet.userName(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };
  });

  afterAll(async () => {
    await userService.deleteUser(getBodyToken(token).id);
  });

  it('should register user success', async () => {
    try {
      const { status } = await await server
        .post('/auth/register')
        .field('full_name', userData.fullName)
        .field('username', userData.username)
        .field('password', userData.password)
        .attach('upload_image', './src/__tests__/images/user_image.jpg')
        .type('form');

      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should register user fail', async () => {
    try {
      const { status } = await await server
        .post('/auth/register')
        .field('username', userData.username)
        .field('password', userData.password)
        .attach('upload_image', './src/__tests__/images/user_image.jpg')
        .type('form');
      expect(status).toBe(400);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should login a user', async () => {
    try {
      const { status, body } = await server.post('/auth/login').send({
        username: userData.username,
        password: userData.password,
      });
      token = body.data.token;
      expect(status).toBe(200);
      expect(body.data).toHaveProperty('token');
    } catch (error) {
      console.error('Error during user login test:', error);
      throw error;
    }
  });

  it('should login a user fail', async () => {
    try {
      const { status } = await server
        .post('/auth/login')
        .field({
          username: 'K@gmail.com',
          password: userData.password,
        })
        .type('form');
      console.log(status);
      expect(status).toBe(401);
    } catch (error) {
      console.error('Error during user login test:', error);
      throw error;
    }
  });

  it('should get all users info', async () => {
    try {
      const { status } = await server.get('/users/user').auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user login test:', error);
      throw error;
    }
  });

  it('should get user info', async () => {
    try {
      const { status, body } = await server.get('/users/user-info').auth(token, { type: 'bearer' });
      expect(status).toBe(200);
      expect(body.data).toHaveProperty('username');
    } catch (error) {
      console.error('Error during user login test:', error);
      throw error;
    }
  });
});
