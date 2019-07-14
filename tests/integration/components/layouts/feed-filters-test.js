import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | layouts/feed-filters', function(hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`{{layouts/feed-filters}}`);

        assert.equal(this.element.querySelectorAll('.feed-filters').length, 1);
    });
});
