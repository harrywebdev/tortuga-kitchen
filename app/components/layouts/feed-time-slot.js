import Component from '@ember/component';
import { action, computed } from '@ember/object';

export default class FeedTimeSlotComponent extends Component {
    classNames = ['feed-time-slot'];
    classNameBindings = ['orders.length::feed-time-slot--empty'];

    @computed('orders.@each.is_collapsed')
    get isExpandedAll() {
        return !this.orders.filter(order => order.is_collapsed).length;
    }

    @computed('slot')
    get slotId() {
        return 'feed-time-slot-' + this.slot.replace(/:/, '');
    }

    @action
    toggleExpandCollapse() {
        let collapse = this.isExpandedAll;
        this.orders.forEach(order => {
            order.set('is_collapsed', collapse);
        });
    }
}
