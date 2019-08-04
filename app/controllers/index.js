import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class IndexController extends Controller {
    @service feedFilters;
    @service flashMessages;

    @computed('model.@each.{status,order_time}', 'feedFilters.filters.[]')
    get feedOrders() {
        const orders = this.get('model');

        return orders.filter(order => this.feedFilters.isStatusActive(order.status));
    }

    @computed('feedOrders')
    get feedSlots() {
        const orders = this.get('feedOrders');

        return orders
            .map(order => ({ datetime: order.get('order_time'), title: order.get('orderTimeSlot') }))
            .uniqBy('datetime')
            .sortBy('datetime');
    }

    @computed('model.@each.{status}')
    get ordersCountsByStatus() {
        const orders = this.get('model');

        return orders.reduce((acc, order) => {
            if (!acc[order.status]) {
                acc[order.status] = 0;
            }

            acc[order.status]++;

            return acc;
        }, {});
    }

    /**
     * @param {string} cursor pagination token
     * @param {string} dir "before" or "after"
     */
    @(task(function*(cursor, dir) {
        try {
            const params = { include: 'order-items', limit: 5 };
            params[dir] = cursor;

            const orders = yield this.store.query('order', params);
            this.model.addObjects(orders.toArray());
        } catch (reason) {
            this.flashMessages.danger('Ajaj, nějak se to porouchalo. Zkus to znovu.');
        }
    }).drop())
    loadMoreOrders;
}
