import SessionService from 'ember-simple-auth/services/session';
import { task } from 'ember-concurrency';

export default class TatrgelSessionService extends SessionService {
    @task(function*(username, password) {
        return yield this.authenticate('authenticator:tatrgel', username, password, '*', {
            Accept: 'application/vnd.api+json',
        });
    })
    login;
}
