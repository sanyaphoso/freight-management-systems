import { faker } from '@faker-js/faker';
import { server } from '~/__tests__/config/helpers';
import { userService } from '~/packages/api/services/userService';

describe('Order API', () => {
  let orderData;
  let token;
  let orderId;

  beforeAll(() => {
    orderData = {
      customerName: faker.internet.userName(),
      name: faker.animal.bird(),
      detail: faker.lorem.paragraph(),
      address: faker.location.streetAddress(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    };
  });

  beforeEach(async () => {
    token = await userService.login('test2', 'kongkung');
  });

  it('should create order success', async () => {
    try {
      const { status, body } = await server
        .post('/order')
        .auth(token, { type: 'bearer' })
        .field('customer_name', orderData.customerName)
        .field('name', orderData.name)
        .field('detail', orderData.detail)
        .field('address', orderData.address)
        .field('latitude', orderData.latitude)
        .field('longitude', orderData.longitude)
        .type('form');
      orderId = body.data.id;
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get order by id', async () => {
    try {
      const { status } = await await server.get(`/order/${orderId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should change status order success', async () => {
    try {
      const { status } = await await server.post(`/order/success/${orderId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should change status order Inprogress', async () => {
    try {
      const { status } = await await server.post(`/order/in-progress/${orderId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get order all', async () => {
    try {
      const { status } = await await server.get(`/order`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should update order by id', async () => {
    try {
      const { status } = await await server
        .put(`/order/${orderId}`)
        .auth(token, { type: 'bearer' })
        .field('customer_name', orderData.customerName + 'update')
        .field('name', orderData.name)
        .field('detail', orderData.detail)
        .field('address', orderData.address)
        .field('latitude', orderData.latitude)
        .field('longitude', orderData.longitude)
        .type('form');
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should delete order by id', async () => {
    try {
      const { status } = await await server.delete(`/order/${orderId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });
});
