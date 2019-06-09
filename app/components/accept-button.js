import Component from '@ember/component';
import { action } from '@ember/object';

export default class AcceptButtonComponent extends Component {
    classNames = ['accept-button'];

    isDisabled = true;
    hasAutoAcceptMenuOpen = false;

    @action
    toggleAutoAcceptMenu() {
        this.toggleProperty('hasAutoAcceptMenuOpen');
    }
}
