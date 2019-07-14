import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { not } from '@ember/object/computed';

export default class FeedLayoutComponent extends Component {
    classNames = ['feed-layout'];

    // model
    orders = [];

    @not('filteredOrdersBySearch.length') noOrdersToShow;

    searchTerm = '';

    @computed('orders.[]', 'searchTerm')
    get filteredOrdersBySearch() {
        if (this.searchTerm !== '') {
            const escapedSearchTerm = this.searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            var re = new RegExp(escapedSearchTerm, 'ig');
            return this.orders.filter(order => re.test(order.customer_name));
        }

        return this.orders;
    }

    @computed('filteredOrdersBySearch.[]')
    get ordersByTimeSlot() {
        // HACK: generate slots
        // TODO: SSoT of this
        let slots = [];
        for (var j = 0; j < 10; j++) {
            let hour = new Date().getHours() + j;
            hour = hour > 23 ? hour - 24 : hour;
            slots.push(`${hour}:${'00'}`.padStart(5, '0'));
            slots.push(`${hour}:${'30'}`.padStart(5, '0'));
        }

        return slots.map(slot => {
            return {
                title: slot,
                orders: this.filteredOrdersBySearch.filter(order => order.order_time === slot),
            };
        });
    }

    @action
    scrollToCurrentSlot() {
        // TODO: now - 30 minutes
        const minutes = new Date().getMinutes();
        const hours = new Date().getHours();
        var m = ((((minutes + 15) / 30) | 0) * 30) % 60;
        var h = (((minutes / 105 + 0.5) | 0) + hours) % 24;

        const slot = `${h.toString().padStart(2, 0)}${m.toString().padStart(2, 0)}`;
        const element = document.getElementById(`feed-time-slot-${slot}`);

        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
