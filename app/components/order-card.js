import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default class OrderCardComponent extends Component {
    @service customerInspector;
    @service feedFilters;
    @service orderStatus;

    classNames = ['order-card', 'card'];
    classNameBindings = ['order.status', 'isCollapsed:order-card--is-collapsed'];
    attributeBindings = ['isExpandedForAria:aria-expanded'];

    // model
    order = {};

    hideTimeSlot = false;
    hasOptionsMenuOpen = false;

    @alias('orderStatus.changeStatus') changeStatus;

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
        this.orderStatus.changeStatus.perform(this.order, 'received');
    }

    @action
    markOrderAsReadyForPickup() {
        this.orderStatus.changeStatus.perform(this.order, 'made');
    }

    @action
    markOrderAsOnTheGrill() {
        this.orderStatus.changeStatus.perform(this.order, 'processing');
    }

    @action
    markOrderAsRejectedOrCancelled() {
        this.orderStatus.changeStatus.perform(this.order, this.order.get('isNew') ? 'rejected' : 'cancelled');
    }

    @action
    markOrderAsCompleted() {
        this.orderStatus.changeStatus.perform(this.order, 'completed');
    }

    @action
    pushOrderDown() {
        throw Error('This should be done on the server.');

        // eslint-disable-next-line
        const [all, hours, minutes] = this.order.get('order_time').match(/([0-9]{2}):([0-9]{2})/);

        // a little hacky - 00 get +30
        if (minutes !== '30') {
            return this.order.set('order_time', `${hours}:30`);
        }

        // otherwise bump hour and set to 00
        const newHour = hours === '23' ? '00' : (parseInt(hours, 10) + 1).toString().padStart(2, '0');

        this.order.set('order_time', `${newHour}:00`);
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
