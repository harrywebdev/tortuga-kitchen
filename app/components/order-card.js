import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

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

    @alias('orderManager.changeStatus') changeStatus;

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
        this.orderManager.changeStatus.perform(this.order, 'received');
    }

    @action
    markOrderAsReadyForPickup() {
        this.orderManager.changeStatus.perform(this.order, 'made');
    }

    @action
    markOrderAsOnTheGrill() {
        this.orderManager.changeStatus.perform(this.order, 'processing');
    }

    @action
    markOrderAsRejectedOrCancelled() {
        this.orderManager.changeStatus.perform(this.order, this.order.get('isNew') ? 'rejected' : 'cancelled');
    }

    @action
    markOrderAsCompleted() {
        this.orderManager.changeStatus.perform(this.order, 'completed');
    }

    @action
    pushOrderDown() {
        this.orderManager.pushOrderDown.perform(this.order);
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
