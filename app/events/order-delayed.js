export default class OrderDelayedEvent {
    constructor(newOrderTime = '') {
        this.category = 'order';
        this.action = 'delayed';
        this.label = newOrderTime;
        this.value = 0;
    }
}
