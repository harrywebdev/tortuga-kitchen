import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | customer-details-modal', function(hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`<CustomerDetailsModal />`);

        assert.equal(this.element.querySelectorAll('.customer-details-modal').length, 1);
    });
});
