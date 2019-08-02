import Service from '@ember/service';
import { not, alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class KitchenStateService extends Service {
    @service flashMessages;
    @service store;

    settings = {};
    @alias('settings.is_open_for_booking') isOpen;

    @not('isOpen') isClosed;

    initShop(settings) {
        this.set('settings', settings);
    }

    @(task(function*() {
        this.settings.set('is_open_for_booking', false);

        try {
            yield this.settings.save();
        } catch (e) {
            this.settings.rollbackAttributes();
            this.flashMessages.danger('Ajaj, asi spadnul server. Zkus obnovit stránku.', {
                sticky: true,
            });
        }
    }).drop())
    closeShop;

    @(task(function*() {
        this.settings.set('is_open_for_booking', true);

        try {
            yield this.settings.save();
        } catch (e) {
            this.settings.rollbackAttributes();
            this.flashMessages.danger('Ajaj, asi spadnul server. Zkus obnovit stránku.', {
                sticky: true,
            });
        }
    }).drop())
    openShop;
}
