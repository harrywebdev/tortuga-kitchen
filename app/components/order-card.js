import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class OrderCardComponent extends Component {
    @service customerInspector;
    @service feedFilters;
    @service orderManager;

    classNames = ['order-card', 'card'];
    classNameBindings = ['order.status', 'isCollapsed:order-card--is-collapsed'];
    attributeBindings = ['isExpandedForAria:aria-expanded'];

    // model
    order = {};

    hideTimeSlot = false;
    hasOptionsMenuOpen = false;

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

    @(task(function*(status) {
        yield this.orderManager.changeStatus.unlinked().perform(this.order, status);
    }).drop())
    changeStatus;

    @action
    toggleOptionsMenu() {
        this.toggleProperty('hasOptionsMenuOpen');
    }

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
        this.changeStatus.perform(this.order.get('isNew') ? 'rejected' : 'cancelled');
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
