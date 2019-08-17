import DS from 'ember-data';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import moment from 'moment';
import cancelReasons from 'tortuga-kitchen/dicts/cancel-reasons';
import rejectReasons from 'tortuga-kitchen/dicts/reject-reasons';

const { Model, attr, hasMany, belongsTo } = DS;

export default Model.extend({
    orderItems: hasMany('order-item'),
    customer: belongsTo('customer'),

    delivery_type: attr('string'),
    payment_type: attr('string'),
    order_time: attr('string'),
    is_takeaway: attr('boolean', { defaultValue: false }),
    rejected_reason: attr('string'),
    cancelled_reason: attr('string'),

    status: attr('string'),
    subtotal_amount: attr('number'),
    delivery_amount: attr('number'),
    extra_amount: attr('number'),
    total_amount: attr('number'),
    formatted_total_amount: attr('string'),
    currency: attr('string'),

    created_at: attr('date'),
    updated_at: attr('date'),

    // hacky pagination
    pagination: attr(),

    // local presentation things
    is_collapsed: attr('boolean', { defaultValue: false }),
    is_in_grill_feed: attr('boolean', { defaultValue: true }),

    isCompleted: computed('status', function() {
        return this.get('status') === 'completed';
    }),

    isReadyForPickup: computed('status', function() {
        return this.get('status') === 'made';
    }),

    isOnTheGrill: computed('status', function() {
        return this.get('status') === 'processing';
    }),

    isNew: computed('status', function() {
        return ['received', 'accepted'].includes(this.get('status'));
    }),

    isTrashed: computed('status', function() {
        return ['rejected', 'cancelled'].includes(this.get('status'));
    }),

    isCancelledByCustomer: computed('status', 'cancelled_reason', function() {
        return this.get('status') === 'cancelled' && this.get('cancelled_reason') === 'delayed_order';
    }),

    cancelledReason: computed('status', 'cancelled_reason', function() {
        return this.get('status') === 'cancelled' && this.get('cancelled_reason')
            ? `Zrušeno: ${cancelReasons[this.get('cancelled_reason')].title}`
            : null;
    }),

    rejectedReason: computed('status', 'rejected_reason', function() {
        return this.get('status') === 'rejected' && this.get('rejected_reason')
            ? `Odmítnuto: ${rejectReasons[this.get('rejected_reason')].title}`
            : null;
    }),

    formattedTotalAmount: alias('formatted_total_amount'),

    hasHighPriceWarning: computed('total_amount', function() {
        // TODO: configurable number, in cents
        return this.get('total_amount') > 700 * 100;
    }),

    orderTimeSlot: computed('order_time', function() {
        return moment(this.get('order_time')).format('HH:mm');
    }),
});
