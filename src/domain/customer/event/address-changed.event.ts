import EventInterface from "../../@shared/event/event.interface";
import Address from "../value-object/address";

export default class AddressChangedEvent implements EventInterface{
    dataTimeOccurred: Date;
    eventData: any;
    adderss: Address;
    customerId: string;

    constructor(eventData: any, address: Address, customerId: string) {
        this.dataTimeOccurred = new Date();
        this.eventData = eventData;
        this.customerId = customerId;
        this.adderss = address;
    }

}