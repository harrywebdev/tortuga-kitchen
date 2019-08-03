import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { not } from '@ember/object/computed';

export default class OnOffSwitchComponent extends Component {
    @service kitchenState;

    classNames = ['on-off-switch'];

    isOn = false;
    onLabel = '';
    offLabel = '';

    @not('isOn') isOff;
}
