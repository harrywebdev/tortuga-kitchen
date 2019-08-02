import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
    
export default class OrderCardComponent extends Component {
    @service customerInspector;
    @service feedFilters;
    @service flashMessages;

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

    hideTimeSlot = false;

    hasOptionsMenuOpen = false;

    /**
     * Change status instantly.
     * @param {string} status
     */
    changeStatus(status) {
        this.set('previousOrderState', this.order.get('status'));

        this.order.set('status', status);
        this.order.save().catch(reason => {
            const error =
                reason.errors && reason.errors.length
                    ? `${reason.errors[0].title} - ${reason.errors[0].detail}`
                    : JSON.stringify(reason);

            console.error('Could not update Order status', error);
            this.flashMessages.danger(`Could not update Order status: ${error}`);
            this.order.set('status', this.get('previousOrderState'));
        });
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
        this.changeStatus('received');
    }

    @action
    markOrderAsReadyForPickup() {
        this.changeStatus('made');
    }

    @action
    markOrderAsOnTheGrill() {
        this.changeStatus('processing');
    }

    @action
    markOrderAsRejectedOrCancelled() {
        this.changeStatus(this.order.get('isNew') ? 'rejected' : 'cancelled');
    }

    @action
    resetOrderToPreviousState() {
        this.changeStatus(this.previousOrderState, true);
    }

    @action
    markOrderAsCompleted() {
        this.changeStatus('completed');
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
