import Component from '@ember/component';
import { action } from '@ember/object';

export default class SafeModeSwitchComponent extends Component {
    classNames = ['safe-mode-switch'];

    isChecked = true;

    @action
    toggleSafeMode() {
        this.toggleProperty('isChecked');
    }
}
