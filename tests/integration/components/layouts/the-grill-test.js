import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | layouts/the-grill', function(hooks) {
    setupRenderingTest(hooks);

    skip('it renders', async function(assert) {
        await render(hbs`<Layouts::TheGrill />`);

        assert.equal(this.element.querySelectorAll('.the-grill').length, 1);
    });
});
