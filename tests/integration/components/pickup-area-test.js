import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | layouts/pickup-area', function(hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`<Layouts::PickupArea />`);

        assert.equal(this.element.querySelectorAll('.pickup-area').length, 1);
    });
});
