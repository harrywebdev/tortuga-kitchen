import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { bool } from '@ember/object/computed';

export default class CustomerDetailsModalComponent extends Component {
    @service customerInspector;

    classNames = ['customer-details-modal'];

    @bool('customerInspector.customer') show;

    @action
    closeModal() {
        this.customerInspector.finish();
    }
}
