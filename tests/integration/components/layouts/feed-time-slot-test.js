import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | layouts/feed-time-slot', function(hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });
        this.set('orders', []);

        await render(hbs`{{layouts/feed-time-slot slot="18:15" orders=orders}}`);

        assert.equal(this.element.querySelectorAll('.feed-time-slot').length, 1);
    });
});
