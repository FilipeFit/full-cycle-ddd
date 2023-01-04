import Customer from "../../customer/entity/customer";
import AddressChangedEvent from "../../customer/event/address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import SendAddressChangedHandler from "../../customer/event/handler/send-address-changed.handler";
import SendFirstCustomerCreatedHandler from "../../customer/event/handler/send-first-customer-created.handler";
import SendSecondCustomerCreatedHandler from "../../customer/event/handler/send-second-customer-created.handler";
import Address from "../../customer/value-object/address";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should notify customer event handler", () => {
    const eventsDispatcher = new EventDispatcher();
    const fisrtCustomerEventHandler = new SendFirstCustomerCreatedHandler();
    const secondCustomerEventHandler = new SendSecondCustomerCreatedHandler();
    const spyFisrtCustomerEventHandler = jest.spyOn(fisrtCustomerEventHandler, "handle");
    const spySecondCustomerEventHandler = jest.spyOn(secondCustomerEventHandler, "handle");

    eventsDispatcher.register("CustomerCreatedEvent", fisrtCustomerEventHandler);
    eventsDispatcher.register("CustomerCreatedEvent", secondCustomerEventHandler);

    expect(eventsDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(fisrtCustomerEventHandler);
    expect(eventsDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondCustomerEventHandler);

    const customer1 = new Customer("123", "Customer 1");
    const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer1.Address = address1;
    
    const customerCreatedEvent = new CustomerCreatedEvent(customer1);
    eventsDispatcher.notify(customerCreatedEvent);
    expect(spyFisrtCustomerEventHandler).toHaveBeenCalled();
    expect(spySecondCustomerEventHandler).toHaveBeenCalled();
  });
  
  it("should notify address event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const addressChangedEventHandler = new SendAddressChangedHandler();
    const spyAddressChangedEventHandler = jest.spyOn(addressChangedEventHandler, "handle");

    eventDispatcher.register("AddressChangedEvent", addressChangedEventHandler);
    expect(eventDispatcher.getEventHandlers["AddressChangedEvent"][0]).toMatchObject(addressChangedEventHandler);

    const customer1 = new Customer("123", "Customer 1");
    const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer1.Address = address1;

    const addressChangedEvent = new AddressChangedEvent("AddressChangedEvent",address1, customer1.id);
    eventDispatcher.notify(addressChangedEvent);
    expect(spyAddressChangedEventHandler).toHaveBeenCalled();
  });
});
