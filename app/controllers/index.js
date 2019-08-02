import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class IndexController extends Controller {
    @service feedFilters;

    @computed('model.@each.{status,orderTimeSlot}', 'feedFilters.filters.[]')
    get feedOrders() {
        const orders = this.get('model');

        return orders.filter(order => this.feedFilters.isStatusActive(order.status));
    }

    @computed('feedOrders')
    get feedSlots() {
        const orders = this.get('feedOrders');

        return orders
            .map(order => order.get('orderTimeSlot'))
            .uniq()
            .sort();
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
}
