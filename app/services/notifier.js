import Service from '@ember/service';
import { inject as service } from '@ember/service';
import Push from 'push.js';

export default class NotifierService extends Service {
    @service flashMessages;

    constructor() {
        super(...arguments);

        Push.Permission.request(
            () => {
                this.notify('Notifikace zapnuty!');
            },
            () => {
                this.flashMessages.danger('Doporučuju zapnout notifikace - stačí obnovit stránku a dotaz potvrdit.');
            }
        );
    }

    notify(title = '', text = '') {
        if (!title) {
            return;
        }

        Push.create(title, {
            body: text,
            icon: '/assets/icons/favicon-96x96.png',
            timeout: 10000,
            vibrate: true,

            onClick() {
                window.focus();
                this.close();
            },

            onShow() {
                const audio = new Audio('/assets/audio/cheer.mp3');

                var playPromise = audio.play();

                if (playPromise !== undefined) {
                    playPromise.catch((/*error*/) => {
                        // Safari might not allow playing sound
                    });
                }
            },
        });
    }
}
