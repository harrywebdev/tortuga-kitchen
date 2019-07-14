import Service from '@ember/service';

export default class CustomerInspectorService extends Service {
    customer = null;

    inspect(customer) {
        this.set('customer', customer);
    }

    finish() {
        this.set('customer', null);
    }
}
