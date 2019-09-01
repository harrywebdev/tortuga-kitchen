import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import { not, alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default class FeedLayoutComponent extends Component {
    @service feedFilters;
    @service flashMessages;
    @service kitchenState;
    @service orderManager;
    @service websocket;

    classNames = ['feed-layout'];

    // model
    orders = [];
    slots = [];
    searchTerm = '';

    didInsertElement() {
        super.didInsertElement(...arguments);
        this.send('scrollToTop');
    }

    @not('filteredOrdersBySearch.length') noOrdersToShow;
    @alias('feedFilters.isDefault') showPagination;

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
                slot: slot,
                orders: this.filteredOrdersBySearch.filter(
                    order => order.order_time.getTime() == slot.datetime.getTime()
                ),
            };
        });
    }

    @computed('rawOrders.[]')
    get lastOrderPaginationPrevToken() {
        return this.orders.sortBy('order_time').get('firstObject.pagination.prev');
    }

    @computed('rawOrders.[]')
    get lastOrderPaginationNextToken() {
        return this.orders.sortBy('order_time').get('lastObject.pagination.next');
    }

    @(task(function*(open) {
        if (open) {
            yield this.kitchenState.openShop.perform();
        } else {
            yield this.kitchenState.closeShop.perform();
        }
    }).drop())
    openCloseShop;

    @action
    scrollToTop() {
        document
            .getElementById('scrollToHere')
            .scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
}
