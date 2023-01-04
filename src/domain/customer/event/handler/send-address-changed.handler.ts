import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import AddressChangedEvent from "../address-changed.event";

export default class SendAddressChangedHandler implements EventHandlerInterface<AddressChangedEvent> {
  handle(event: AddressChangedEvent): void {
    console.log(`Endereço do cliente ${event.customerId} alterado para: ${event.adderss.street}, ${event.adderss.number}, 
                ${event.adderss.zip}, ${event.adderss.city})}`);
  }
}