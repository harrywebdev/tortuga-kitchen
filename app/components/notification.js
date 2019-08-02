import Component from '@ember/component';
import { action, computed } from '@ember/object';

export default class NotificationComponent extends Component {
    classNameBindings = ['type'];
    classNames = ['notification'];

    click() {
        this.flash.destroyMessage();
    }

    @computed('flash.type')
    get type() {
        return `is-${this.get('flash.type')}`;
    }

    @action
    close() {
        this.flash.destroyMessage();
    }
}
