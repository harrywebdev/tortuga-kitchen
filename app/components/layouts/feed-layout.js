import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import { not } from '@ember/object/computed';

export default class FeedLayoutComponent extends Component {
    @service flashMessages;
    @service orderManager;

    classNames = ['feed-layout'];

    // model
    orders = [];
    slots = [];

    @not('filteredOrdersBySearch.length') noOrdersToShow;

    searchTerm = '';

    @computed('orderManager.changeStatus.isRunning')
    get busy() {
        return this.orderManager.changeStatus.isRunning;
    }

    @computed('orders.[]', 'searchTerm')
    get filteredOrdersBySearch() {
        if (this.searchTerm !== '') {
            const escapedSearchTerm = this.searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            var re = new RegExp(escapedSearchTerm, 'ig');
            return this.orders.filter(order => re.test(order.customer.get('name')));
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
    scrollToTop() {
        document.getElementById('scrollToHere').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
}
