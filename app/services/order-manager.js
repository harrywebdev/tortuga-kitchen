import Service from '@ember/service';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import moment from 'moment';
import OrderStatusChangedEvent from 'tortuga-kitchen/events/order-status-changed';
import OrderDelayedEvent from 'tortuga-kitchen/events/order-delayed';

export default class OrderManagerService extends Service {
    @service appLogger;
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

            this.appLogger.reportToAnalytics(new OrderStatusChangedEvent(status));

            return true;
        } catch (reason) {
            order.rollbackAttributes();

            // persist for visual indication
            order.set('failedSave', true);

            let serverError = null;
            if (reason.errors && reason.errors.length) {
                serverError = JSON.stringify(reason.errors[0]);
            }

            this.appLogger.error(reason, true, serverError);
            this.flashMessages.danger(`Ajaj, nepovedlo se změnit stav objednávky. Zkus prosím znovu.`);
            return false;
        }
    }).drop())
    changeStatus;

    @(task(function*(order) {
        order.set(
            'order_time',
            moment(order.order_time)
                .add(30, 'm')
                .toDate()
        );

        try {
            yield order.save();
            order.set('failedSave', false);

            this.appLogger.reportToAnalytics(new OrderDelayedEvent(order.order_time));
        } catch (reason) {
            order.rollbackAttributes();

            // persist for visual indication
            order.set('failedSave', true);

            // check if it's actually just not acceptable order time
            if (reason.errors && reason.errors.length && reason.errors[0].status === 409) {
                this.flashMessages.danger(`Objednávku nelze posunout mimo otevírací dobu.`);
                return;
            }

            let serverError = null;
            if (reason.errors && reason.errors.length) {
                serverError = JSON.stringify(reason.errors[0]);
            }

            this.appLogger.error(reason, true, serverError);
            this.flashMessages.danger(`Ajaj, nepovedlo se změnit čas objednávky. Zkus prosím znovu.`);
        }
    }).drop())
    pushOrderDown;
}
