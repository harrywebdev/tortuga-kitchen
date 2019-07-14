import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { not } from '@ember/object/computed';

export default class FeedLayoutComponent extends Component {
    classNames = ['feed-layout'];

    // model
    orders = [];
    slots = [];

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

    @computed('filteredOrdersBySearch.[]', 'slots.[]')
    get ordersByTimeSlot() {
        return this.slots.map(slot => {
            return {
                title: slot,
                orders: this.filteredOrdersBySearch.filter(order => order.orderTimeSlot === slot),
            };
        });
    }

    @action
    scrollToCurrentSlot() {
        // TODO: now minus 30 minutes
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
