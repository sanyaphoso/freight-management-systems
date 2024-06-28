import { faker } from '@faker-js/faker';
import { server } from '~/__tests__/config/helpers';
import { orderService } from '~/packages/api/services/orderService';
import { userService } from '~/packages/api/services/userService';

describe('Order Group API', () => {
  let token;
  let orderId1;
  let orderId2;

  let orderGroupId;

  beforeAll(async () => {
    orderId1 = {
      customer_name: faker.internet.userName(),
      name: faker.animal.bird(),
      detail: faker.lorem.paragraph(),
      address: faker.location.streetAddress(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    };

    orderId2 = {
      customer_name: faker.internet.userName(),
      name: faker.animal.bird(),
      detail: faker.lorem.paragraph(),
      address: faker.location.streetAddress(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    };

    orderId1 = (await orderService.createOrder({ ...orderId1 })).id;
    orderId2 = (await orderService.createOrder({ ...orderId2 })).id;
  });

  beforeEach(async () => {
    token = await userService.login('test2', 'kongkung');
  });

  it('should create order group success', async () => {
    try {
      const { status, body } = await server.post('/order-group').auth(token, { type: 'bearer' }).field('orders_ids', `${orderId1},${orderId2}`).field('node', '{}').type('form');
      orderGroupId = body.data.orderGroup.id;
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get order group by id', async () => {
    try {
      const { status } = await server.get(`/order-group/${orderGroupId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should change status order group success', async () => {
    try {
      const { status } = await server.post(`/order-group/success/${orderGroupId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should change status order group Inprogress', async () => {
    try {
      const { status } = await server.post(`/order-group/in-progress/${orderGroupId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should get order group all', async () => {
    try {
      const { status } = await server.get(`/order-group`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should update order group by id', async () => {
    try {
      const { status } = await server
        .put(`/order-group/${orderGroupId}`)
        .auth(token, { type: 'bearer' })
        .field('orders_ids', `${orderId1},${orderId2}`)
        .field('node', '{}')
        .type('form');
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });

  it('should delete order group by id', async () => {
    try {
      const { status } = await server.delete(`/order-group/${orderGroupId}`).auth(token, { type: 'bearer' });
      expect(status).toBe(200);
    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error;
    }
  });
});
