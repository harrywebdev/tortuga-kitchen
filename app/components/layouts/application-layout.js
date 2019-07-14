import Component from '@ember/component';
import { action } from '@ember/object';
import { later } from '@ember/runloop';

export default class ApplicationLayoutComponent extends Component {
    classNames = ['application-layout'];

    isSafeModeSwitchCollapsed = true;

    @action
    slideSafeModeIn() {
        this.set('isSafeModeSwitchCollapsed', false);

        later(() => {
            this.set('isSafeModeSwitchCollapsed', true);
        }, 2000);
    }
}
