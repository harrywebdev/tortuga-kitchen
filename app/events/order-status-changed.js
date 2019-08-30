export default class OrderStatusChangedEvent {
    constructor(newStatus = '') {
        this.category = 'order';
        this.action = 'status_changed';
        this.label = newStatus;
        this.value = 0;
    }
}
