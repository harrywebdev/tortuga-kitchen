import Component from '@ember/component';
import { action, computed } from '@ember/object';
import moment from 'moment';

export default class FeedTimeSlotComponent extends Component {
    classNames = ['feed-time-slot'];
    classNameBindings = ['orders.length::feed-time-slot--empty'];

    @computed('orders.@each.is_collapsed')
    get isExpandedAll() {
        return !this.orders.filter(order => order.is_collapsed).length;
    }

    @computed('slot.datetime')
    get slotId() {
        return 'feed-time-slot-' + this.slot.datetime.toISOString();
    }

    @computed('slot.title')
    get title() {
        return this.slot.title;
    }

    @computed('slot.datetime')
    get infoLabel() {
        const datetime = moment(this.slot.datetime);

        if (datetime.format('D') != moment().format('D')) {
            return datetime.format('dddd');
        }

        return '';
    }

    @action
    toggleExpandCollapse() {
        let collapse = this.isExpandedAll;
        this.orders.forEach(order => {
            order.set('is_collapsed', collapse);
        });
    }
}
