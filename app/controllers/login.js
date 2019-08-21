import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class LoginController extends Controller {
    @service appLogger;
    @service session;

    username = '';
    password = '';

    error = null;

    @task(function*(username, password) {
        this.set('error', null);

        try {
            yield this.session.login.perform(username, password);
        } catch (e) {
            this.set(
                'error',
                e && e.error === 'invalid_credentials' ? 'Chybné údaje. Zkus znovu.' : 'Přihlášení se nezdařilo. Zkus znovu.'
            );

            if (!e || e.error !== 'invalid_credentials') {
                this.appLogger.error(e);
            }
        }
    })
    login;

    @computed('login.isRunning', 'username', 'password')
    get isSubmitDisabled() {
        return this.login.isRunning || !this.username || !this.password;
    }
}
