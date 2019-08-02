import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import config from 'tortuga-kitchen/config/environment';

export default class IndexRoute extends Route.extend({
    /**
     * Fallback polling in case the socket is down
     * TODO: check for websocket connection status
     */
    pollForOrders: task(function*() {
        let attempts = 0;

        // TODO: only do this when websocket does not work

        while (true) {
            yield timeout(config.polling.timeout);

            try {
                const orders = yield this.get('store').findAll('order', { include: 'order-items', reload: true });
                attempts = 0;

                const model = this.controllerFor('index').get('model');
                if (!model) {
                    this.controllerFor('index').set('model', orders);
                    this.transitionTo('index');
                } else {
                    model.addObjects(orders);
                }
            } catch (e) {
                attempts++;
                if (attempts > config.polling.retries) {
                    this.flashMessages.danger('Ajaj, asi spadnul server. Zkus obnovit stranku.', {
                        sticky: true,
                    });
                    return false;
                }
            }
        }
    })
        .cancelOn('deactivate')
        .restartable(),
}) {
    @service store;
    @service flashMessages;

    model() {
        return this.store.findAll('order', { include: 'order-items' });
    }

    afterModel() {
        this._super(...arguments);
        this.get('pollForOrders').perform();
    }

    @action
    error(error) {
        console.error('Route error', error);

        // try to come back up
        this.get('pollForOrders').perform();
        return true;
    }
}
