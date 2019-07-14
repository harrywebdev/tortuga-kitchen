import Service from '@ember/service';

export default class SafeModeService extends Service {
    state = true;

    turnOn() {
        this.set('state', true);
    }

    turnOff() {
        this.set('state', false);
    }
}
