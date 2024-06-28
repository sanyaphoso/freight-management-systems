import { datasource } from '~/ormconfig';
import { Order, OrderType } from '~/packages/database/models/models';
import { CustomError } from '../errors/customerError';

class OrderService {
  private orderRepository = datasource.getRepository(Order);

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create({
      ...orderData,
      status: OrderType.Pending,
    });
    await this.orderRepository.save(order);
    return order;
  }

  async getOrderById(id: number): Promise<Order | null> {
    return this.orderRepository.findOneBy({ id });
  }

  async getOrderAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async updateOrder(id: number, orderData: Partial<Order>): Promise<Order | null> {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      return null;
    }

    this.orderRepository.merge(order, orderData);
    await this.orderRepository.save(order);
    return order;
  }

  async deleteOrder(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }

  async updateStatusInProgress(id: number): Promise<Order | null> {
    const updateResult = await this.orderRepository.createQueryBuilder().update(Order).set({ status: OrderType.InProgress }).where('id = :id', { id }).execute();

    if (updateResult.affected === 0) {
      throw new CustomError(`Not found order id ${id}`, 400);
    }

    return this.orderRepository.findOne({ where: { id } });
  }

  async updateStatusSuccess(id: number): Promise<Order | null> {
    const updateResult = await this.orderRepository.createQueryBuilder().update(Order).set({ status: OrderType.Success }).where('id = :id', { id }).execute();

    if (updateResult.affected === 0) {
      throw new CustomError(`Not found order id ${id}`, 400);
    }

    return this.orderRepository.findOne({ where: { id } });
  }
}

export const orderService = new OrderService();
