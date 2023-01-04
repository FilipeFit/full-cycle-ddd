import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface{

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id: id },
      include: ["items"],
    });
    return new Order(orderModel.id, orderModel.customer_id, 
      orderModel.items.map((item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)));
  }

  findAll(): Promise<Order[]> {
    const orders: Order[] = [];
    return OrderModel.findAll({
      include: ["items"],
    }).then((orderModels) => {
      orderModels.forEach((orderModel) => {
        orders.push(new Order(orderModel.id, orderModel.customer_id, 
          orderModel.items.map((item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity))));
      });
      return orders;
    });
  }
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }
}
