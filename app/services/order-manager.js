import Service from '@ember/service';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class OrderManagerService extends Service {
    @service flashMessages;

    /**
     * Change status instantly.
     * @param {Model} order
     * @param {string} status
     * @param {object|null} otherAttributes
     */
    @(task(function*(order, status, otherAttributes = null) {
        order.set('status', status);

        if (otherAttributes !== null) {
            Object.keys(otherAttributes).forEach(key => {
                order.set(key, otherAttributes[key]);
            });
        }

        try {
            yield order.save();
            order.set('failedSave', false);

            return true;
        } catch (reason) {
            order.rollbackAttributes();

            // persist for visual indication
            order.set('failedSave', true);

            const error =
                reason.errors && reason.errors.length
                    ? `${reason.errors[0].title} - ${reason.errors[0].detail}`
                    : JSON.stringify(reason);

            console.error('Could not update Order status', error);
            this.flashMessages.danger(`Could not update Order status: ${error}`);

            return false;
        }
    }).drop())
    changeStatus;

    @(task(function*(order) {
        order.set(
            'order_time',
            moment(order.order_time)
                .add(30, 'm')
                .toISOString(true)
        );

        try {
            yield order.save();
            order.set('failedSave', false);
        } catch (reason) {
            order.rollbackAttributes();

            // persist for visual indication
            order.set('failedSave', true);

            const error =
                reason.errors && reason.errors.length
                    ? `${reason.errors[0].title} - ${reason.errors[0].detail}`
                    : JSON.stringify(reason);

            console.error('Could not update Order time', error);
            this.flashMessages.danger(`Could not update Order time: ${error}`);
        }
    }).drop())
    pushOrderDown;
}
