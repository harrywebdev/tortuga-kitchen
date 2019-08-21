import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import moment from 'moment';

export default class ApplicationRoute extends Route.extend(ApplicationRouteMixin, {}) {
    beforeModel() {
        super.beforeModel(...arguments);

        moment().locale('cs');
    }
}
