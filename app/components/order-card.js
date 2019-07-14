import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { later, cancel } from '@ember/runloop';
import { Promise as EmberPromise } from 'rsvp';

export default class OrderCardComponent extends Component {
    @service customerInspector;
    @service feedFilters;

    classNames = ['order-card', 'card'];
    classNameBindings = ['orderStatus', 'isCollapsed:order-card--is-collapsed', 'changingStatus:order-card--disappear'];
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

    // to temporarily override order status for visual purposes
    orderVisualStatus = null;
    changingStatus = false;

    @computed('order.status', 'orderVisualStatus')
    get orderStatus() {
        if (this.orderVisualStatus) {
            return this.orderVisualStatus;
        }

        return this.order.get('status');
    }

    // local state of manipulation of Order
    // changing state will most likely be API driven and
    // this will be scrapped or used just temporarily
    previousOrderState = 'received';

    hideTimeSlot = false;
    cardActionTimer = null;

    hasOptionsMenuOpen = false;

    get randomBurgers() {
        return Math.floor(Math.random() * Math.floor(4));
    }

    get randomSides() {
        return Math.floor(Math.random() * Math.floor(4));
    }

    get randomDrinks() {
        return Math.floor(Math.random() * Math.floor(4));
    }

    /**
     * If changing status means filtering order out, then animate:
     * Change visual status, then collapse and disappear, then set
     * real order status to possibly rearrange the card into another
     * swim lane.
     *
     * Otherwise, change status instantly and collapse a card.
     * @param {string} status
     */
    changeStatus(status) {
        cancel(this.cardActionTimer);
        this.cardActionTimer = null;
        this.set('previousOrderState', this.order.get('status'));

        if (this.feedFilters.isStatusActive(status)) {
            this.order.set('status', status);
            return;
        }

        this.set('orderVisualStatus', status);

        later(() => {
            this.set('changingStatus', true);

            later(() => {
                this.order.set('status', status);
                this.set('changingStatus', false);
                this.set('orderVisualStatus', null);
            }, 250);
        }, 500);
    }

    collapseCard(now = false) {
        if (now) {
            return this.order.set('is_collapsed', true);
        }

        return new EmberPromise(resolve => {
            this.cardActionTimer = later(() => {
                this.order.set('is_collapsed', true);
                resolve();
            }, 250);
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
