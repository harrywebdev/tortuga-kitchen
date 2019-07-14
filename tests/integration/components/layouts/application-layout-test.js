import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | layouts/application-layout', function(hooks) {
    setupRenderingTest(hooks);

    skip('it renders', async function(assert) {
        await render(hbs`{{layouts/application-layout}}`);

        assert.equal(this.element.querySelectorAll('.application-layout').length, 1);
    });
});
