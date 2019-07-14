import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
    @service store;

    model() {
        // HACK: generate ordrs
        let times = [];
        for (var j = 0; j < 10; j++) {
            let hour = new Date().getHours() + j;
            hour = hour > 23 ? hour - 24 : hour;
            times.push(`${hour}:${'00'}`.padStart(5, '0'));
            times.push(`${hour}:${'30'}`.padStart(5, '0'));
        }

        let orders = [];
        for (var i = 0; i <= 15; i++) {
            orders.push(
                this.store.createRecord('order', {
                    id: i + 1,
                    order_time: times[i % 3 || i / 3],
                    customer_name: ['Hery Potr', 'Nikki Lauda', 'Tom Morello', 'Dolph Lundgren'][
                        Math.floor(Math.random() * Math.floor(4))
                    ],
                    status: 'received',
                    total_amount: Math.floor(Math.random() * Math.floor(100400)),
                    is_takeaway: Math.floor(Math.random() * Math.floor(2)),
                    is_collapsed: !times.slice(0, 2).includes(times[i % 3 || i / 3]) || i > 5,
                })
            );
        }
        return orders;
    }
}
