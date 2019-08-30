import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import moment from 'moment';
import cancelReasons from 'tortuga-kitchen/dicts/cancel-reasons';
import rejectReasons from 'tortuga-kitchen/dicts/reject-reasons';

export default class OrderCardComponent extends Component {
    @service customerInspector;
    @service feedFilters;
    @service optionsModal;
    @service orderManager;

    classNames = ['order-card', 'card'];
    classNameBindings = ['order.status', 'isCollapsed:order-card--is-collapsed', 'isFrozen:order-card--is-frozen'];
    attributeBindings = ['isExpandedForAria:aria-expanded'];

    // model
    order = {};

    @computed('order.order_time')
    get isFrozen() {
        // if its after midnight < 5am, we still open yesterday's orders for manipulation
        if (moment().format('H') < 5) {
            return moment(this.order.order_time) < moment().subtract(1, 'day');
        }

        // has to be the same day
        return moment(this.order.order_time).format('YYYY-MM-DD') != moment().format('YYYY-MM-DD');
    }

    @computed('order.is_collapsed')
    get isExpandedForAria() {
        return this.order.get('is_collapsed') ? 'false' : 'true';
    }

    // force expand based on filters (otherwise respect the flag)
    @computed('order.is_collapsed', 'feedFilters.filters.[]')
    get isCollapsed() {
        // force expand for Pickup, Chest and Trash
        if (
            this.feedFilters.isGroupActive('readyForPickup') ||
            this.feedFilters.isGroupActive('completed') ||
            this.feedFilters.isGroupActive('trashed')
        ) {
            return false;
        }

        return this.order.is_collapsed;
    }

    @(task(function*() {
        yield this.orderManager.pushOrderDown.unlinked().perform(this.order);
    }).drop())
    pushOrderDown;

    @(task(function*(status, otherAttributes = null) {
        yield this.orderManager.changeStatus.unlinked().perform(this.order, status, otherAttributes);
    }).drop())
    changeStatus;

    @action
    toggleExpandCollapse() {
        this.order.set('is_collapsed', !this.order.get('is_collapsed'));
    }

    @action
    markOrderAsNew() {
        this.changeStatus.perform('received');
    }

    @action
    markOrderAsReadyForPickup() {
        this.changeStatus.perform('made');
    }

    @action
    markOrderAsOnTheGrill() {
        this.changeStatus.perform('processing');
    }

    @action
    markOrderAsRejectedOrCancelled() {
        // new order = reject
        if (this.order.get('isNew')) {
            const rejectOptions = Object.keys(rejectReasons).map(key => {
                return {
                    value: key,
                    title: rejectReasons[key].title,
                    contextClass: 'is-dark',
                };
            });

            this.optionsModal.open(
                'Odmítnutí objednávky',
                [
                    'Z jakého důvodu se chystáš tuhle objednávku odmítnout?',
                    'Zákazník bude o zrušení informován SMSkou.',
                ],
                'is-danger',
                rejectOptions,
                reason => {
                    return this.orderManager.changeStatus.unlinked().perform(this.order, 'rejected', {
                        rejected_reason: reason,
                    });
                }
            );
        }
        // already spent time = cancel
        else {
            const cancelOptions = Object.keys(cancelReasons).map(key => {
                return {
                    value: key,
                    title: cancelReasons[key].title,
                    contextClass: `is-danger ${cancelReasons[key].affects_score ? '' : 'is-outlined'}`,
                };
            });

            this.optionsModal.open(
                'Zrušení objednávky',
                [
                    'Z jakého důvodu se chystáš tuhle objednávku zrušit?',
                    'Tlačítka s výplní jsou důvody, které se odrazí negativně na zákaznikovo skóre.',
                ],
                'is-danger',
                cancelOptions,
                reason => {
                    return this.orderManager.changeStatus.perform(this.order, 'cancelled', {
                        cancelled_reason: reason,
                    });
                }
            );
        }
    }

    @action
    markOrderAsCompleted() {
        this.changeStatus.perform('completed');
    }
}
