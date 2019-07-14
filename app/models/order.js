import DS from 'ember-data';
import { computed } from '@ember/object';
const { Model, attr, hasMany, belongsTo } = DS;

export default Model.extend({
    items: hasMany('order-item'),
    customer: belongsTo('customer'),

    delivery_type: attr('string'),
    payment_type: attr('string'),
    order_time: attr('string'),
    is_takeaway: attr('boolean', { defaultValue: false }),

    status: attr('string'),
    subtotal_amount: attr('number'),
    delivery_amount: attr('number'),
    extra_amount: attr('number'),
    total_amount: attr('number'),
    currency: attr('string'),

    created_at: attr('date'),
    updated_at: attr('date'),

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

    formattedTotalAmount: computed('total_amount', function() {
        return (this.get('total_amount') / 100).toLocaleString('cs-CZ', {
            style: 'currency',
            currency: 'CZK',
            minimumFractionDigits: 0,
        });
    }),

    hasHighPriceWarning: computed('total_amount', function() {
        // TODO: configurable number, in cents
        return this.get('total_amount') > (700 * 100);
    }),
});
