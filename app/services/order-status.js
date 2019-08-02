import Service from '@ember/service';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default class OrderStatusService extends Service {
    @service flashMessages;

    /**
     * Change status instantly.
     * @param {Model} order
     * @param {string} status
     */
    @(task(function*(order, status) {
        order.set('status', status);

        try {
            yield order.save();
        } catch (reason) {
            order.rollbackAttributes();

            const error =
                reason.errors && reason.errors.length
                    ? `${reason.errors[0].title} - ${reason.errors[0].detail}`
                    : JSON.stringify(reason);

            console.error('Could not update Order status', error);
            this.flashMessages.danger(`Could not update Order status: ${error}`);
        }
    }).drop())
    changeStatus;
}
