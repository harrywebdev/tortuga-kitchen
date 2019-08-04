import Route from '@ember/routing/route';
import moment from 'moment';

export default class ApplicationRoute extends Route {
    beforeModel() {
        super.beforeModel(...arguments);

        moment().locale('cs');
    }
}
