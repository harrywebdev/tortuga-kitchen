import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | safe-mode-switch', function(hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`<SafeModeSwitch />`);

        assert.equal(this.element.querySelectorAll('.safe-mode-switch').length, 1);
    });
});
