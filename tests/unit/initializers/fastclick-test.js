import Application from '@ember/application';

import { initialize } from 'tortuga-kitchen/initializers/fastclick';
import { module, test } from 'qunit';
import { run } from '@ember/runloop';

module('Unit | Initializer | fastclick', function(hooks) {
  hooks.beforeEach(function() {
    this.TestApplication = Application.extend();
    this.TestApplication.initializer({
      name: 'initializer under test',
      initialize
    });

    this.application = this.TestApplication.create({ autoboot: false });
  });

  hooks.afterEach(function() {
    run(this.application, 'destroy');
  });

  // Replace this with your real tests.
  test('it works', async function(assert) {
    await this.application.boot();

    assert.ok(true);
  });
});
