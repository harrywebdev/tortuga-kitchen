import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import config from 'tortuga-kitchen/config/environment';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class IndexRoute extends Route.extend(AuthenticatedRouteMixin, {}) {
    @service flashMessages;
    @service kitchenState;
    @service notifier;
    @service websocket;
    @service store;

    beforeModel() {
        super.beforeModel(...arguments);

        // now when authenticate we can log out
        this.websocket.connect();
    }

    model() {
        return this.store.query('order', { include: 'order-items', limit: 5 });
    }

    afterModel() {
        super.afterModel(...arguments);
        this.pollForOrders.perform();
        this._realtimeOrderLoading();

        this.store.find('setting', '1').then(
            settings => {
                this.kitchenState.initShop(settings);
            },
            () => {
                this.flashMessages.danger('Ajaj, asi spadnul server. Zkus obnovit stránku.', {
                    sticky: true,
                });
            }
        );
    }

    setupController(controller, model) {
        super.setupController(...arguments);

        controller.set('model', model.toArray());
    }

    /**
     * Fallback polling in case the socket is down
     */
    @(task(function*() {
        let attempts = 0;

        while (true) {
            yield timeout(config.polling.timeout);

            // only do long polling this when websocket does not work
            if (!this.websocket.isOnline) {
                try {
                    const orders = yield this.store.findAll('order', { include: 'order-items', reload: true });
                    attempts = 0;

                    this._addNewOrdersToModel(orders);
                } catch (e) {
                    attempts++;
                    if (attempts > config.polling.retries) {
                        this.flashMessages.danger('Ajaj, asi spadnul server. Zkus obnovit stránku.', {
                            sticky: true,
                        });
                        return false;
                    }
                }
            }
        }
    })
        .cancelOn('deactivate')
        .restartable())
    pollForOrders;

    /**
     * Push Orders to Model and notify via browser notification
     * In case there are no items in Model, transition to Index
     * (recovery from error state)
     * @param {Array} orders
     */
    _addNewOrdersToModel(orders) {
        const model = this.controllerFor('index').get('model');

        if (!model) {
            this.controllerFor('index').set('model', orders);
            this.transitionTo('index');
        } else {
            const modelOrderIds = model.map(order => order.id);

            // add orders
            model.addObjects(orders);

            // notify if order is not present in the model already
            const newOrders = orders.filter(order => !modelOrderIds.includes(order.id));
            if (newOrders.length > 0) {
                this.notifier.notify(
                    newOrders.length === 1 ? 'Nová objednávka' : `Nové objednávky (${newOrders.length})`
                );
            }
        }
    }

    /**
     * Listen on socket `order.received` event, create Order record from that data and push it to the model
     */
    _realtimeOrderLoading() {
        this.websocket.subscribe('private-orders', [
            {
                eventName: 'order.received',
                eventHandler: data => {
                    const modelClass = this.store.modelFor('order');
                    const serializer = this.store.serializerFor('order');
                    const normalized = serializer.normalizeQueryResponse(this.store, modelClass, data);

                    this._addNewOrdersToModel(this.store.push(normalized));
                },
            },
        ]);
    }

    @action
    error() {
        // try to come back up
        this.pollForOrders.perform();
        return true;
    }
}
