import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { isPresent } from '@ember/utils';
import config from 'tortuga-kitchen/config/environment';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
    host: config.api.host,
    namespace: 'api',

    authorize(xhr) {
        let { access_token } = this.get('session.data.authenticated');

        if (isPresent(access_token)) {
            xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
        }
    },
});
