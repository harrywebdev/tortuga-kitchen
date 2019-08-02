import DS from 'ember-data';
const { Model, attr } = DS;

export default Model.extend({
    is_open_for_booking: attr('boolean'),
});
