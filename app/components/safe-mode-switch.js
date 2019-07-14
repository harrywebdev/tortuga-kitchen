import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default class SafeModeSwitchComponent extends Component {
    @service safeMode;

    classNames = ['safe-mode-switch', 'card'];
    classNameBindings = ['isChecked:safe-mode-switch--on'];

    @alias('safeMode.state') isChecked;

    @action
    toggleSafeMode() {
        if (this.isChecked) {
            this.safeMode.turnOff();
        } else {
            this.safeMode.turnOn();
        }
    }
}
