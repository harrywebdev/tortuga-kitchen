import DS from 'ember-data';
import config from 'tortuga-kitchen/config/environment';

export default DS.JSONAPIAdapter.extend({
    host: config.api.host,
    namespace: 'api',
});
