import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | order-card', function(hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        this.set('order', { get: function() {} });

        await render(hbs`<OrderCard @order={{order}} />`);

        assert.equal(this.element.querySelectorAll('.order-card').length, 1);
    });
});
