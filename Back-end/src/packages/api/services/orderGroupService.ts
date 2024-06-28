import { In } from 'typeorm';
import { datasource } from '~/ormconfig';
import { LogisticType, Order, OrdersGroup } from '~/packages/database/models/models';
import { CustomError } from '../errors/customerError';

class OrdersGroupService {
  private ordersGroupRepository = datasource.getRepository(OrdersGroup);

  // eslint-disable-next-line @typescript-eslint/member-delimiter-style
  async createOrdersGroup(orderIds: number[], node: string): Promise<{ orderGroup: OrdersGroup; orders: Order[] }> {
    return await datasource.transaction(async (transactionalEntityManager) => {
      const orderGroupRepository = transactionalEntityManager.getRepository(OrdersGroup);
      const orderGroup = orderGroupRepository.create({
        node: node,
        status: LogisticType.Pending,
      });

      await orderGroupRepository.save(orderGroup);

      const ordersRepository = transactionalEntityManager.getRepository(Order);
      const orders = await ordersRepository.findBy({ id: In(orderIds) });

      const invalidOrder = orders.find((order) => order.orders_group_id !== null);
      if (invalidOrder) {
        throw new Error(`Order id ${invalidOrder.id} already exists in an order group`);
      }

      orders.forEach((order) => {
        order.orders_group_id = orderGroup.id;
        order.send_date = new Date();
      });

      await ordersRepository.save(orders);

      return {
        orderGroup,
        orders,
      };
    });
  }

  async getOrdersGroupById(id: number): Promise<OrdersGroup | null> {
    const orderGroup = await this.ordersGroupRepository.createQueryBuilder('order_group').leftJoinAndSelect('order_group.orders', 'orders').where({ id: id }).getOne();
    if (!orderGroup) throw new CustomError(`Not found order group id: ${id}`, 400);
    return orderGroup;
  }

  async getOrdersGroupAll(): Promise<OrdersGroup[] | null> {
    return await this.ordersGroupRepository.createQueryBuilder('order_group').leftJoinAndSelect('order_group.orders', 'orders').getMany();
  }

  async updateStatusInProgress(id: number): Promise<OrdersGroup | null> {
    const orderGroup = await this.ordersGroupRepository
      .createQueryBuilder()
      .update(OrdersGroup)
      .set({ status: LogisticType.InProgress })
      .where('id = :id', { id })
      .returning(['id'])
      .execute();

    if (orderGroup.affected === 0) {
      throw new CustomError(`Not found order id ${id}`, 400);
    }

    return this.ordersGroupRepository
      .createQueryBuilder('order_group')
      .leftJoinAndSelect('order_group.orders', 'orders')
      .where('order_group.id = :id', { id }) // Consistency in query style
      .getOne();
  }

  async updateStatusSuccess(id: number): Promise<OrdersGroup | null> {
    const orderGroup = await this.ordersGroupRepository
      .createQueryBuilder()
      .update(OrdersGroup)
      .set({ status: LogisticType.Success })
      .where('id = :id', { id })
      .returning(['id'])
      .execute();

    if (orderGroup.affected === 0) {
      throw new CustomError(`Not found order id ${id}`, 400);
    }

    return this.ordersGroupRepository
      .createQueryBuilder('order_group')
      .leftJoinAndSelect('order_group.orders', 'orders')
      .where('order_group.id = :id', { id }) // Consistency in query style
      .getOne();
  }

  // eslint-disable-next-line @typescript-eslint/member-delimiter-style
  async updateOrdersGroup(id: number, orderIds: number[], node: string): Promise<{ orderGroup: OrdersGroup; orders: Order[] }> {
    return await datasource.transaction(async (transactionalEntityManager) => {
      const orderRepository = transactionalEntityManager.getRepository(Order);
      const orderGroupRepository = transactionalEntityManager.getRepository(OrdersGroup);

      const orderGroup = await orderGroupRepository.findOne({ where: { id } });
      if (!orderGroup) {
        throw new CustomError(`Order group not found with id: ${id}`, 400);
      }
      orderGroup.node = node;
      orderGroup.save();

      const existingOrders = await orderRepository.findBy({ id: In(orderIds) });
      const invalidOrder = existingOrders.find((order) => order.orders_group_id != null && order.orders_group_id !== id);
      if (invalidOrder) {
        throw new CustomError(`Order id ${invalidOrder.id} is already in an order group`, 400);
      }

      await orderRepository.createQueryBuilder().update(Order).set({ orders_group_id: null, send_date: null }).where('orders_group_id = :id', { id }).execute();

      await orderRepository
        .createQueryBuilder()
        .update(Order)
        .set({ orders_group_id: id, send_date: () => 'CURRENT_TIMESTAMP' }) // Use database function for current timestamp
        .where('id IN (:...orderIds)', { orderIds })
        .execute();

      const updatedOrders = await orderRepository.findBy({ id: In(orderIds) });
      return {
        orderGroup,
        orders: updatedOrders,
      };
    });
  }

  async deleteOrdersGroup(id: number): Promise<void> {
    await datasource
      .transaction(async (transactionalEntityManager) => {
        const orderGroupRepository = transactionalEntityManager.getRepository(OrdersGroup);
        const orderRepository = transactionalEntityManager.getRepository(Order);

        await orderRepository.createQueryBuilder().update(Order).set({ orders_group_id: null, send_date: null }).where('orders_group_id = :id', { id }).execute();

        await orderGroupRepository.delete(id);
      })
      .catch((error) => {
        console.error('Error deleting ordersGroup:', error);
        throw new CustomError('Error deleting ordersGroup', 500);
      });
  }
}

export const ordersGroupService = new OrdersGroupService();
