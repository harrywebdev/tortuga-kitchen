import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class OrderCardComponent extends Component {
    @service customerInspector;
    @service feedFilters;
    @service optionsModal;
    @service orderManager;

    classNames = ['order-card', 'card'];
    classNameBindings = ['order.status', 'isCollapsed:order-card--is-collapsed'];
    attributeBindings = ['isExpandedForAria:aria-expanded'];

    // model
    order = {};

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
            const rejectOptions = [
                { value: 'no_time', title: 'Není čas, nestíháme.', contextClass: 'is-dark' },
                { value: 'missing_product', title: 'Nemáme objednaný produkt.', contextClass: 'is-dark' },
                { value: 'on_request', title: 'Na žádost zákazníka.', contextClass: 'is-dark' },
                { value: 'no_reason', title: 'Bez důvodu.', contextClass: 'is-dark' },
                { value: 'is_invalid', title: 'Je to blbost.', contextClass: 'is-dark' },
            ];
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
            const cancelOptions = [
                { value: 'new_order', title: 'Nová objednávka.', contextClass: 'is-danger is-outlined' },
                { value: 'no_reason', title: 'Bez důvodu.', contextClass: 'is-danger is-outlined' },
                { value: 'no_show', title: 'Zákazník nepřišel :(', contextClass: 'is-danger' },
                { value: 'on_request', title: 'Na žádost zákazníka.', contextClass: 'is-danger' },
            ];
            this.optionsModal.open(
                'Zrušení objednávky',
                [
                    'Z jakého důvodu se chystáš tuhle objednávku zrušenit?',
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

    @action
    inspectCustomer() {
        // TODO: pass in real customer
        this.customerInspector.inspect({
            name: 'Hery Potr',
            mobile_number: '732676850',
            reg_type: 'mobile',
        });
    }
}
